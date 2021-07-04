import React, { useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { Alert, AlertTitle } from '@material-ui/lab';
import Moment from 'moment'
import Switch from '@material-ui/core/Switch';
import API from '../api/Api';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  formClass: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  formDiv: {
    margin: '0 auto',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CameraShareEdit(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [enabled, setEnabled] = React.useState(props.row.enabled === 1?true:false);
  const cameraCode = props.row.cameraCode
  const [row, setRow] = React.useState({
    id: props.row.id,
    cameraId: props.row.cameraId,
    name: props.row.name,
    authCode: props.row.authCode,
    startTime: props.row.startTime?props.row.startTime:Moment(),
    deadline: props.row.deadline?props.row.deadline:Moment().add(7,"day"),
    enabled: props.row.enabled,
  });
  const [alertShow, setAlertShow] = React.useState(false);
  const [alertText, setAlertText] = React.useState("");

  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(props.onRef, () => {
    return {
      handleClickOpen: handleClickOpen,
    };
  });

  const handleClickOpen = () => {
    row.id = props.row.id
    row.cameraId = props.row.cameraId
    row.name = props.row.name
    row.authCode = props.row.authCode
    row.startTime = props.row.startTime?props.row.startTime:Moment()
    row.deadline = props.row.deadline?props.row.deadline:Moment().add(7,"day")
    row.enabled = props.row.enabled
    setRow(row)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const save = (data) => {
    API.cameraShareEdit(row)
    .then(res => {
      if (res.code === 1) {
        setOpen(false);
        if (props.callBack){
          props.callBack()
        }
        return;
      }
      setAlertText(res.msg);
      setAlertShow(true);
      window.setTimeout(function (){
        setAlertShow(false);
      },5000)
    });
  };

  const deleteCamera = (data) => {
    API.cameraShareDelete(row)
    .then(res => {
      if (res.code === 1) {
        setOpen(false);
        if (props.callBack){
          props.callBack()
        }
        return;
      }
      setAlertText(res.msg);
      setAlertShow(true);
      window.setTimeout(function (){
        setAlertShow(false);
      },5000)
    });
  };

  const formChange = (event) => {
    row[event.target.id] = event.target.value
  }

  const formDateTimeChange = (event) => {
    row[event.target.id] = Moment(event.target.value)
  }

  const switchChange = (event) => {
    console.log(event.target.checked)
    row[event.target.id] = event.target.checked?1:0
    if(event.target.id==="enabled"){
      setEnabled(event.target.checked)
    }
  }

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Button variant="contained" onClick={save}>
              保存 
            </Button>
            <span>&nbsp;&nbsp;</span>
            {props.type === 'edit'?
              <Button variant="contained" onClick={deleteCamera}>
                删除
              </Button>:""
            }       
            <Typography variant="h6" className={classes.title}>
            <div>{row.name?row.name+' 分享编辑':'创建分享'} </div>
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              <CloseIcon />
            </Button>
          </Toolbar>
        </AppBar>{
          alertShow?
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {alertText} <strong>check it out!</strong>
          </Alert>:""
        }
        
        <div className={classes.formDiv}>
          
          <form className={classes.formClass} noValidate autoComplete="off" onSubmit={save}>
            {props.type === 'edit'?
            <div>
            <TextField 
              id="id"
              label="id" 
              InputProps={{
                readOnly: true,
              }} 
              defaultValue={row.id}
            />
            </div>:""}
            <div>
              <TextField 
                id="name" 
                label="分享名称" 
                defaultValue={row.name}
                onChange={formChange}
              />
            </div>
            {/* <div>
              <TextField 
                id="authCode" 
                label="authCode" 
                defaultValue={row.authCode}
                onChange={formChange}
              />
            </div> */}
            <div>
              <TextField
                id="startTime"
                label="开始时间"
                type="datetime-local"
                defaultValue={row.startTime?Moment(row.startTime).format("YYYY-MM-DDTHH:mm"):Moment().format("YYYY-MM-DDTHH:mm")}
                // className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formDateTimeChange}
              />
            </div>
            <div>
              <TextField
                id="deadline"
                label="截止日期"
                type="datetime-local"
                defaultValue={row.deadline?Moment(row.deadline).format("YYYY-MM-DDTHH:mm"):Moment().add(7,"day").format("YYYY-MM-DDTHH:mm")}
                // className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formDateTimeChange}
              />
            </div>
            {props.type === 'edit'?"":
            <div>
              <Switch
                checked={enabled}
                id="enabled"
                onChange={switchChange}
                color="primary"
                name="enabled"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            }
          </form>
        </div>
      </Dialog>
    </div>
  );
}
