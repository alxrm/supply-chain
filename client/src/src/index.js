import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';
import logger from 'redux-logger';

import createStoreWith from './utils/createStoreWith';
import registerServiceWorker from './utils/registerServiceWorker';
import reducers from './reducers';
import authActions from './actions/authActions';
import App from './components/App';
import './index.css';

const store = createStoreWith(reducers, applyMiddleware(promiseMiddleware, logger),
  store => store.dispatch(authActions.restoreAuthSession())
);

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
