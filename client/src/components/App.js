import React from 'react';
import {Provider} from 'react-redux';
import {Route, Redirect, Switch, BrowserRouter} from 'react-router-dom';
import 'normalize.css';
import 'flexboxgrid2';

import connectWithDispatch from '../utils/connectWithDispatch';

import Header from './Layout/Header';
import Content from './Layout/Content';
import Login from './Auth';
import Signup from './Auth/Signup';
import Product from './Product';
import Owner from './Owner';
import ProductList from './ProductList';
import Scanner from './Scanner';

const renderAuthorized = () => (
  <div>
    <Header />
    <Content>
      <Switch>
        <Route path="/owner" component={Owner} exact />
        <Route path="/products/:uid" component={Product} />
        <Route path="/products" component={ProductList} />
        <Route path="/scanner" component={Scanner} />
        <Route path="/transferring" component={ProductList} />
        <Redirect from="/" to="/owner" />
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

export default connectWithDispatch(state => ({
  isAuthorized: state.auth.isAuthorized
}))(App);