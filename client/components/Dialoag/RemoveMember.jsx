import React, { useContext, useState, useEffect } from 'react';
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
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (globalState.nameOpenDialog === 'REMOVE_MEMBER') {
      setStatus({ type: '', msg: '' });
    }
  }, [globalState.nameOpenDialog]);

  const handleDialogOpenState = () => {
    const nameState = globalState.nameOpenDialog ? '' : 'REMOVE_MEMBER';
    setEmail('');
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: nameState });
  };

  async function handleRemoveMember(e) {
    try {
      e.preventDefault();
      const jwt = sessionStorage.getItem('jwt');
      const teamName = globalState.teams[globalState.teamIndex]._id.name;
      const res = await axios.post('/api/team/removeMember', {
        jwt,
        name: teamName,
        email,
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
        open={globalState.nameOpenDialog === 'REMOVE_MEMBER'}
        onClose={handleDialogOpenState}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Remove member</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogOpenState} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveMember} color="primary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <StatusSnackbar message={status.msg} statusType={status.type} />
    </>
  );
}
