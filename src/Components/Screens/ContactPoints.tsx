import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PopUp from 'reactjs-popup';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { contactPointType, contactPointsCollectionName } from 'let-me-know-common';
import { withFirebase } from 'react-redux-firebase';
import { firestoreConnect } from 'react-redux-firebase';

const styles = (theme: any) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

interface compState {
  addContactPointPopup: {
    open: boolean;
    name: string;
    description: string;
  };
}
interface props {
  contactPoints: contactPointType[];
  firestore: any;
  firebase: any;
  classes: any;
}
class ContactPoints extends Component<props, compState> {
  constructor(props: any) {
    super(props);
    this.state = {
      addContactPointPopup: {
        open: false,
        name: '',
        description: '',
      },
    };
  }

  setPopup(open: boolean) {
    this.setState({ ...this.state, addContactPointPopup: { ...this.state.addContactPointPopup, open: open } });
  }
  addNewContactPoint() {
    const newCpDocRef = this.props.firestore.collection(contactPointsCollectionName).doc();
    const cp: contactPointType = {
      cpId: newCpDocRef.id,
      name: this.state.addContactPointPopup.name,
      description: this.state.addContactPointPopup.description,
      createdDate: this.props.firestore.FieldValue.serverTimestamp(),
      modifiedDate: this.props.firestore.FieldValue.serverTimestamp(),
      userId: this.props.firebase.auth().currentUser.uid,
      ownerAlias: '',
    };
    newCpDocRef
      .set(cp)
      .then(() => {
        this.setPopup(false);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        <h1>Contact Points</h1>
        <div>
          <button onClick={() => this.setPopup(true)}>Add Contact Point</button>
        </div>
        <List className={this.props.classes.root}>
          {this.props.contactPoints
            ? this.props.contactPoints.map((cp: contactPointType, index: number) => {
                return (
                  <ListItem key={index}>
                    <div>
                      <Link to={'/ContactPoint/' + cp.cpId}>
                        <span> {cp.name} </span>
                      </Link>
                    </div>
                  </ListItem>
                );
              })
            : null}
        </List>
        <PopUp
          open={this.state.addContactPointPopup.open}
          onClose={() => this.setPopup(false)}
          modal
          closeOnDocumentClick
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

const mapStateToProps = (state: any) => {
  return {
    contactPoints: state.firestore.ordered[contactPointsCollectionName]
      ? state.firestore.ordered[contactPointsCollectionName]
      : [],
  };
};

const mapDispatchToProps = {};

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  firestoreConnect((props: props) => {
    const uid = props.firebase.auth().currentUser.uid;
    if (!uid) return [];
    return [
      {
        collection: contactPointsCollectionName,
        where: [['userId', '==', uid]],
      },
    ];
  }),
  withStyles(styles),
)(ContactPoints);
