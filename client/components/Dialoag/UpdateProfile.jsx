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
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (globalState.nameOpenDialog === 'UPDATE_PROFILE') {
      setStatus({ type: '', msg: '' });
    }
  }, [globalState.nameOpenDialog]);

  const handleDialogOpenState = () => {
    const nameState = globalState.nameOpenDialog ? '' : 'UPDATE_PROFILE';
    setName('');
    setPassword('');
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: nameState });
  };

  async function handleUpdateProfile(e) {
    try {
      e.preventDefault();

      const res = await axios.post('/api/user/update', {
        name,
        password,
      });
      sessionStorage.setItem('username', name);
      globalDispatch({ type: 'SET_NAME', payload: name });
      setStatus({ type: 'success', msg: 'Updated Successfully' });
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
        open={globalState.nameOpenDialog === 'UPDATE_PROFILE'}
        onClose={handleDialogOpenState}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Update Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Update Name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            label="Update Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogOpenState} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateProfile} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <StatusSnackbar message={status.msg} statusType={status.type} />
    </>
  );
}
