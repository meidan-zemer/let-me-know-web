import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirebase, isLoaded, firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import { match, Redirect } from 'react-router';
import { contactPointType, discussionType } from 'let-me-know-ts-definitions';
import { contactPointsCollectionName, discussionsSubCollectionName } from '../../firebaseConfig';

const styles = (theme: any) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

interface props {
  match: match<{ cpId: string }>;
  cp: contactPointType;
  allDiscussions: discussionType[];
  uid: string;
  loaded: boolean;
  firestore: any;
  firebase: any;
  classes: any;
}

class ContactPoint extends Component<props> {
  renderDiscussion(dsc: discussionType, index: number) {
    return (
      <ListItem key={index}>
        <div>
          <Link to={`/ContactPoint/${this.props.match.params.cpId}/${dsc.connectorId}`}>
            <span>{dsc.title}</span>
          </Link>
        </div>
      </ListItem>
    );
  }
  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    } else if (this.props.cp.userId != this.props.uid) {
      return <Redirect to={`/ContactPoint/${this.props.cp.cpId}/${this.props.uid}`} />;
    } else
      return (
        <div>
          <h1>{this.props.cp.name}</h1>
          <List subheader={<ListSubheader component="div">My Contact Points Discussions</ListSubheader>}>
            {this.props.allDiscussions.map((d, i) => this.renderDiscussion(d, i))}
          </List>
        </div>
      );
  }
}

const mapStateToProps = (state: any, ownprops: props) => {
  const uid = ownprops.firebase.auth().currentUser.uid;
  const loaded = isLoaded(state.firestore.ordered.curCp) && isLoaded(state.firestore.ordered.allDiscussions);
  let cp: contactPointType = isLoaded(state.firestore.ordered.curCp) ? state.firestore.ordered.curCp[0] : {},
    allDiscussions: discussionType[] = state.firestore.ordered.allDiscussions;

  return {
    cp: cp,
    uid: uid,
    allDiscussions,
    loaded,
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
        doc: props.match.params.cpId,
        storeAs: 'curCp',
      },
      {
        collection: contactPointsCollectionName,
        doc: props.match.params.cpId,
        subcollections: [
          {
            collection: discussionsSubCollectionName,
          },
        ],
        storeAs: 'allDiscussions',
      },
    ];
  }),
  withStyles(styles),
)(ContactPoint);
