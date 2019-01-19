import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './Header';
import ContactPoints from './ContactPoints';
import GoogleSignIn from './GoogleSignIn';

interface props {
  firebase: {
    login:(arg:any)=>any;
    logout:()=>any;
    auth:()=>any;
  }
}

interface state {
  user:any;
}
class Main extends Component<props,state>{
  constructor(props:props){
    super(props);
    this.state={
      user:null
    };
    const that = this;
    props.firebase.auth().onAuthStateChanged(function(user:any) {
      that.setState({ user: user });
    });
  }
  googleSignIn(){
    this.props.firebase.login({ provider: 'google', type: 'popup' })
        .then((user:any)=>this.setState({user:user}));

  }
  logout(){
    this.props.firebase.logout()
        .then(()=>console.log("logout"));
  }
  render() {
    let rc = null;
    if ( !this.state.user ) {
      rc = <GoogleSignIn login={()=>this.googleSignIn()} />;
    } else {
      rc = (
        <BrowserRouter>
          <div>
            <Header user={this.props.firebase.auth().currentUser} signOut={()=>this.logout()} />
            <Route path="/" component={ContactPoints} />
          </div>
        </BrowserRouter>
      );
    }
    return rc;
  }
}

export default compose(
    withFirebase,
    connect()
)(Main);