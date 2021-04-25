import { useContext } from 'react';
import { useRouter } from 'next/router';
import withSession from 'utils/withSession';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import GlobalContext from 'store/context';

import MembersList from 'components/List/MembersList';
import SecretsList from 'components/List/SecretsList';
import DataList from 'components/List/DataList';
import AppBar from 'components/Appbar';
import SpeedDial from 'components/SpeedDial';

import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    flex: '1 1 auto',
    backgroundColor: theme.palette.primary.main,
    minHeight: '100%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  listContainer: {
    // maxHeight: '100vh',
    overflow: 'auto',
  },
  container: {
    height: 'calc(100vh - 4.05rem)',
  },
}));

export default function Dashboard() {
  const { globalState } = useContext(GlobalContext);
  const router = useRouter();
  const classes = useStyles();

  return (
    <>
      <AppBar />

      <Divider />

      <main className={classes.root}>
        <Grid container className={classes.container}>
          <Grid item xs className={classes.listContainer}>
            <MembersList />
          </Grid>

          <Divider orientation="vertical" flexItem className={classes.divider} />

          <Grid item xs className={classes.listContainer}>
            <SecretsList />
          </Grid>

          <Divider orientation="vertical" flexItem className={classes.divider} />

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