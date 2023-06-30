import { useContext, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import GlobalContext from 'store/context';
import StatusSnackbar from 'components/SnackBar/success';
import axios from 'axios';

export default function FormDialog() {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    if (globalState.nameOpenDialog === 'CREATE_TEAM') {
      setStatus({ type: '', msg: '' });
    }
  }, [globalState.nameOpenDialog]);

  const handleDialogOpenState = () => {
    const nameState = globalState.nameOpenDialog ? '' : 'CREATE_TEAM';
    setTeamName('');
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: nameState });
  };

  const handleCreateTeam = async (e) => {
    try {
      e.preventDefault();
      const jwt = sessionStorage.getItem('jwt');
      const res = await axios.post('/api/team/create', { name: teamName, jwt });

      setStatus({ type: 'success', msg: res.data.msg });
      globalDispatch({
        type: 'GOT_TEAM',
        payload: [...globalState.teams, res.data.team],
      });

      handleDialogOpenState();
    } catch (error) {
      if (error?.response?.status === 500) {
        setStatus({ type: 'error', msg: error.response.data.Error });
      } else {
        setStatus({ type: 'error', msg: 'Some error occured!' });
        console.error(error);
      }
    }
  };

  return (
    <>
      <Dialog
        open={globalState.nameOpenDialog === 'CREATE_TEAM'}
        onClose={handleDialogOpenState}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Create new team!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={teamName}
            onChange={(e) => {
              setTeamName(e.target.value);
            }}
            margin="dense"
            label="Team Name"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogOpenState} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateTeam} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* {status ? <StatusSnackbar message={successMessage} statusType="success" /> : ''} */}
      <StatusSnackbar message={status.msg} statusType={status.type} />
    </>
  );
}
