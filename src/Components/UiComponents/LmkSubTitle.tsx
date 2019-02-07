import React, { Component } from 'react';

interface props {
  title: string;
}

class LmkMainTitle extends Component<props> {
  render() {
    return (
      <div style={styles.view}>
        <span  style={styles.text}>
          {this.props.title}
        </span>
      </div>
    );
  }
}

const styles = {
  view: {
    flex: 1,
    marginTop: '10%',
    marginLeft: '2%',
    width: '80%',
  },
  text: {
    fontSize: 25,
  },
};

export default LmkMainTitle;
