import { useContext, useEffect, useState } from 'react';
import withSession from 'utils/withSession';
import { connectToDatabase } from 'utils/connectDb';
import getAuthenticatedUser from 'utils/auth';
import GlobalContext from 'store/context';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import TeamsList from 'components/List/TeamsList';
import SecretsList from 'components/List/SecretsList';
import DataList from 'components/List/DataList';
import AppBar from 'components/Appbar';
import SpeedDial from 'components/SpeedDial';

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

export default function Dashboard({ username }) {
  const { globalState } = useContext(GlobalContext);
  const classes = useStyles();
  const [teamName, setTeamName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!globalState.teams || !globalState.teams[globalState.teamIndex]) return;
    setTeamName(globalState.teams[globalState.teamIndex]._id.name);
    if (
      globalState.teams[globalState.teamIndex]._id.admins[0]._id ===
      sessionStorage.getItem('userid')
    )
      setIsAdmin(true);
  }, [globalState.teamIndex]);

  return (
    <>
      <AppBar name={username} />

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

      {isAdmin ? <SpeedDial /> : ''}
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
      username: user.name,
    },
  };
});
