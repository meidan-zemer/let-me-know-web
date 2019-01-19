import React, { Component } from 'react';
import PopUp from 'reactjs-popup';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { connect } from 'react-redux'

interface props {}

interface state {
  addContactPointPopup: {
    open: boolean;
    name: string;
    description: string;
  };
}

class ContactPoints extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      addContactPointPopup: {
        open: false,
        name: '',
        description: '',
      }
    };
  }

  addNewContactPoint() {
    alert('name:' + this.state.addContactPointPopup.name);
    this.setState({ ...this.state, addContactPointPopup: { ...this.state.addContactPointPopup, open: false } });
  }
  render() {
    return (
      <div>
        <h1>Contact Points</h1>
        <PopUp
          trigger={<button>Add Contact Point</button>}
          modal
          closeOnDocumentClick
          open={this.state.addContactPointPopup.open}
        >
          <div>
            <h1>New Contact Point</h1>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={this.state.addContactPointPopup.name}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    addContactPointPopup: { ...this.state.addContactPointPopup, name: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={this.state.addContactPointPopup.description}
                onChange={e =>
                  this.setState({
                    ...this.state,
                    addContactPointPopup: { ...this.state.addContactPointPopup, description: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <input type="button" onClick={() => this.addNewContactPoint()} value="Add" />
            </div>
          </div>
        </PopUp>
      </div>
    );
  }
}

export default firestoreConnect()(ContactPoints);