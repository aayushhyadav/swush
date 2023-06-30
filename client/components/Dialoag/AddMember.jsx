import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';

import GlobalContext from 'store/context';
import { Typography } from '@material-ui/core';
import StatusSnackbar from 'components/SnackBar/success';
import axios from 'axios';

export default function FormDialog() {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (globalState.nameOpenDialog === 'ADD_MEMBER') {
      setStatus({ type: '', msg: '' });
    }
  }, [globalState.nameOpenDialog]);

  const handleDialogOpenState = () => {
    const nameState = globalState.nameOpenDialog ? '' : 'ADD_MEMBER';
    setEmail('');
    setIsAdmin(false);
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: nameState });
  };

  async function handleAddMember(e) {
    try {
      e.preventDefault();
      const jwt = sessionStorage.getItem('jwt');
      const teamName = globalState.teams[globalState.teamIndex]._id.name;
      const res = await axios.post('/api/team/addMember', {
        jwt,
        name: teamName,
        email,
        makeAdmin: isAdmin,
      });
      setStatus({ type: 'success', msg: res.data.Info });
    } catch (error) {
      if (error?.response?.status === 500) {
        setStatus({ type: 'error', msg: error.response.data.Error });
      } else {
        setStatus({ type: 'error', msg: 'Some error occured!' });
      }
    } finally {
      handleDialogOpenState();
    }
  }

  return (
    <>
      <Dialog
        open={globalState.nameOpenDialog === 'ADD_MEMBER'}
        onClose={handleDialogOpenState}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Add new member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter member's email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            fullWidth
          />

          <Checkbox
            checked={isAdmin}
            onChange={() => {
              setIsAdmin(!isAdmin);
            }}
            inputProps={{ 'aria-label': 'Make member an admin' }}
          />
          <Typography variant="body1" component="span">
            Make admin?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogOpenState} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddMember} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <StatusSnackbar message={status.msg} statusType={status.type} />
    </>
  );
}
