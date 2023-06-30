import { connectToDatabase } from 'utils/connectDb';
import User from 'models/users';
import Team from 'models/teams';
import getAuthenticatedUser from 'utils/auth';
import Vault from 'models/vaults';
const openpgp = require('openpgp');

export default async (req, res) => {
  try {
    await connectToDatabase();

    const { jwt, name, email, makeAdmin } = req.body;

    const admin = await getAuthenticatedUser(jwt);
    const team = await Team.findOne({ name }).exec();
    const user = await User.findOne({ email }).exec();

    if (!team) {
      return res.status(200).json({ Info: 'Team does not exist' });
    }

    if (!user) {
      return res.status(200).json({ Info: 'User does not exist' });
    }
    const isAdmin = await team.admins.id(admin._id);

    if (!isAdmin) {
      return res.status(200).json({ Info: 'Only admins can add members!' });
    }

    const isAlreadyMember = await team.members.id(user._id);
    if (isAlreadyMember)
      return res.status(200).json({ Info: 'Cannot add a member twice' });

    makeAdmin ? await team.assignAdmin(user._id) : await team.addMember(user._id);

    /* get details of all the team members */
    const teamMembers = await team.populate('members._id').execPopulate();

    const publicKeys = [];

    /* get the public keys of all the team members */
    teamMembers.members.forEach((member) => {
      publicKeys.push(member._id.publicKey);
    });

    /* get the vault data */
    const vault = await Vault.findById(team.vaults[0]._id).exec();

    /* admin private key */
    const enPrivateKey = admin.privateKey;

    /* read the encrypted pgp message */
    const privateKey = await openpgp.readMessage({ armoredMessage: enPrivateKey });

    /* decrypt the stored private key */
    const decrypted = await openpgp.decrypt({
      message: privateKey,
      passwords: admin.password,
    });

    /* add the team id to the new member's team array */
    await user.addTeam(team._id);

    /* re-encrypt all the secrets */
    await vault.reEncrypt(publicKeys, decrypted.data);

    await user.notify(`You were added to ${name}!`);
    if (makeAdmin) {
      await user.notify(`You are now an admin for ${name}!`);
    }

    return res.status(200).json({ Info: 'Added new member successfully!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: 'Unable to add member' });
  }
};
