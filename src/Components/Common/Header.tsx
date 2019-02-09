import React, { Component } from 'react';
import { User } from 'firebase';

interface props {
  user: User;
  signOut: () => any;
}
const styles = {
  headerContainer: {
    width: '100%',
    height: '50px',
    backgroundColor: '#2089dc',
    display: 'flex',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    alignContent: 'left',
    marginLeft: '2%',
    alignSelf: 'center',
  },
  signOut: {
    marginRight: '2%',
    alignSelf: 'center',
  },
};

class Header extends Component<props> {
  render() {
    return (
      <div style={styles.headerContainer}>
        <span style={styles.text}>
          {' '}
          Welcome {this.props.user.displayName ? this.props.user.displayName : this.props.user.email}{' '}
        </span>
        <span style={styles.signOut}>
          <button onClick={() => this.props.signOut()}>Sign out </button>
        </span>
      </div>
    );
  }
}

export default Header;
