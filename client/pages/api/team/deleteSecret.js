import { connectToDatabase } from 'utils/connectDb';
import getAuthenticatedUser from 'utils/auth';
import Team from 'models/teams';
import Vault from 'models/vaults';

export default async (req, res) => {
  try {
    await connectToDatabase();
    const { jwt, teamName, secretId } = JSON.parse(req.body);
    const user = await getAuthenticatedUser(jwt);

    const team = await Team.findOne({ name: teamName }).exec();
    var ssh;
    var oauth;
    var password;
    var files;

    if (!team) {
      return res.status(200).json({ Info: 'Team does not exist' });
    }

    // check if the user is a member of the team
    const isMember = await team.members.id(user._id);
    if (!isMember) return res.json('Not a team member');

    const vault = await Vault.findById(team.vaults[0]._id).exec();

    vault.ssh.forEach((key) => {
      if (key._id.equals(secretId)) {
        ssh = key;
      }
    });

    if (!ssh) {
      vault.oauth.forEach((key) => {
        if (key._id.equals(secretId)) {
          oauth = key;
        }
      });
    }

    if (!ssh && !oauth) {
      vault.password.forEach((key) => {
        if (key._id.equals(secretId)) {
          password = key;
        }
      });
    }

    if (!ssh && !oauth && !password) {
      vault.file.forEach((key) => {
        if (key._id.equals(secretId)) {
          files = key;
        }
      });
    }

    if (ssh) {
      await Vault.findOneAndUpdate(
        { _id: team.vaults[0]._id },
        { $pull: { ssh: { _id: secretId } } }
      );
    } else if (oauth) {
      await Vault.findOneAndUpdate(
        { _id: team.vaults[0]._id },
        { $pull: { oauth: { _id: secretId } } }
      );
    } else if (password) {
      await Vault.findOneAndUpdate(
        { _id: team.vaults[0]._id },
        { $pull: { password: { _id: secretId } } }
      );
    } else if (files) {
      await Vault.findOneAndUpdate(
        { _id: team.vaults[0]._id },
        { $pull: { file: { _id: secretId } } }
      );
    } else {
      return res.status(200).json({ Info: 'Secret does not exist' });
    }

    res.status(200).json({ Info: 'Done!' });
  } catch (error) {
    return res.status(500).json({ Error: 'Internal server error' });
  }
};
