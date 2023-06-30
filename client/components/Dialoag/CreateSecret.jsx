import React, { useContext, useState, useEffect } from 'react';
import GlobalContext from 'store/context';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import StatusSnackbar from 'components/SnackBar/success';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function DialogSelect() {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const classes = useStyles();
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [secret, setSecret] = useState('');
  const [description, setDescription] = useState('');
  const [secretType, setSecretType] = useState('');
  const [filename, setFileName] = useState('');

  useEffect(() => {
    if (filename !== '' && secretType !== 'file') {
      setSecret('');
      setFileName('');
    }
  }, [secretType]);

  useEffect(() => {
    if (globalState.nameOpenDialog === 'CREATE_SECRET') {
      setStatus({ type: '', msg: '' });
    }
  }, [globalState.nameOpenDialog]);

  const handleDialogOpenState = () => {
    const nameState = globalState.nameOpenDialog ? '' : 'CREATE_SECRET';
    setSecret('');
    setDescription('');
    setSecretType('');
    setFileName('');
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: nameState });
  };

  async function handleCapture(event) {
    const inputFile = document.getElementById('inputFile');
    const file = inputFile.files[0];
    const reader = new FileReader();

    if (file.type.startsWith('text/')) {
      reader.onload = (e) => {
        const textContent = e.target.result;
        setSecret(textContent);
        setFileName(file.name);
        setSecretType('file');
      };
      reader.onerror = (e) => {
        const error = e.target.error;
        console.error(`Error occured while reading ${file.name}`, error);
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        const imageContent = e.target.result;
        const imageData = imageContent.slice(imageContent.indexOf(',') + 1);
        setSecret(imageData);
        setFileName(file.name);
        setSecretType('file');
      };
      reader.onerror = (e) => {
        const error = e.target.error;
        console.error(`Error occured while reading ${file.name}`, error);
      };
      reader.readAsDataURL(file);
    } else {
      setStatus({ type: 'error', msg: 'Only text and image files are supported!' });
    }
  }

  const handleCreateSecret = async (e) => {
    try {
      e.preventDefault();
      const jwt = globalState.jwt;
      const teamName = globalState.teams[globalState.teamIndex]._id.name;
      const res = await axios.post('/api/encryption/encrypt', {
        jwt,
        teamName,
        description,
        secret,
        secretType,
        filename,
      });
      setStatus({ type: 'success', msg: res.data.Info });
      globalDispatch({
        type: 'GOT_SECRET',
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
        open={globalState.nameOpenDialog === 'CREATE_SECRET'}
        onClose={handleDialogOpenState}
        fullWidth
      >
        <DialogTitle style={{ paddingBottom: 0 }}>Create new secret</DialogTitle>
        <DialogContent>
          <form className={classes.container} autoComplete="off">
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                margin="normal"
                label="Description"
                type="text"
                fullWidth
              />
            </FormControl>

            <FormControl className={classes.formControl} fullWidth>
              <TextField
                value={secretType === 'file' ? filename : secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                }}
                margin="normal"
                label="Secret"
                type="text"
                multiline
                rows={5}
                fullWidth
              />
            </FormControl>

            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id="secret-type">Secret Type</InputLabel>
              <Select
                labelId="secret-type"
                value={secretType}
                onChange={(e) => {
                  setSecretType(e.target.value);
                }}
                input={<Input />}
                fullWidth
              >
                <MenuItem value="ssh">SSH</MenuItem>
                <MenuItem value="oauth">OAuth</MenuItem>
                <MenuItem value="password">Password</MenuItem>
                <MenuItem disabled={true} value="file">
                  File
                </MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>

        <DialogActions>
          <Button color="primary" component="label">
            Upload
            <input
              type="file"
              id="inputFile"
              name="file"
              onChange={handleCapture}
              hidden
            />
          </Button>
          <Button onClick={handleDialogOpenState} color="primary">
            Cancel
          </Button>
          <Button
            disabled={secret === '' || secretType === ''}
            onClick={handleCreateSecret}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <StatusSnackbar message={status.msg} statusType={status.type} />
    </>
  );
}
