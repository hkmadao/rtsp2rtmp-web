import React, { useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Flv from 'flv.js';
import API from '../api/Api';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#eebbaa',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  videoContainer: {
    width: '90%',
    margin: '0 auto'
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Play(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [audio, setAudio] = React.useState(true);
  const [playParam, setPlayParam] = React.useState(props.playParam || {
    playMethod: "",
    cameraCode: "",
    authCode: ""
  });
  var player = null;
  var lastDecodedFrame = 0

  const switchChange = (event) => {
    setAudio(event.target.checked)
  }

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

  const flv_load = (val) => {
      var mediaDataSource = {
          type: 'flv'
      };
      let videoUrl = API.flvURL+"/live/"+playParam.playMethod+"/"+playParam.cameraCode+"/"+playParam.authCode+".flv";
      mediaDataSource['url'] = videoUrl;
      mediaDataSource['hasAudio'] = audio;
      mediaDataSource['isLive'] = true;
      console.log('MediaDataSource', mediaDataSource);
      flv_load_mds(mediaDataSource);
  }

  const flv_load_mds = (mediaDataSource) => {
      var element = document.getElementsByClassName('centeredVideo')[0];
    
      if (typeof player !== "undefined") {
          if (player != null) {
            player.pause();
            player.unload();
            player.detachMediaElement();
            player.destroy();
            player= null;
          }
      }
      
      player = Flv.createPlayer(mediaDataSource, {
          enableWorker: false,
          lazyLoadMaxDuration: 3 * 60,
          seekType: 'range',
      });
      player.on(Flv.Events.ERROR, (errorType, errorDetail, errorInfo) => {
        console.log("errorType:", errorType);
        console.log("errorDetail:", errorDetail);
        console.log("errorInfo:", errorInfo);
        //视频出错后销毁重新创建
        if (player) {
          player.pause();
          player.unload();
          player.detachMediaElement();
          player.destroy();
          player= null;
          window.setTimeout(flv_load,500)
        }
      });
      //画面卡死
      player.on(Flv.Events.STATISTICS_INFO, function (res) {
        if (lastDecodedFrame == 0) {
          lastDecodedFrame = res.decodedFrames;
          return;
        }
        if (lastDecodedFrame != res.decodedFrames) {
          lastDecodedFrame = res.decodedFrames;
        } else {
            console.log("decodedFrames:", res.decodedFrames)
            lastDecodedFrame = 0;
            if (player) {
              player.pause();
              player.unload();
              player.detachMediaElement();
              player.destroy();
              player= null;
              window.setTimeout(flv_load,500)
          }
        }
      });
      player.attachMediaElement(element);
      player.load();
      player.play()
  }

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Button variant="contained" onClick={flv_load}>
              play
            </Button>
            <Typography variant="h6" className={classes.title}>
            hasAudio
              <Switch
                checked={audio}
                id="Audio"
                color="primary"
                name="hasAudio"
                onChange={switchChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              <CloseIcon />
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.videoContainer}>
            <div>
                <video name="videoElement" className="centeredVideo" controls allow="autoPlay" width="100%" >
                    Your browser is too old which doesn't support HTML5 video.
                </video>
            </div>
        </div>
      </Dialog>
    </div>
  );
}
