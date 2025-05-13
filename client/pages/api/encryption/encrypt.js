import { connectToDatabase } from 'utils/connectDb';
import TeamDetails from 'models/teams';
import Vault from 'models/vaults';
import getAuthenticatedUser from 'utils/auth';
import encryptSecret from 'utils/encrypt';

export default async function (req, res) {
  try {
    await connectToDatabase();

    const { jwt, teamName, description, secret, secretType, filename } = req.body;
    const user = await getAuthenticatedUser(jwt);

    var isMember = false;

    const team = await TeamDetails.findOne({ name: teamName }).exec();
    if (!team) return res.json('Team does not exists');

    isMember = await team.members.id(user._id);
    if (!isMember) return res.json('Not a team member');

    const teamMembers = await team.populate('members._id').execPopulate();

    const publicKeys = [];
    teamMembers.members.forEach((member) => {
      publicKeys.push(member._id.publicKey);
    });

    const encryptedSecret = await encryptSecret(publicKeys, secret);

    // check if valid secretType
    const vault = await Vault.findById(team.vaults[0]._id).exec();
    await vault.addSecret(secretType, description, encryptedSecret, filename);
    return res.json({ Info: 'Successfully added new secret!', secret });
    
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error.');
  }
}
