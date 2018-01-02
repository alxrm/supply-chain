import React from 'react';
import {Route, Redirect, Switch, BrowserRouter} from 'react-router-dom';
import 'normalize.css';
import 'flexboxgrid2';
import './App.css';

export default () => (
  <BrowserRouter>
    <div className="App">
      <Switch>
        <Route path="/" component={() => (<div>Main</div>)} exact />
        <Route path="/items/:uid" component={(props) => (<div>Item {props.match.params.uid}</div>)} />
        <Route path="/login" component={() => (<div>Login</div>)} />
        <Redirect from="**" to="/login" />
      </Switch>
    </div>
  </BrowserRouter>
);