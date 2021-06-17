import React, { useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Switch from '@material-ui/core/Switch';
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

export default function Play(props) {
  const classes = useStyles();
  const [audio, setAudio] = React.useState(true);
  var player = null;
  var lastDecodedFrame = 0

  const switchChange = (event) => {
    setAudio(event.target.checked)
  }

  const getQueryString = (name) => {
    let reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.hash.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
  }

  const flv_load = (val) => {
    let method = getQueryString("method");
    let code = getQueryString("code");
    let authCode = getQueryString("authCode");
    if(!method || !code || !authCode){
      return
    }
    var mediaDataSource = {
      type: 'flv'
    };
    let videoUrl = API.flvURL+"/live/"+method+"/"+code+"/"+authCode+".flv";
    // let videoUrl = window.origin.substring(0,window.origin.lastIndexOf(":"))+":9091/live/"+method+"/"+code+"/"+authCode+".flv";
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
      <div>
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
            {/* <Button autoFocus color="inherit">
              <CloseIcon />
            </Button> */}
          </Toolbar>
        </AppBar>
        <div className={classes.videoContainer}>
            <div>
                <video name="videoElement" className="centeredVideo" controls allow="autoPlay" width="100%" >
                    Your browser is too old which doesn't support HTML5 video.
                </video>
            </div>
        </div>
      </div>
    </div>
  );
}
