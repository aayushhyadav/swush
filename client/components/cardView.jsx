import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useEffect, useContext, useState } from 'react';
import Context from 'store/context';
import GlobalContext from 'store/context';
import UpdateSecretDialog from 'components/Dialoag/UpdateSecret';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    overflowY: 'auto',
    backgroundColor: theme.palette.secondary.main,
    height: `calc(100vh - ${theme.appbarHeight}rem)`,
    padding: theme.spacing(5),
    borderRadius: 0,
    [theme.breakpoints.down(500)]: {
      padding: theme.spacing(1),
    },
  },
  description: {
    color: theme.palette.text.accent,
  },
  secretDescription: {
    marginBottom: theme.spacing(7),
  },
  data: {
    color: theme.palette.text.main,
    fontWeight: 'normal',
  },
  buttonContainer: {
    paddingTop: theme.spacing(12),
    bottom: 0,
    [theme.breakpoints.down(500)]: {
      bottom: theme.spacing(1),
    },
  },
  updateButton: {
    fontSize: '1.15rem',
    color: theme.palette.text.main,
    borderColor: theme.palette.text.accent,
  },
  downloadIcon: {
    color: theme.palette.text.main,
  },
  download: {
    bottom: theme.spacing(0),
    fontSize: '1.15rem',
    color: '#e6e6e6',
    borderColor: '#565656',
  },
}));

export default function CardView({ description, secret }) {
  const classes = useStyles();
  const { globalState, globalDispatch } = useContext(GlobalContext);

  function handleUpdateSecret() {
    globalDispatch({ type: 'TOGGLE_DIALOG', payload: 'UPDATE_SECRET' });
  }

  function handleDownload() {
    const a = document.createElement('a');
    var contentType;
    const filename = globalState.selectedFileName;
    if (globalState.selectedFileName.match(/\.png$/)) {
      contentType = 'image/png';
    } else if (globalState.selectedFileName.match(/\.jpg$/)) {
      contentType = 'image/jpg';
    } else if (globalState.selectedFileName.match(/\.jpeg$/)) {
      contentType = 'image/jpeg';
    } else if (globalState.selectedFileName.match(/\.txt$/)) {
      contentType = 'text/plain';
    }
    var file;

    if (contentType.startsWith('image/')) {
      const imageData = atob(globalState.selectedSecret);
      const byteNumbers = new Array(imageData.length);
      for (let i = 0; i < imageData.length; i++) {
        byteNumbers[i] = imageData.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      file = new Blob([byteArray], { type: contentType });
    } else if (contentType.startsWith('text/')) {
      file = new Blob([globalState.selectedSecret], { type: contentType });
    }

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          component="h3"
          className={classes.title}
          gutterBottom
          classes={{ root: classes.description }}
        >
          Description
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          className={classes.data}
          gutterBottom
          classes={{ root: classes.secretDescription }}
        >
          {description ?? globalState.selectedDes}
        </Typography>

        <Typography
          variant="h6"
          component="h5"
          className={classes.title}
          gutterBottom
          classes={{ root: classes.description }}
        >
          Secret Data
        </Typography>
        <Typography variant="h4" component="h5" className={classes.data} gutterBottom>
          {secret ??
            (globalState.selectedFileName === 'ssh' ||
            globalState.selectedFileName === 'oauth' ||
            globalState.selectedFileName === 'pass'
              ? globalState.selectedSecret
              : globalState.selectedFileName)}
        </Typography>
      </CardContent>

      <CardActions className={classes.buttonContainer}>
        <Button
          className={classes.updateButton}
          onClick={handleUpdateSecret}
          variant="outlined"
          size="large"
        >
          Update
        </Button>
        <IconButton
          disabled={
            globalState.selectedFileName === 'ssh' ||
            globalState.selectedFileName === 'oauth' ||
            globalState.selectedFileName === 'pass'
          }
          onClick={handleDownload}
        >
          <CloudDownloadIcon className={classes.downloadIcon} fontSize="large" />
        </IconButton>
      </CardActions>
      <UpdateSecretDialog />
    </Card>
  );
}
