//firebaseConfig.js
//

import firebase from "firebase";

// https://firebase.google.com/docs/web/setup?authuser=0

// See firebase setup in above google firebase documentation url
export const config = {
    apiKey: "AIzaSyD55ZWqiyRUAoGv-XPXVlSULQkrsQ4BDGI",
    authDomain: "let-me-know-36373.firebaseapp.com",
    projectId: "let-me-know-36373"
//    databaseURL: "----",
//    storageBucket: "----",
//    messagingSenderId: "----"
};


firebase.initializeApp(config);

export default firebase;