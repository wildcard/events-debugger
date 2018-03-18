import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import 'react-virtualized/styles.css'; // only needs to be imported once
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
