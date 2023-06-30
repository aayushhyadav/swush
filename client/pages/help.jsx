import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import AppBar from 'components/Appbar';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '750px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    alignItems: 'center',
  },
  heading: {
    color: theme.palette.text.main,
    margin: `${theme.spacing(5)}px 0`,
    textAlign: 'center',
    [theme.breakpoints.down(500)]: {
      fontSize: '2rem',
    },
  },
}));

const Accordion = withStyles((theme) => ({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.main,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
}))(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 60,
    '&$expanded': {
      minHeight: 60,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.main,
  },
}))(MuiAccordionDetails);

export default function Help() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <AppBar />

      <Divider />

      <div className={classes.wrapper}>
        <Typography variant="h2" className={classes.heading}>
          Frequently Asked Questions
        </Typography>
        <div className={classes.root}>
          <Accordion
            square
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography>What is Swush all about?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Teams need to manage various secret keys. For example, passwords, SSH
                keys, OAuth tokens, etc. These can be difficult to manage across a team.
                Some enterprise solutions like 1Password, LastPass, etc. exist. But they
                work on the system on a master password. Also, all the data is
                compulsorily to be stored on their servers. Instead we could use the
                concept of GPG keyrings and PBKDF2, so that every team member has a key
                which they can use to unlock the vault. If a team member leaves the
                organization, just remove their key access. No need to memorize a new
                master password
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
              <Typography>How are the secrets stored safely?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Every team has a public keyring which contains the public keys of all the
                team members. When a member adds a secret to the team vault it is
                encrypted using the public keyring. All the public keys will be combined
                to form a hash which will be used to encrypt the secret. So when some
                other team member tries to view the secret it will be decrypted using the
                member's private key. Decryption will only work if member's public key
                belongs to the keyring.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
              <Typography>Who can view the secrets?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Only team members can view the secrets.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel4'}
            onChange={handleChange('panel4')}
          >
            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
              <Typography>Who can add the secrets?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Any team member can add the secrets.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel5'}
            onChange={handleChange('panel5')}
          >
            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
              <Typography>Who can add the members?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Only team admin can add new members.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel6'}
            onChange={handleChange('panel6')}
          >
            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
              <Typography>Who can remove the members?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Only team admin can remove the members.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel7'}
            onChange={handleChange('panel7')}
          >
            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
              <Typography>What happens if the team is deleted?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                If the team is deleted all the secrets associated with the team vault will
                be lost permanently.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === 'panel8'}
            onChange={handleChange('panel8')}
          >
            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
              <Typography>Who can delete the team?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Only team admin can delete the team.</Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </>
  );
}
