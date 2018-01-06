import React from 'react';
import {Provider, connect} from 'react-redux';
import {Route, Redirect, Switch, BrowserRouter} from 'react-router-dom';
import 'normalize.css';
import 'flexboxgrid2';

import {mapDispatchToProps} from '../actions';

import Header from './Layout/Header';
import Content from './Layout/Content';
import Login from './Auth';
import Signup from './Auth/Signup';
import Item from './Item';
import Receive from './Receive';
import Owner from './Owner';
import ItemList from './ItemList';

const renderAuthorized = () => (
  <div>
    <Header />
    <Content>
      <Switch>
        <Route path="/" component={Owner} exact />
        <Route path="/items/:uid" component={Item} />
        <Route path="/items" component={ItemList} />
        <Route path="/receive" component={Receive} />
        <Redirect from="**" to="/" />
      </Switch>
    </Content>
  </div>
);

const renderUnauthorized = () => (
  <Switch>
    <Route path="/" component={Login} exact />
    <Route path="/signup" component={Signup} exact />
    <Redirect from="**" to="/" />
  </Switch>
);

const App = ({ store, isAuthorized }) => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        {isAuthorized ? renderAuthorized() : renderUnauthorized()}
      </div>
    </BrowserRouter>
  </Provider>
);

export default connect(state => ({
  isAuthorized: state.auth.isAuthorized
}), mapDispatchToProps)(App);