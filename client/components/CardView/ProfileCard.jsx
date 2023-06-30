import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GlobalContext from 'store/context';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import UpdateSecretDialog from 'components/Dialoag/UpdateSecret';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: `100%`,
    minWidth: 275,
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(5),
    [theme.breakpoints.down(500)]: {
      padding: theme.spacing(1),
    },
  },
  root: {
    height: '100%',
    maxWidth: '90vw',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 0,
  },
  description: {
    color: theme.palette.text.accent,
  },
  secretDescription: {
    marginBottom: theme.spacing(2),
  },
  data: {
    color: theme.palette.text.main,
    fontWeight: 'normal',
    fontSize: '15px',
  },
  buttonContainer: {
    bottom: theme.spacing(5),
    [theme.breakpoints.down(500)]: {
      bottom: theme.spacing(1),
    },
  },
  updateButton: {
    fontSize: '1.15rem',
    color: theme.palette.text.main,
    borderColor: theme.palette.text.accent,
    marginTop: '5px',
  },
}));

const ProfileCard = ({ name, publicKey, email, showActions }) => {
  const classes = useStyles();
  const { globalDispatch } = useContext(GlobalContext);

  function handleUpdateSecret() {
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: 'UPDATE_PROFILE' });
  }

  return (
    <div className={classes.wrapper}>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography
            variant="h6"
            component="h6"
            className={classes.title}
            gutterBottom
            classes={{ root: classes.description }}
          >
            Name
          </Typography>
          <Typography
            variant="h6"
            component="h6"
            className={classes.data}
            gutterBottom
            classes={{ root: classes.secretDescription }}
          >
            {name}
          </Typography>

          <Typography
            variant="h6"
            component="h6"
            className={classes.title}
            gutterBottom
            classes={{ root: classes.description }}
          >
            Email
          </Typography>
          <Typography variant="h6" component="h6" className={classes.data} gutterBottom>
            {email}
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            className={classes.title}
            gutterBottom
            classes={{ root: classes.description }}
          >
            Public Key
          </Typography>
          <Typography
            variant="inherit"
            component="pre"
            className={classes.data}
            style={{ overflowX: 'auto' }}
            gutterBottom
          >
            {publicKey}
          </Typography>
        </CardContent>

        {showActions ? (
          <CardActions className={classes.buttonContainer}>
            <Button
              className={classes.updateButton}
              onClick={handleUpdateSecret}
              variant="outlined"
              size="large"
            >
              Update
            </Button>
          </CardActions>
        ) : (
          ''
        )}
      </Card>
      <UpdateSecretDialog />
    </div>
  );
};

export default ProfileCard;
