import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon from '@material-ui/icons/List';
import Play from './play';
import CameraEdit from './cameraEdit';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    left: 0,
    zIndex: 999,
    border: '0px solid',
    padding: 1,
    backgroundColor: '#f8f8f8',
  },
}));

export default function ActionList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  let playRef = React.createRef();
  function play() {
    setOpen(false);
    playRef.current.handleClickOpen();
  }

  let editRef = React.createRef();
  function edit() {
    setOpen(false);
    editRef.current.handleClickOpen();
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={classes.root}>
        <button type="button" onClick={handleClick}>
          <ListIcon />
        </button>
        {open ? (
          <div className={classes.dropdown}>
            <List component="nav" aria-label="secondary mailbox folders">
              <ListItem button>
                <ListItemText primary="edit" onClick={edit}/>
              </ListItem>
              <ListItem button onClick={play}>
                <ListItemText primary="play" />
              </ListItem>
            </List>
          </div>
        ) : null}
        <Play row={props.row} onRef={playRef}/>
        <CameraEdit row={props.row} type="edit"  callBack={props.callBack} onRef={editRef}/>
      </div>
    </ClickAwayListener>
  );
}
