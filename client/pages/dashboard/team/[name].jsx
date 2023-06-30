import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import withSession from 'utils/withSession';
import GlobalContext from 'store/context';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import MembersList from 'components/List/MembersList';
import SecretsList from 'components/List/SecretsList';
import DataList from 'components/List/DataList';
import AppBar from 'components/Appbar';
import ProfileCard from 'components/CardView/ProfileCard';

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
    height: 'calc(100vh - 4.05rem)',
  },
}));

export default function Dashboard({ teamName }) {
  const { globalState } = useContext(GlobalContext);
  const router = useRouter();
  const classes = useStyles();
  const [isMemberView, setIsMemberView] = useState(false);

  useEffect(() => {
    if (globalState.memberIndex !== -1) {
      setIsMemberView(true);
    }
  }, [globalState.memberIndex]);

  useEffect(() => {
    if (globalState.secretIndex !== -1) {
      setIsMemberView(false);
    }
  }, [globalState.secretIndex]);

  return (
    <>
      <AppBar name={teamName} />

      <Divider />

      <main className={classes.root}>
        <Grid container className={classes.container}>
          <Grid item xs className={classes.listContainer}>
            <MembersList teamName={teamName} />
          </Grid>

          <Divider orientation="vertical" flexItem className={classes.divider} />

          <Grid item xs className={classes.listContainer}>
            <SecretsList teamName={teamName} />
          </Grid>

          <Divider orientation="vertical" flexItem className={classes.divider} />

          <Grid item xs={6}>
            {isMemberView ? (
              <ProfileCard
                name={globalState.members[globalState.memberIndex]?._id.name}
                publicKey={globalState.members[globalState.memberIndex]?._id.publicKey}
                email={globalState.members[globalState.memberIndex]?._id.email}
                numTeams={globalState.teams?.length}
              />
            ) : (
              <DataList />
            )}
          </Grid>
        </Grid>
      </main>
    </>
  );
}

export const getServerSideProps = withSession(async function ({ query, req }) {
  const user = req.session.get('user');

  if (!user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const { name } = query;

  return {
    props: {
      teamName: name,
    },
  };
});
