import React from 'react';
import {BrowserRouter as Router, Switch, Route, RouteComponentProps} from 'react-router-dom';
import HomeView from "./views/Home";

class Root extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Switch>
            <Route path="/" component={HomeView}/>
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default Root;