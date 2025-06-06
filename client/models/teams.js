import { Schema, models, model } from 'mongoose';
const openpgp = require('openpgp');

import encryptSecret from 'utils/encrypt';

const UserRefSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const VaultRefSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'Vault',
  },
});

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  aesKey: {
    type: String,
    required: true,
    unique: true
  },
  admins: [UserRefSchema],
  members: [UserRefSchema],
  vaults: [VaultRefSchema],
});

/* assign admin for the team */
TeamSchema.methods.assignAdmin = async function (userId) {
  const team = this;
  team.admins.push({ _id: userId });
  team.members.push({ _id: userId });
  await team.save();
};

/* adds a member in the team */
TeamSchema.methods.addMember = async function (userId) {
  const team = this;
  team.members.push({ _id: userId });
  await team.save();
};

/* removes a member from the team */
TeamSchema.methods.removeMember = async function (userId) {
  const team = this;

  team.members = team.members.filter((member) => {
    if (member._id && !member._id.equals(userId)) {
      return member;
    }
  });

  team.admins = team.admins.filter((admin) => {
    if (admin._id && !admin._id.equals(userId)) {
      return admin;
    }
  });
  await team.save();
};

TeamSchema.methods.reEncryptAes = async function (admin, publicKeys) {
  const team = this;

  /* admin private key */
  const encryptedPrivateKey = admin.privateKey; 
  /* read the encrypted pgp message */
  const privateKey = await openpgp.readMessage({ armoredMessage: encryptedPrivateKey });

  /* decrypt the stored private key */
  const decrypted = await openpgp.decrypt({
    message: privateKey,
    passwords: admin.password,
  });

  /* decrypt the private key using passphrase */
  const passphrase = process.env.PASSPHRASE;
  const decryptedPrivateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: decrypted.data }),
    passphrase
  });

  /* decrypt the aes key with admin's private key then simply encrypt it with the new public keyring */
  const {data: aesKey} = await openpgp.decrypt({
    message: await openpgp.readMessage({ armoredMessage: team.aesKey }),
    decryptionKeys: decryptedPrivateKey,
  });

  const newEncryptedAes = await encryptSecret(publicKeys, aesKey);
  team.aesKey = newEncryptedAes;
  await team.save();
}
/* if TeamSchema schema already exists, don't overwrite it */
export default models?.Team || model('Team', TeamSchema);
