import React, { Component } from 'react';

interface props {
  title: string;
}
class LmkMainTitle extends Component<props> {
  render() {
    return (
      <div style={styles.view}>
        <span style={styles.text}>
          {this.props.title}
        </span>
      </div>
    );
  }
}

const styles = {
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  text: {
    fontSize: 40,
  },
};

export default LmkMainTitle;
