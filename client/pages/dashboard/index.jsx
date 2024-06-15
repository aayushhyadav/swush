import { useContext, useEffect, useState } from 'react';
import withSession from 'utils/withSession';
import { connectToDatabase } from 'utils/connectDb';
import getAuthenticatedUser from 'utils/auth';
import GlobalContext from 'store/context';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';

import TeamsList from 'components/List/TeamsList';
import SecretsList from 'components/List/SecretsList';
import DataList from 'components/List/DataList';
import AppBar from 'components/Appbar';
import SpeedDial from 'components/SpeedDial';
import populateSessionStorage from 'utils/populateSessionStorage';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: '1 1 auto',
    backgroundColor: theme.palette.primary.main,
    minHeight: '100%',
  },
  listContainer: {
    overflow: 'auto',
  },
  container: {
    height: '100%',
  },
}));

export default function Dashboard(userData) {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const classes = useStyles();
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    async function fetchData(data) {
      populateSessionStorage(data);
      const {jwt} = data;
      const notifications = await axios.post('/api/team/viewNotifications', {jwt});

      globalDispatch({ type: 'LOGIN', payload: notifications.data.Notifications });
      globalDispatch({ type: 'SET_NAME', payload: data.username });
    }
    if (sessionStorage.length == 0) {
      fetchData(userData)
    }
  }, []);

  useEffect(() => {
    if (!globalState.teams || !globalState.teams[globalState.teamIndex]) return;
    setTeamName(globalState.teams[globalState.teamIndex]._id.name);
  }, [globalState.teamIndex]);

  return (
    <>
      <AppBar name={userData.username} />

      <Divider />

      <main className={classes.root}>
        <Grid container className={classes.container}>
          <Grid item xs className={classes.listContainer}>
            <TeamsList />
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid item xs className={classes.listContainer}>
            <SecretsList teamName={teamName} />
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid item xs={6}>
            <DataList />
          </Grid>
        </Grid>
      </main>

      <SpeedDial />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  try {
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
    const user = await getAuthenticatedUser(sessionUser.jwt);

    return {
      props: {
        username: user.name,
        jwt: sessionUser.jwt,
        publicKey: user.publicKey,
        email: user.email,
        userid: JSON.stringify(user._id)
      },
    };
  } catch (error) {
    console.log(error);
  }
});
