import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import withSession from 'utils/withSession';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import GlobalContext from 'store/context';

import TeamsList from 'components/List/TeamsList';
import SecretsList from 'components/List/SecretsList';
import DataList from 'components/List/DataList';
import AppBar from 'components/Appbar';
import SpeedDial from 'components/SpeedDial';

import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  listContainer: {
    overflow: 'auto',
  },
  container: {
    flex: '1 1 auto',
    backgroundColor: theme.palette.primary.main,
    height: `calc(100vh - ${theme.appbarHeight}rem)`,
  },
}));

export default function Dashboard() {
  const { globalState } = useContext(GlobalContext);
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    if (!globalState.teams) return;
    if (globalState.teamIndex === -1) return;
    const teamName = globalState.teams[globalState.teamIndex]._id.name;
    router.push(`/m/secrets/${teamName}`);
  }, [globalState.teamIndex]);

  return (
    <>
      <AppBar />

      <Divider />

      <Grid container className={classes.container}>
        <Grid item xs className={classes.listContainer}>
          <TeamsList />
        </Grid>
      </Grid>

      {/* <SpeedDial /> */}
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  const user = req.session.get('user');

  if (!user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});
