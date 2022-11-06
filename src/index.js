import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import firebase from 'firebase';
import './index.css';
import App from './App';
import app from './reducers/app';
import registerServiceWorker from './registerServiceWorker';


const store = createStore(app, applyMiddleware(thunk));

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBWsX_nlDtZFiVkONhAPOAlW4YHBjJAFow",
  authDomain: "stockapp-pfe.firebaseapp.com",
  databaseURL: "https://stockapp-pfe.firebaseio.com",
  projectId: "stockapp-pfe",
  storageBucket: "stockapp-pfe.appspot.com",
  messagingSenderId: "385287780528",
};
firebase.initializeApp(config);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();