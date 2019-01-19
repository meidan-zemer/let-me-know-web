import React, { Component } from 'react';
import firebase from "../firebaseConfig"; // Careful to not import from "firebase"
import {User} from 'firebase';
import {withFirebaseAuth} from 'react-auth-firebase';
import Main from './Main';
import SignIn from './SignIn';

interface props{
  signInWithGoogle: ()=>Promise<any>;
  googleAccessToken: string |null;
  signOut: ()=>any;
  user: User;
  error: any;
}

class App extends Component<props> {
  render() {
    const {
      signInWithGoogle,
      googleAccessToken,
      signOut,
      user,
      error
    } = this.props;

    let rc= null;
    if (this.props.user === null){
      rc = <SignIn signInWithGoogle={this.props.signInWithGoogle}/>
    } else if(this.props.error){
      rc = <div>{this.props.error}</div>
    } else {
      rc = <Main signOut={this.props.signOut} user={this.props.user}/>
    }
    return rc;
  }
}


const authConfig = {
  google: {
    // redirect: true, // Opens a pop up by default
    returnAccessToken: true, // Returns an access token as googleAccessToken prop
    saveUserInDatabase: true // Saves user in database at /users ref
  }
}
export default withFirebaseAuth(App, firebase, authConfig);