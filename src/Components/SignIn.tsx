import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import GoogleButton from 'react-google-button';

interface props {
  firebase: {
    login: (arg: any) => any;
    logout: () => any;
    auth: () => any;
  };
}

interface state {
  signIn: {
    email: string;
    password: string;
    err: string | null;
  };
  signUp: {
    email: string;
    password: string;
    err: string | null;
  };
  isSigninInProgress: boolean;
}

class SignIn extends Component<props, state> {
  googleSignIn() {
    this.props.firebase.login({ provider: 'google', type: 'popup' });
  }

  render() {
    return (
      <div>
        <h1>Let Me Know</h1>
        <p> Please sign in using you google account</p>
        <GoogleButton onClick={() => this.googleSignIn()} />
      </div>
    );
  }
}

export default compose(
  withFirebase,
  connect(),
)(SignIn);
