import React, { memo } from "react";
import { Route, Switch } from "react-router-dom";
import CameraList from '../camera/CameraList';
import NoMatch from '../404/NoMatch';
import Live from '../camera/Live';

function Routing(props) {
    return (
      <Switch>
        <Route exact path="/" component={CameraList} />
        <Route exact path="/live" component={Live} /> 
        <Route component={NoMatch} />
      </Switch>
    );
  }
  
  export default memo(Routing);
