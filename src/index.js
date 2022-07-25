import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store';


//Styles
import './scss/app.scss';
import './vendor/css/modal.css';

//todo pass a preloaded state with params from dataviewer
const store = configureStore();

//*********************************************************
//code to avoid images to open if dragged outside dropzone
window.addEventListener('dragover', (e) => {
    e = e || event;
    e.preventDefault();
}, false);
window.addEventListener('drop', (e) => {
    e = e || event;
    e.preventDefault();
}, false);
//*********************************************************

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
