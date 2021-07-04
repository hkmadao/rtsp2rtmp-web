import { HashRouter } from "react-router-dom";
import Routing from './route/Routing';

function Rtsp2rtmp() {
  return (
    <div>
        <HashRouter>
            <Routing/>
        </HashRouter>
    </div>
  );
} 

export default Rtsp2rtmp;