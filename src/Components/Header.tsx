import React, { Component } from 'react';
import { User } from 'firebase';
interface props {
  user: User;
  signOut: () => any;
}

class Header extends Component<props> {
  render() {
    return (
      <div>
        <span> Welcome {this.props.user.displayName}  </span>
        <button onClick={() => this.props.signOut()}>Sign out </button>
      </div>
    );
  }
}

export default Header;
