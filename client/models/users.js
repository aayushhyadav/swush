import { Schema, models, model } from 'mongoose';
const openpgp = require('openpgp');

const TeamRefSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },

  teams: [TeamRefSchema],

  publicKey: {
    type: String,
    required: true,
  },
  privateKey: String,
  notifications: [String],
});

/**
 * Store the key(s) provided in the users collection.
 *
 * @param publicKey the public encryption key
 * @param privateKey (optional) the private encryption key
 */
UserSchema.methods.storeKeys = async function (privateKey = null) {
  const user = this;

  /* convert private key into message object for encryption */
  const message = openpgp.Message.fromText(privateKey);

  /* saving private key is optional */
  if (privateKey) {
    user.privateKey = await openpgp.encrypt({
      message,
      passwords: user.password,
    });
  }

  await user.save();
};

/* must be better ways using mongoose functions rather than JS Array methods */

/**
 * Add the given team to the user's teams array.
 *
 * @param teamId the
 */
UserSchema.methods.addTeam = async function (teamId) {
  const user = this;
  user.teams.push({ _id: teamId });
  await user.save();
};

UserSchema.methods.removeTeam = async function (teamId) {
  const user = this;
  user.teams = user.teams.filter((team) => {
    return !team._id.equals(teamId);
  });
  await user.save();
};

/* adds notifications */
UserSchema.methods.notify = async function (message) {
  const user = this;
  user.notifications.push(message);
  await user.save();
};

/* if User model already exists, don't overwrite it */
export default models?.User || model('User', UserSchema);
