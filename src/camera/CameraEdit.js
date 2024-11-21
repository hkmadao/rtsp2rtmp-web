import React, { useImperativeHandle } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import { Alert, AlertTitle } from "@material-ui/lab";
import Switch from "@material-ui/core/Switch";
import API from "../api/Api";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  formClass: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  formDiv: {
    margin: "0 auto",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CameraEdit(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [enabled, setEnabled] = React.useState(
    props.row.enabled === 1 ? true : false
  );
  const [saveVideo, setSaveVideo] = React.useState(
    props.row.saveVideo === 1 ? true : false
  );
  const [live, setLive] = React.useState(props.row.live === 1 ? true : false);
  const [rtmpPushStatus, setRtmpPushStatus] = React.useState(
    props.row.live === 1 ? true : false
  );
  const [row, setRow] = React.useState({
    id: props.row.id,
    code: props.row.code,
    rtspURL: props.row.rtspURL,
    rtmpURL: props.row.rtmpURL,
    playAuthCode: props.row.playAuthCode,
    onlineStatus: props.row.onlineStatus,
    enabled: props.row.enabled,
    saveVideo: props.row.saveVideo,
    live: props.row.live,
    rtmpPushStatus: props.row.rtmpPushStatus,
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const save = (data) => {
    API.cameraEdit(row).then((res) => {
      if (res.code === 1) {
        setOpen(false);
        if (props.callBack) {
          props.callBack();
        }
        return;
      }
      setAlertText(res.msg);
      setAlertShow(true);
      window.setTimeout(function () {
        setAlertShow(false);
      }, 5000);
    });
  };

  const deleteCamera = (data) => {
    API.cameraDelete(row).then((res) => {
      if (res.code === 1) {
        setOpen(false);
        if (props.callBack) {
          props.callBack();
        }
        return;
      }
      setAlertText(res.msg);
      setAlertShow(true);
      window.setTimeout(function () {
        setAlertShow(false);
      }, 5000);
    });
  };

  const formChange = (event) => {
    row[event.target.id] = event.target.value;
  };

  const switchChange = (event) => {
    console.log(event.target.checked);
    row[event.target.id] = event.target.checked ? 1 : 0;
    if (event.target.id === "enabled") {
      setEnabled(event.target.checked);
    }
    if (event.target.id === "saveVideo") {
      setSaveVideo(event.target.checked);
    }
    if (event.target.id === "live") {
      setLive(event.target.checked);
    }
    if (event.target.id === "rtmpPushStatus") {
      setRtmpPushStatus(event.target.checked);
    }
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Button variant="contained" onClick={save}>
              保存
            </Button>
            <span>&nbsp;&nbsp;</span>
            {props.type === "edit" ? (
              <Button variant="contained" onClick={deleteCamera}>
                删除
              </Button>
            ) : (
              ""
            )}
            <Typography variant="h6" className={classes.title}></Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              <CloseIcon />
            </Button>
          </Toolbar>
        </AppBar>
        {alertShow ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {alertText} <strong>check it out!</strong>
          </Alert>
        ) : (
          ""
        )}

        <div className={classes.formDiv}>
          <form
            className={classes.formClass}
            noValidate
            autoComplete="off"
            onSubmit={save}
          >
            {props.type === "edit" ? (
              <div>
                <TextField
                  id="id"
                  label="id"
                  InputProps={{
                    readOnly: true,
                  }}
                  defaultValue={row.id}
                />
              </div>
            ) : (
              ""
            )}
            <div>
              <TextField
                id="code"
                label="摄像头编号"
                defaultValue={row.code}
                onChange={formChange}
              />
            </div>
            <div>
              <TextField
                id="rtspURL"
                label="rtspURL"
                defaultValue={row.rtspURL}
                onChange={formChange}
              />
            </div>
            <div>
              <TextField
                id="rtmpURL"
                label="rtmpURL"
                defaultValue={row.rtmpURL}
                onChange={formChange}
              />
            </div>
            {props.type === "edit" ? (
              ""
            ) : (
              <div>
                启用状态：
                <Switch
                  disabled={true}
                  checked={enabled}
                  id="enabled"
                  onChange={switchChange}
                  color="primary"
                  name="enabled"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              </div>
            )}
            <div>
              录像状态：
              <Switch
                disabled={true}
                checked={saveVideo}
                id="saveVideo"
                onChange={switchChange}
                color="primary"
                name="saveVideo"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div>
              直播状态：
              <Switch
                disabled={true}
                checked={live}
                id="live"
                onChange={switchChange}
                color="primary"
                name="live"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div>
              Rtmp推送状态：
              <Switch
                disabled={true}
                checked={rtmpPushStatus}
                id="rtmpPushStatus"
                onChange={switchChange}
                color="primary"
                name="rtmpPushStatus"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
