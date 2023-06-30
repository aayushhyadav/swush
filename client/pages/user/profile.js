import { useContext } from 'react';
import { connectToDatabase } from 'utils/connectDb';
import { makeStyles } from '@material-ui/core/styles';
import withSession from 'utils/withSession';
import getAuthenticatedUser from 'utils/auth';
import GlobalContext from 'store/context';

import Divider from '@material-ui/core/Divider';
import AppBar from 'components/Appbar';
import UpdateProfileDialog from 'components/Dialoag/UpdateProfile';
import ProfileCard from 'components/CardView/ProfileCard';

export default function UserProfile({ publicKey, email }) {
  const { globalState } = useContext(GlobalContext);

  return (
    <>
      <AppBar />
      <Divider />
      <ProfileCard
        name={globalState.username}
        publicKey={publicKey}
        email={email}
        showActions
      />
      <UpdateProfileDialog />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  const sessionUser = req.session.get('user');

  if (!sessionUser) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  await connectToDatabase();
  const user = await getAuthenticatedUser(req.__NEXT_INIT_QUERY.jwtToken);

  return {
    props: {
      publicKey: user.publicKey,
      email: user.email,
    },
  };
});
