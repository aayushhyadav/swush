import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styles from 'styles/Modal.module.css'
import axios from 'axios';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function AddMemberModal() {
  const [email, setEmail] = useState('');
  const [name, setTeamName] = useState('');
  const [error, setError] = useState('');

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  
  function validateForm() {
    return name.length > 0 && email.length > 0;
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const jwt = localStorage.getItem('jwt');

      const res = await axios.post(
        '/api/team/addMember',
        { jwt, name, email }
      );
      
      alert(res.data.Info);
      handleClose();
    } catch (error) {
      if (error?.response?.status === 500) {
        setError(error.response.data.Error);
      } else {
        setError('Some error occured!');
      }
    }
  }

  return (
    <div>
      <button onClick={handleOpen}>
        Add Member
      </button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="modal-title">Add Member</h2>
            <form id="modal-description" onSubmit={handleSubmit}>
              <label>Email</label>
              <br></br>
              <input 
                type='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br></br>
              <label>Team Name</label>
              <br></br>
              <input 
                type='text'
                name='teamName'
                value={name}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <br></br>
              <button type='submit' disabled={!validateForm()}>Add</button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}