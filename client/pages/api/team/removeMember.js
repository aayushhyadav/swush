import { connectToDatabase } from 'utils/connectDb';
import User from 'models/users';
import Team from 'models/teams';
import Vault from 'models/vaults';
import getAuthenticatedUser from 'utils/auth';
const openpgp = require('openpgp');

export default async (req, res) => {
  try {
    await connectToDatabase();
    const { jwt, name, email } = req.body;

    const curUser = await getAuthenticatedUser(jwt);
    const user = await User.findOne({ email }).exec();
    const team = await Team.findOne({ name }).exec();

    if (!user) {
      res.status(200).json({ Info: 'User does not exist' });
      return;
    }

    if (!team) {
      res.status(200).json({ Info: 'Team does not exist' });
      return;
    }

    const isAdmin = team.admins.id(curUser._id);
    if (!isAdmin) {
      return res.status(200).json({ Info: 'Only admins can remove members!' });
    }

    const isNotRemoved = await team.members.id(user._id);
    if (!isNotRemoved)
      return res.status(200).json({ Info: 'User is not a member of this team' });
    await team.removeMember(user._id);

    const teamMembers = await team.populate('members._id').execPopulate();
    const publicKeys = [];
    teamMembers.members.forEach((member) => {
      publicKeys.push(member._id.publicKey);
    });

    const vault = await Vault.findById(team.vaults[0]._id).exec();
    const enPrivateKey = curUser.privateKey;
    const privateKey = await openpgp.readMessage({ armoredMessage: enPrivateKey });

    const decrypted = await openpgp.decrypt({
      message: privateKey,
      passwords: curUser.password,
    });

    await vault.reEncrypt(publicKeys, decrypted.data);
    await user.removeTeam(team._id);
    await user.notify(`You were removed from ${name}`);

    return res.status(200).json({ Info: 'Removed member successfully!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: 'Unable to remove member' });
  }
};
