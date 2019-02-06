import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore } from 'redux-firestore';
import rootReducer from '../redux/rootReducer';
import Main from './Screens/Main';
import firebase from '../firebaseConfig';
import 'firebase/auth';
import 'firebase/firestore';

// react-redux-firebase config
const rrfConfig = {
  //  userProfile: 'users',
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

const createStoreWithFirebase = compose<any, any, any>(
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, rrfConfig),
)(createStore);

const initialState = {};
const store = createStoreWithFirebase(rootReducer, initialState);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

export default App;
