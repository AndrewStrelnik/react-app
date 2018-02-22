import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './style.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter as Router} from 'react-router-dom';



ReactDOM.render(
  <Router>
    <App />
  </Router>, 
document.getElementById('main'));
registerServiceWorker();
