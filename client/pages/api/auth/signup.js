import { connectToDatabase } from 'utils/connectDb';
import User from 'models/users';
import generateKeys from 'utils/generateKeys';
import { generateJwt, decodeJwt } from 'utils/generateJwt';
import { sendWelcomeEmail } from 'utils/sendEmail';

export default async (req, res) => {
  try {
    await connectToDatabase();

    let { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(200).json({ Error: 'Enter all fields!' });
    }

    // sanitize input
    name = name.toString();
    email = email.toString();
    password = password.toString();

    const jwt = generateJwt(email);
    const { privateKey, publicKey } = await generateKeys(email);

    const userInfo = {
      name,
      email,
      password,
      publicKey,
      privateKey,
    };

    const user = new User(userInfo);
    await user.save();

    /* store the private key in encrypted form */
    await user.storeKeys(privateKey);

    /* send welcome email to the user */
    // sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      Info: 'User successfully created!',
      publicKey,
      privateKey,
      jwt,
      name,
    });
  } catch (e) {
    if (e.name === 'MongoError' && e.code === 11000) {
      return res.status(400).json({ Error: 'User already exists!' });
    }
    console.error(e);
    res.status(500).json({ Error: 'Internal server error.' });
  }
};
