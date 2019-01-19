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
    auth:()=>{currentUser:any};
  }
}

interface state {
  isSignIn:boolean;
}
class Main extends Component<props,state>{
  constructor(props:props){
    super(props);
    let isSignIn = false;
    if( props && props.firebase && props.firebase.auth().currentUser !== null){
      isSignIn = true;
    }
    this.state = {
      isSignIn:isSignIn
    };
  }
  googleSignIn(){
    this.props.firebase.login({ provider: 'google', type: 'popup' })
        .then(()=>this.setState({isSignIn:true}));

  }
  logout(){
    this.props.firebase.logout()
        .then(()=>this.setState({isSignIn:false}));
  }
  render() {
    let rc = null;
    if (!this.state.isSignIn) {
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