import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import registerServiceWorker from './utils/register-service-worker';

ReactDOM.render(<App />, document.getElementById('root'));

// We may want to remove service workers for now as it may hinder our
// productivity while developping the UI!
//
// registerServiceWorker();
