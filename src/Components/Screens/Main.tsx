import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { Route, Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Header from '../Common/Header';
import ContactPoints from './ContactPoints';
import SignIn from './SignIn';
import ContactPointDiscussion from './ContactPointDiscussion';
import ContactPoint from './ContactPoint';

const history = createBrowserHistory();

interface props {
  firebase: {
    login: (arg: any) => any;
    logout: () => any;
    auth: () => any;
  };
}

interface state {
  user: any;
}
class Main extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      user: null,
    };
    const that = this;
    props.firebase.auth().onAuthStateChanged(function(user: any) {
      that.setState({ user: user });
    });
  }
  logout() {
    this.props.firebase.logout().then(() => console.log('logout'));
  }
  render() {
    return (
      <Router history={history}>
        {this.state.user ? (
          <div>
            <Header user={this.props.firebase.auth().currentUser} signOut={() => this.logout()} />
            <Route path="/ContactPoint/:cpId/:connectorId" component={ContactPointDiscussion} />
            <Route exact path="/ContactPoint/:cpId" component={ContactPoint} />
            <Route exact path="/" component={ContactPoints} />
          </div>
        ) : (
          <SignIn />
        )}
      </Router>
    );
  }
}

export default compose(
  withFirebase,
  connect(),
)(Main);
