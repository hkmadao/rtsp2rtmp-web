import React from 'react';
import ReactDOM from 'react-dom';
import CameraList from './camera/cameraList';

function App() {
  return (
    <CameraList />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));