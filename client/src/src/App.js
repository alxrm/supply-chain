import React from 'react';
import {Route, Redirect, Switch, BrowserRouter} from 'react-router-dom';
import 'normalize.css';
import 'flexboxgrid2';
import styled from 'styled-components';
import './App.css';

import Header from './Header';

const Content = styled.div`
  padding-top: 56px;
`;

export default ({ isAuthorized = true }) => (
  <BrowserRouter>
    <div className="App">
      <Header />
      <Content>
        <Switch>
          <Route path="/" component={() => (isAuthorized ? <div>Main</div> : <div>Login</div>)} exact />
          <Route path="/items/:uid" component={(props) => (<div>Item {props.match.params.uid}</div>)} />
          <Redirect from="**" to="/" />
        </Switch>
      </Content>
    </div>
  </BrowserRouter>
);