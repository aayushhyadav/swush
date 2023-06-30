import { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LazyList from './Lazy';
import Context from 'store/context';
import { Typography, Paper, IconButton, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateTeamDialog from 'components/Dialoag/CreateTeam';
import useFetch from 'hooks/useFetch';
import SkeletonList from 'components/List/SkeletonList';

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

const TeamsList = () => {
  const { globalState, globalDispatch } = useContext(Context);
  const classes = useStyles();
  const [teamNames, setTeamNames] = useState([]);

  const { loading, data, error } = useFetch('/api/team/view', {
    jwt: sessionStorage.getItem('jwt'),
  });

  useEffect(() => {
    globalDispatch({ type: 'GOT_TEAM', payload: data });
  }, [data]);

  useEffect(() => {
    if (!globalState.teams) return;
    const teamNamesArr = [];
    globalState.teams.forEach((team) => {
      teamNamesArr.push(team._id.name);
    });
    setTeamNames(teamNamesArr);
  }, [loading, globalState.teams]);

  function handleTeamAdd() {
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: 'CREATE_TEAM' });
  }

  async function handleRemoveMember() {
    try {
      const jwt = sessionStorage.getItem('jwt');
      const teamName = globalState.teams[selectedIndex]._id.name;
      const res = await axios.post('/api/team/exitTeam', { jwt, name: teamName });
      setSuccessMessage(`You left the team ${teamName}!`);
    } catch (error) {
      if (error?.response?.status === 500) {
        setErrorMessage(error.response.data.Error);
      } else {
        setErrorMessage('Some error occurred!');
      }
    }
  }

  return (
    <>
      <Paper className={classes.listHeading}>
        <Typography variant="h6" component="span" className={classes.listHeadingText}>
          Teams
        </Typography>
        <IconButton onClick={handleTeamAdd} className={classes.addIcon}>
          <AddIcon />
        </IconButton>
      </Paper>
      <Divider />

      {error ? 'Some error occurred' : ''}
      {loading ? (
        <SkeletonList />
      ) : (
        <LazyList data={teamNames} type="teams" handler={handleRemoveMember} />
      )}

      <CreateTeamDialog />
    </>
  );
};

export default TeamsList;
