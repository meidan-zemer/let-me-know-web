//firebaseConfig.js
//

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyD55ZWqiyRUAoGv-XPXVlSULQkrsQ4BDGI",
  authDomain: "let-me-know-36373.firebaseapp.com",
  databaseURL: "https://let-me-know-36373.firebaseio.com",
  projectId: "let-me-know-36373",
  storageBucket: "let-me-know-36373.appspot.com",
  messagingSenderId: "295381570076"
};


firebase.initializeApp(config);
firebase.firestore();

export const  contactPointsCollectionName = "contactPoints";
export const discussionSubCollectionName = "contactPointDiscussions";
export default firebase;
