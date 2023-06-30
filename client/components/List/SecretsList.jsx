import LazyList from './Lazy';
import { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GlobalContext from 'store/context';
import SkeletonList from 'components/List/SkeletonList';
import { Typography, Paper, IconButton, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateSecretDialog from 'components/Dialoag/CreateSecret';
import useSwr from 'swr';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  listHeading: {
    display: 'flex',
    borderRadius: 0,
    padding: theme.spacing(1, 1.75, 1, 3.25),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
  },
  listHeadingText: {
    textTransform: 'uppercase',
    color: theme.palette.text.main,
  },
  addIcon: {
    color: theme.palette.text.accent,
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

const SecretsList = ({ teamName }) => {
  const classes = useStyles();
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [descriptions, setDescriptions] = useState([]);

  const { data, error } = useSwr(() => '/api/vault/' + teamName, fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    globalDispatch({ type: 'GOT_SECRET_DES', payload: data });
  }, [data]);

  useEffect(() => {
    if (!globalState.secretDes) return;
    const sshDes = globalState.secretDes.sshDescription ?? [];
    const oauthDes = globalState.secretDes.oauthDescription ?? [];
    const passDes = globalState.secretDes.passwordDescription ?? [];
    const fileDes = globalState.secretDes.filesDescription ?? [];

    const ssh = globalState.secretDes.SSH ?? [];
    const oauth = globalState.secretDes.OAuth ?? [];
    const pass = globalState.secretDes.Password ?? [];
    const files = globalState.secretDes.Files ?? [];

    const allSec = [...ssh, ...oauth, ...pass, ...files];
    const allDes = [...sshDes, ...oauthDes, ...passDes, ...fileDes];

    globalDispatch({ type: 'ALL_DESCRIPTIONS', payload: allDes });
    globalDispatch({ type: 'ALL_SECRETS', payload: allSec });

    setDescriptions(allDes);
  }, [data, globalState.secretDes]);

  function handleSecretAdd() {
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: 'CREATE_SECRET' });
  }

  const handleSecretDelete = async () => {
    try {
      const jwt = sessionStorage.getItem('jwt');
      const teamName = globalState.teams[globalState.teamIndex]._id.name;
      const secretId = globalState.selectedSecretId;

      const res = await fetch('/api/team/deleteSecret', {
        method: 'POST',
        body: JSON.stringify({
          jwt,
          teamName,
          secretId,
        }),
        header: { 'Content-type': 'application/json' },
      });

      globalDispatch({ type: 'SELECT_SECRET', payload: -1 });
      setSuccessMessage(`Secret deleted`);
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 500) {
        // setErrorMessage(error.response.data.Error);
      } else {
        // setErrorMessage('Some error occurred!');
      }
    }
  };

  return (
    <>
      <Paper className={classes.listHeading}>
        <Typography variant="h6" component="span" className={classes.listHeadingText}>
          Secrets
        </Typography>
        <IconButton onClick={handleSecretAdd} className={classes.addIcon}>
          <AddIcon />
        </IconButton>
      </Paper>

      <Divider />

      {!data && !error ? (
        <SkeletonList />
      ) : (
        <LazyList data={descriptions} type="secrets" handler={handleSecretDelete} />
      )}

      <CreateSecretDialog />
    </>
  );
};

export default SecretsList;
