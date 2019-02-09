import React, { Component, CSSProperties } from 'react';

interface props {
  title: string;
}

class LmkMainTitle extends Component<props> {
  render() {
    return (
      <div style={styles.view}>
        <span style={styles.text}>{this.props.title}</span>
      </div>
    );
  }
}

const styles = {
  view: {
    textAlign: 'center' as CSSProperties['textAlign'],
  },
  text: {
    fontSize: 20,
    color: 'gray',
  },
};

export default LmkMainTitle;
