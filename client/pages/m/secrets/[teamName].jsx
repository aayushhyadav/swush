import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import withSession from 'utils/withSession';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import GlobalContext from 'store/context';
import SecretsList from 'components/List/SecretsList';
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

export default function Dashboard({ teamName }) {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    globalDispatch({ type: 'SELECT_TEAM', payload: -1 });
  }, []);

  useEffect(() => {
    if (globalState.secretIndex === -1) return;
    router.push('/m/data');
  }, [globalState.secretIndex]);

  return (
    <>
      <AppBar name={teamName} />

      <Divider />

      <Grid container className={classes.container}>
        <Grid item xs className={classes.listContainer}>
          <SecretsList teamName={teamName} />
        </Grid>
      </Grid>

      {/* <SpeedDial /> */}
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, query }) {
  const user = req.session.get('user');
  const { teamName } = query;

  if (!user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      teamName,
    },
  };
});
