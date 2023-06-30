import { useEffect, useContext, useState } from 'react';
import useSwr from 'swr';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import LazyList from './Lazy';
import Context from 'store/context';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import AddMemberDialog from 'components/Dialoag/AddMember';
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

const fetcher = (url) => fetch(url).then((r) => r.json());

const MembersList = ({ teamName }) => {
  const { globalState, globalDispatch } = useContext(Context);
  const classes = useStyles();
  const [members, setMembers] = useState([]);

  const { data, error } = useSwr(() => '/api/team/' + teamName + '/members', fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    globalDispatch({ type: 'GOT_MEMBER', payload: data?.members });
  }, [data]);

  useEffect(() => {
    if (!globalState.members) return;

    const updatedMembersArr = [];
    globalState.members.forEach((member) => {
      updatedMembersArr.push(member._id.name);
    });

    setMembers(updatedMembersArr);
  }, [data, globalState.members]);

  function handleAddMember() {
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: 'ADD_MEMBER' });
  }

  async function handleRemoveMember() {
    try {
      const jwt = localStorage.getItem('jwt');
      const email = globalState.members[globalState.memberIndex]?._id.email;

      const res = await axios.post('/api/team/removeMember', {
        jwt,
        name: teamName,
        email,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Paper className={classes.listHeading}>
        <Typography variant="h6" component="span" className={classes.listHeadingText}>
          Members
        </Typography>
        <IconButton onClick={handleAddMember} className={classes.addIcon}>
          <AddIcon />
        </IconButton>
      </Paper>

      <Divider />

      {error ? 'Some error occurred!' : ''}
      {!data && !error ? (
        <SkeletonList />
      ) : (
        <LazyList data={members} type="members" handler={handleRemoveMember} />
      )}

      <AddMemberDialog />
    </>
  );
};

export default MembersList;
