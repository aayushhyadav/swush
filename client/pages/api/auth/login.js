import User from 'models/users';
import withSession from 'utils/withSession';
import { connectToDatabase } from 'utils/connectDb';
import { generateJwt } from 'utils/generateJwt';

const LoginApi = async (req, res) => {
  try {
    await connectToDatabase();

    const { email, password } = req.body;

    const user = await User.findOne(
      { email: email },
      'password tokens name publicKey privateKey'
    ).exec();
    if (!user) {
      return res.status(401).json({ Error: 'User not found!' });
    }
    if (password !== user.password) {
      return res.status(401).json({ Error: 'Incorrect password!' });
    }

    const jwt = generateJwt(email);
    const { name, publicKey, _id } = user;

    req.session.set('user', { jwt: jwt });
    await req.session.save();
    res.status(200).json({
      Info: 'Logged in successfully!',
      jwt,
      name,
      email,
      publicKey,
      userid: _id,
    });
  } catch (error) {
    res.status(500).json({ Error: 'Internal server error.' });
    console.error(error);
  }
};

export default withSession(LoginApi);
