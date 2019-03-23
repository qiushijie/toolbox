import React from 'react';
import {BrowserRouter as Router, Switch, Route, RouteComponentProps} from 'react-router-dom';
import HomeView from "./views/Home";
import {Provider} from "mobx-react";
import stores from './stores';
import {connect} from "./services/SocketService";

class Root extends React.Component {
  componentDidMount() {
    connect();
  }
  render() {
    return (
      <Provider {...stores}>
        <Router>
          <Switch>
            <Route path="/" component={HomeView}/>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default Root;