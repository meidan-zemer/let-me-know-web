import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, withFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { match } from 'react-router';
import {
  contactPointType,
  discussionType,
  messageType,
  contactPointsCollectionName,
  discussionsSubCollectionName,
  messagesSubCollectionName,
  getTimeDate,
} from 'let-me-know-common';
import SendIcon from '@material-ui/icons/Send';
import LmkLoading from '../UiComponents/LmkLoading';
import LmkSubTitle from '../UiComponents/LmkSubTitle';
import LmkMainTitle from '../UiComponents/LmkMainTitle';
import LmkButton from '../UiComponents/LmkButton';

const styles = (theme: any) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

interface props {
  match: match<{ cpId: string; connectorId: string }>;
  cp: contactPointType;
  uid: string;
  discussion: discussionType;
  messages: messageType[];
  isDiscussionOwner: boolean;
  loaded: boolean;
  firestore: any;
  firebase: any;
  classes: any;
}

interface state {
  newMessageContent: string;
  editMode: boolean;
  title: string;
  alias: string;
  updating: boolean;
}

class ContactPointDiscussion extends Component<props, state> {
  constructor(props: props) {
    super(props);
    let title = '',
      alias = '';
    if (!isEmpty(props.discussion)) {
      title = props.discussion.title;
      alias = props.discussion.connectorAlias;
    }
    this.state = {
      newMessageContent: '',
      editMode: false,
      updating: false,
      alias,
      title,
    };
  }

  addDiscussion() {
    let desc: discussionType = {
      connectorId: this.props.uid,
      connectorAlias: '',
      title: this.props.cp.name,
      modifiedDate: this.props.firestore.FieldValue.serverTimestamp(),
      createdDate: this.props.firestore.FieldValue.serverTimestamp(),
    };
    const newdiscussionDocRef = this.props.firestore
      .collection(contactPointsCollectionName)
      .doc(this.props.cp.cpId)
      .collection(discussionsSubCollectionName)
      .doc(this.props.uid);
    newdiscussionDocRef.set(desc).then(() => this.setState({ editMode: true }));
  }
  updateDiscussionTitle(title: string) {
    return this.updateDiscussion({ title });
  }
  updateDiscussion(obj: any) {
    let updatedDiscussion = {
      ...this.props.discussion,
      ...obj,
      modifiedDate: this.props.firestore.FieldValue.serverTimestamp(),
    };
    return this.props.firestore
      .collection(contactPointsCollectionName)
      .doc(this.props.cp.cpId)
      .collection(discussionsSubCollectionName)
      .doc(this.props.uid)
      .update(updatedDiscussion);
  }
  updateDiscussionConnectorAlias(connectorAlias: string) {
    return this.updateDiscussion({ connectorAlias });
  }
  getMessageSenderAlias(uid: string) {
    if (uid === this.props.uid) {
      return this.props.firebase.auth().currentUser.displayName
        ? this.props.firebase.auth().currentUser.displayName
        : this.props.firebase.auth().currentUser.email;
    } else {
      if (uid === this.props.discussion.connectorId) {
        if (this.props.discussion.connectorAlias) {
          return this.props.discussion.connectorAlias;
        } else {
          return 'anonymous';
        }
      } else {
        if (this.props.cp.ownerAlias) {
          return this.props.cp.ownerAlias;
        } else {
          return 'anonymous';
        }
      }
    }
  }
  sendMessage() {
    const msg: messageType = {
      createDate: this.props.firestore.FieldValue.serverTimestamp(),
      content: this.state.newMessageContent,
      from: this.props.uid,
    };

    this.props.firestore
      .add(
        `${contactPointsCollectionName}/${this.props.cp.cpId}/${discussionsSubCollectionName}/${
          this.props.discussion.connectorId
        }/${messagesSubCollectionName}`,
        msg,
      )
      .then(() => {
        this.setState({ newMessageContent: '' });
        console.log('Added message');
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  renderTimeStamp(ts: any) {
    if (ts && ts.seconds) {
      return getTimeDate(ts.seconds * 1000);
    } else {
      return 'Now';
    }
  }
  renderMessage(msg: messageType, index: number) {
    return (
      <ListItem key={index}>
        <div>
          <span style={{ fontWeight: 'bold' }}>{this.getMessageSenderAlias(msg.from) + ' '}</span>
          <span>{this.renderTimeStamp(msg.createDate)}</span>
          <div>{msg.content}</div>
        </div>
      </ListItem>
    );
  }
  renderNewMessage() {
    return (
      <ListItem key={this.props.messages.length}>
        <div style={{ width: '100%' }}>
          <span style={{ width: '90%', display: 'inline-grid' }}>
            <TextField
              value={this.state.newMessageContent}
              onChange={e => this.setState({ newMessageContent: e.target.value })}
              fullWidth={true}
            />
          </span>
          <SendIcon color={'primary'} onClick={() => this.sendMessage()} />
        </div>
      </ListItem>
    );
  }
  renderEditDiscussion() {
    return (
      <div>
        <div>
            <LmkMainTitle title={this.props.cp.name}/>
            <LmkSubTitle title={this.props.cp.description}/>
        </div>
        <span>
          <TextField
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            label={'Enter Discussion Title'}
          />
        </span>
        <span style={{ marginLeft: '5%' }}>
          <TextField
            value={this.state.alias}
            onChange={event => this.setState({ alias: event.target.value })}
            label={'Enter Connector Name'}
          />
        </span>
        <div style={{ marginTop: '5%' }}>
          <LmkButton
            onClick={() => {
              this.setState({ updating: true });
              this.updateDiscussionTitle(this.state.title)
                .then(() => this.updateDiscussionConnectorAlias(this.state.alias))
                .then(() => this.setState({ editMode: false, updating: false }));
            }}
          >
            {'Update'}
          </LmkButton>
        </div>
      </div>
    );
  }
  render() {
    if (!this.props.loaded || this.state.updating) {
      return <LmkLoading />;
    } else if (isEmpty(this.props.discussion)) {
      if (this.props.isDiscussionOwner) {
        this.addDiscussion();
        return <LmkLoading />;
      } else {
        return <div>Not found</div>;
      }
    }
    if (this.state.editMode) {
      return this.renderEditDiscussion();
    } else {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ alignSelf: 'center' }}>
            <LmkMainTitle title={this.props.cp.name} />
            <LmkSubTitle
              title={
                'Discussion:' +
                this.props.discussion.title +
                ' Created By ' +
                this.props.discussion.connectorAlias +
                ' on ' +
                this.renderTimeStamp(this.props.discussion.createdDate)
              }
            />
          </div>
          {this.props.isDiscussionOwner ? (
            <LmkButton
              onClick={() =>
                this.setState({
                  editMode: true,
                  title: this.props.discussion.title,
                  alias: this.props.discussion.connectorAlias,
                })
              }
            >
              {'Edit'}
            </LmkButton>
          ) : null}
          <List>{this.props.messages.map((m, i) => this.renderMessage(m, i)).concat([this.renderNewMessage()])}</List>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: any, ownprops: props) => {
  const uid = ownprops.firebase.auth().currentUser.uid;
  const isCpLoaded = isLoaded(state.firestore.ordered.curCp),
    isDiscussionLoaded = isLoaded(state.firestore.ordered.discussion),
    isMessagesLoaded = isLoaded(state.firestore.ordered.messages),
    loaded = isCpLoaded && isDiscussionLoaded && isMessagesLoaded;

  let cp = isCpLoaded ? state.firestore.ordered.curCp[0] : {},
    discussion = isDiscussionLoaded ? state.firestore.ordered.discussion[0] : {},
    messages = isDiscussionLoaded ? state.firestore.ordered.messages : [];

  return {
    cp: cp,
    uid: uid,
    isDiscussionOwner: ownprops.match.params.connectorId === uid,
    discussion,
    messages,
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
            doc: props.match.params.connectorId,
          },
        ],
        storeAs: 'discussion',
      },
      {
        collection: contactPointsCollectionName,
        doc: props.match.params.cpId,
        subcollections: [
          {
            collection: discussionsSubCollectionName,
            doc: props.match.params.connectorId,
            subcollections: [
              {
                collection: messagesSubCollectionName,
                orderBy: ['createDate', 'asc'],
              },
            ],
          },
        ],
        storeAs: 'messages',
      },
    ];
  }),
  withStyles(styles),
)(ContactPointDiscussion);
