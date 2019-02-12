import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import Privacy from './Components/Screens/PrivacyPolicy';

if(window.location.pathname === '/privacy'){
    ReactDOM.render(<Privacy />, document.getElementById('root'));
} else {
    ReactDOM.render(<App />, document.getElementById('root'));
}
