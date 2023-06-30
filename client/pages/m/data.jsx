import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import withSession from 'utils/withSession';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import GlobalContext from 'store/context';

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
    backgroundColor: theme.palette.secondary.main,
    height: `calc(100vh - ${theme.appbarHeight}rem)`,
  },
}));

export default function Dashboard() {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const classes = useStyles();
  const [description, setDescription] = useState(null);
  const [secret, setSecret] = useState(null);

  useEffect(() => {
    globalDispatch({ type: 'SELECT_SECRET', payload: -1 });
  }, []);

  useEffect(() => {
    setSecret(globalState?.selectedSecret);
  }, [globalState.selectedSecret]);

  useEffect(() => {
    setDescription(globalState?.selectedDes);
  }, [globalState.selectedDes]);

  return (
    <>
      <AppBar />

      <Divider />

      <Grid container className={classes.container}>
        <Grid item xs className={classes.listContainer}>
          <DataList description={description} secret={secret} />
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
