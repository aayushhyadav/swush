import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import AddMemberDialog from 'components/Dialoag/AddMember';
import RemoveMemberDialog from 'components/Dialoag/RemoveMember';
import DeleteTeamDialog from 'components/Dialoag/DeleteTeam';
import GlobalContext from 'store/context';

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    '&.MuiSpeedDial-directionUp': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
  speedDialFab: {
    backgroundColor: '#393939',
  },
}));

export default function SpeedDials() {
  const classes = useStyles();
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    if (!globalState.teams || !globalState.teams[globalState.teamIndex]) return;
    setTeamName(globalState.teams[globalState.teamIndex]._id.name);
  }, [globalState.teamIndex]);

  const actions = [
    {
      icon: <PersonAddIcon />,
      name: 'Add Member',
      type: 'TOGGLE_DIALOG',
      payload: 'ADD_MEMBER',
    },
    {
      icon: <PersonAddDisabledIcon />,
      name: 'Remove Member',
      type: 'TOGGLE_DIALOG',
      payload: 'REMOVE_MEMBER',
    },
    {
      icon: <DeleteIcon />,
      name: 'Delete Selected Team',
      type: 'TOGGLE_DIALOG',
      payload: 'DELETE_TEAM',
    },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleAction = (action) => () => {
    globalDispatch({ type: action.type, payload: action.payload });
  };

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        icon={<SettingsIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
        classes={{ fab: classes.speedDialFab }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleAction(action)}
          />
        ))}
        <SpeedDialAction
          key="Team Settings"
          tooltipTitle="Team Settings"
          icon={
            <Link href={`/dashboard/team/${teamName}`}>
              <EditIcon />
            </Link>
          }
        />
      </SpeedDial>

      <AddMemberDialog />
      <RemoveMemberDialog />
      <DeleteTeamDialog />
    </>
  );
}
