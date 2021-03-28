const jwt = require('jsonwebtoken');
import UserAuth from 'models/UserAuth';

/* auth method finds the user using the jwt token */
export default async function auth(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserAuth.findOne({ _id: decoded._id, 'tokens.token': token });
    return user;
  } catch (error) {
    res.status(401).send({ Error: 'Please authenticate' });
  }
}