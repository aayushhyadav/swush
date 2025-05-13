const crypto = require('crypto');

import { connectToDatabase } from 'utils/connectDb';
import Team from 'models/teams';
import Vault from 'models/vaults';
import getAuthenticatedUser from 'utils/auth';
import encryptSecret from 'utils/encrypt';

export default async (req, res) => {
  try {
    await connectToDatabase();
    const { name: teamName, jwt } = req.body;
    const user = await getAuthenticatedUser(jwt);

    const vault = new Vault({ name: 'default' });
    await vault.save();

    const aesKey = crypto.randomBytes(32).toString('hex');
    const encryptedAesKey = await encryptSecret([user.publicKey], aesKey);

    const team = new Team({
      name: teamName,
      aesKey: encryptedAesKey,
      admins: [{ _id: user._id }],
      members: [{ _id: user._id }],
      vaults: [{ _id: vault._id }],
    });

    await team.save();
    const getTeam = await Team.findOne({ name: teamName }).exec();
    await user.addTeam(getTeam._id);
    res.status(201).json({ msg: `Created team: ${teamName}!`, team: { _id: team } });

  } catch (e) {
    if (e.name === 'MongoError' && e.code === 11000) {
      return res.status(500).json({ Error: 'Team name taken!' });
    }
    console.error(e);
    res.status(500).json({ Error: 'Internal server error!' });
  }
};
