import React from 'react';
import {Route, Redirect, Switch, BrowserRouter} from 'react-router-dom';
import styled from 'styled-components';
import 'normalize.css';
import 'flexboxgrid2';

import Header from './Layout/Header';
import Login from './Login';
import Item from './Item';
import Receive from './Receive';
import Owner from './Owner';
import ItemList from './ItemList';

const Content = styled.div`
  padding-top: 56px;
  max-width: 768px;
  margin: auto;
`;

const renderAuthorizedRoutes = () => (
  <Switch>
    <Route path="/" component={Owner} exact />
    <Route path="/items/:uid" component={Item} />
    <Route path="/items" component={ItemList} />
    <Route path="/receive" component={Receive} />
    <Redirect from="**" to="/" />
  </Switch>
);

const renderUnauthorizedRoutes = () => (
  <Switch>
    <Route path="/" component={Login} exact />
    <Redirect from="**" to="/" />
  </Switch>
);

export default ({ isAuthorized = true }) => (
  <BrowserRouter>
    <div>
      <Header />
      <Content>
        {
          isAuthorized
            ? renderAuthorizedRoutes()
            : renderUnauthorizedRoutes()
        }
      </Content>
    </div>
  </BrowserRouter>
);