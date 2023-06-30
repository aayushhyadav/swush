const jwt = require('jsonwebtoken');
import User from 'models/users';
import Team from 'models/teams';
import { AuthenticationError } from 'utils/errors';

/**
 * Check if the token provided is valid. If yes, then get the corresponding
 * user from the database.
 */
export default async function getAuthenticatedUser(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).exec();

    if (!user) throw AuthenticationError('Invalid JWT!');
    return user;
  } catch (e) {
    if (e instanceof AuthenticationError) throw new Error(e.message);
    throw new Error('Authentication error!');
  }
}
