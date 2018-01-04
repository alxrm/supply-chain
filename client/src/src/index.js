import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './utils/serviceWorkerUtils';
import App from './components';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
