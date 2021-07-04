import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon from '@material-ui/icons/List';
import Copy from 'copy-to-clipboard';
import CopyAlert from './CopyAlert'
import Play from '../camera/Play';
import CameraEdit from './CameraShareEdit';
import API from '../api/Api';

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
  const [dialogObj, setDialogObj] = React.useState({title:"Success",content:"copy success !"});
  const [row,setRow] = React.useState(props.row);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const enabled=() => {
    row.enabled = row.enabled === 1?0:1
    API.cameraShareEnabled(row)
    .then(res => {
      if (res.code === 1) {
        setOpen(false);
        if (props.callBack){
          props.callBack()
        }
        return;
      }
    });
  }

  let playRef = React.createRef();
  function play() {
    setOpen(false);
    setRow(props.row)
    playRef.current.handleClickOpen();
  }

  let editRef = React.createRef();
  function edit() {
    setOpen(false);
    editRef.current.handleClickOpen();
  }

  let copyRef = React.createRef();
  function share() {
    setOpen(false);
    let sURL = window.location.origin+window.location.pathname+"#/live?method=temp&code="+props.row.cameraCode+"&authCode="+props.row.authCode
    Copy(sURL);
    copyRef.current.handleClickOpen();
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
                <ListItemText primary="编辑" onClick={edit}/>
              </ListItem>
              <ListItem button onClick={enabled}>
                {
                  props.row.enabled === 1?
                  <ListItemText primary="禁用" />:<ListItemText primary="启用" />
                }
              </ListItem>
              <ListItem button onClick={play}>
                <ListItemText primary="播放" />
              </ListItem>
              <ListItem button onClick={share}>
                <ListItemText primary="分享" />
              </ListItem>
            </List>
          </div>
        ) : null}
        <Play playParam={ {playMethod:"temp",cameraCode:row.cameraCode,authCode:row.authCode } } onRef={playRef}/>
        <CameraEdit row={props.row} type="edit" callBack={props.callBack} onRef={editRef}/>
        <CopyAlert dialog={dialogObj} onRef={copyRef}/>
      </div>
    </ClickAwayListener>
  );
}
