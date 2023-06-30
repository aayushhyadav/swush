import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import GlobalContext from 'store/context';
import { useContext } from 'react';
import axios from 'axios';
import StatusSnackbar from 'components/SnackBar/success';
import { ControlCameraOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    flexGrow: 1,
    minHeight: '100%',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: theme.spacing(1.5),
      backgroundColor: theme.palette.primary.main,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  list: {
    padding: theme.spacing(1.75),
    backgroundColor: theme.palette.primary.main,
  },
  listItem: {
    borderRadius: theme.spacing(1.25),
  },
  listItemText: {
    color: theme.palette.text.main,
  },
  // MuiListItemRoot: {
  //   '&$selected': {
  //     backgroundColor: theme.palette.accent.main,
  //     '&:hover': {
  //       backgroundColor: theme.palette.accent.darkContrast,
  //     },
  //   },
  // },
  // MuiListItemSelected: {
  //   backgroundColor: theme.palette.accent.main,
  // },
  MuiListItemButton: {
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  MuiListItemGutters: {
    padding: '1em',
  },
}));

export default function LazyList({ data: listData, type: listType, handler }) {
  const classes = useStyles();
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState();

  useEffect(() => {
    switch (listType) {
      case 'teams':
        globalDispatch({ type: 'SELECT_TEAM', payload: selectedIndex });
        globalDispatch({ type: 'SELECT_SECRET', payload: -1 });
        globalDispatch({ type: 'SELECTED_SECRET', payload: null });
        globalDispatch({ type: 'SELECTED_DES', payload: null });
        break;
      case 'secrets':
        globalDispatch({ type: 'SELECT_SECRET', payload: selectedIndex });
        break;
      case 'members':
        globalDispatch({ type: 'SELECT_MEMBER', payload: selectedIndex });
        break;
      default:
        break;
    }
  }, [selectedIndex]);

  useEffect(() => {
    let initialIndex =
      listType === 'teams' ? globalState.teamIndex : globalState.secretIndex;
    initialIndex = initialIndex ?? 0;
    setSelectedIndex(initialIndex);
  }, []);

  useEffect(() => {
    if (listType === 'secrets') {
      setSelectedIndex(-1);
    }
  }, [globalState.teamIndex]);

  useEffect(() => {
    if (listType === 'secrets' && globalState.memberIndex !== -1) {
      setSelectedIndex(-1);
    }
  }, [globalState.memberIndex]);

  useEffect(() => {
    if (listType === 'members' && globalState.secretIndex !== -1) {
      setSelectedIndex(-1);
    }
  }, [globalState.secretIndex]);

  useEffect(() => {
    if (globalState.teams) {
      if (
        listType === 'teams' &&
        globalState.numTeams !== -1 &&
        globalState.numTeams > globalState.teams.length
      ) {
        setSelectedIndex(-1);
      }
      globalDispatch({ type: 'UPDATE_NUM_TEAMS', payload: globalState.teams });
    }
  }, [globalState.teams]);

  const handleListItemClick = async (index) => {
    setSelectedIndex(index);
    switch (listType) {
      case 'teams':
        sessionStorage.setItem('teamIndex', index);
        break;

      case 'secrets':
        sessionStorage.setItem('secretIndex', index);

        globalDispatch({
          type: 'SELECTED_SECRET',
          payload: globalState.allSecrets[index],
        });
        globalDispatch({
          type: 'SELECTED_DES',
          payload: globalState.allDescriptions[index],
        });
        globalDispatch({
          type: 'SELECTED_SEC_ID',
          payload: globalState.secretDes.secretId[index],
        });
        globalDispatch({
          type: 'SET_FILENAME',
          payload: globalState.secretDes.filename[index],
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className={classes.root}>
      <List component="ul" aria-label={listType} className={classes.list}>
        {[...listData].map((item, index) => (
          <ListItem
            button
            key={index}
            selected={selectedIndex === index}
            onClick={(_ev) => handleListItemClick(index)}
            className={classes.listItem}
            classes={{
              button: classes.MuiListItemButton,
              gutters: classes.MuiListItemGutters,
            }}
          >
            <ListItemText primary={item} className={classes.listItemText} />
            <ListItemSecondaryAction>
              {selectedIndex === index && listType !== 'members' ? (
                <IconButton
                  onClick={() => handler()}
                  // onClick={listType === 'teams' ? handleExitTeam : handleDeleteSecret}
                  edge="end"
                  aria-label="delete"
                >
                  {listType === 'secrets' ? <DeleteIcon fontSize="small" /> : ''}
                </IconButton>
              ) : (
                ''
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <StatusSnackbar message={successMessage} statusType="success" />
      <StatusSnackbar message={errorMessage} statusType="error" />
    </div>
  );
}
