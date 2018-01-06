import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';
import logger from 'redux-logger';

import registerServiceWorker from './utils/registerServiceWorker';
import reducers from './reducers';
import App from './components/App';
import './index.css';

const store = createStore(reducers, applyMiddleware(promiseMiddleware, logger));

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
