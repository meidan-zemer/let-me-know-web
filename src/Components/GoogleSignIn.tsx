import React, { Component } from 'react';

interface props {
  login: () => any;
}
class GoogleSignIn extends Component<props> {
  render() {
    return (
      <div>
        <h1>Let Me Know</h1>
        <p> Please sign in using you google account</p>
        <button onClick={()=>this.props.login()}>Sign In</button>
      </div>
    );
  }
}
export default GoogleSignIn;
