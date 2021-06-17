import React from 'react';
import ReactDOM from 'react-dom';
import Rtsp2rtmp from './Rtsp2rtmp';

function App() {
  return (
    <Rtsp2rtmp />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));