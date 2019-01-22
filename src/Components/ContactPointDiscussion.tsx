import React, { Component } from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import { firestoreConnect ,withFirebase ,isLoaded, isEmpty} from 'react-redux-firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import {match} from 'react-router';
import {contactPoint, discussion, message} from 'let-me-know-ts-definitions';
import {contactPointsCollectionName, discussionsSubCollectionName,messagesSubCollectionName } from "../firebaseConfig";

const styles = (theme:any) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

interface props {
    match:match<{cpId:string}>;
    cp:contactPoint,
    uid:string,
    discussion:discussion,
    messages:message[],
    loaded:boolean,
    firestore:any;
    firebase:any;
    classes:any;
}

interface state {
    newMessageContent:string;
}

class ContactPointDiscussion extends Component<props,state>{

    constructor(props:props) {
        super(props);
        this.state={newMessageContent:""};
    }


    renderMessage(msg:message, index:number){
        return (
            <ListItem key={index}>
                <div>
                    <span>{msg.createDate}:</span>
                    <span>{this.getMessageSenderAlias(msg.from)}:</span>
                    <span>{msg.content}</span>
                </div>
            </ListItem>
        );
    }

    addDiscussion(){
        let desc:discussion ={
            connectorId:this.props.uid,
            connectorAlias:"John Due",
            title:this.props.cp.name,
            modifiedDate: this.props.firestore.FieldValue.serverTimestamp(),
            createdDate: this.props.firestore.FieldValue.serverTimestamp()
        };
        const newdiscussionDocRef  = this.props.firestore.collection().doc(`${contactPointsCollectionName}/${this.props.cp.cpId}`).doc(this.props.uid);
        newdiscussionDocRef.set(desc);
    }

    getMessageSenderAlias(uid:string){
        if(uid === this.props.uid){
            return this.props.firebase.auth().currentUser.displayName;
        } else {
            if(uid === this.props.discussion.connectorId){
                if( this.props.discussion.connectorAlias){
                    return this.props.discussion.connectorAlias;
                } else {
                    return this.props.cp.ownerAlias;
                }
            }
        }
    }

    sendMessage(){
        const msg:message = {
            createDate:this.props.firestore.FieldValue.serverTimestamp(),
            content: this.state.newMessageContent,
            from:this.props.uid
        };
        this.props.firestore.add({ collection:contactPointsCollectionName,
                                    doc:this.props.cp.cpId,
                                    subcolection:{
                                        collection:discussionsSubCollectionName,
                                        doc:this.props.discussion.connectorId,
                                        subcolection: {
                                            collection:messagesSubCollectionName
                                        }
                                    }
                                }
                                ,msg)
            .then(()=>{
                console.log("Added message");
            })
            .catch((err:any)=>{
                console.log(err);
            })
    }
    render(){
        if(!this.props.loaded){
            return (<div>Loading...</div>);
        } else if(isEmpty(this.props.discussion)){
                this.addDiscussion();
                return (<div>Loading...</div>);
        } else {
            return(
                <div>
                    <h1>{this.props.discussion.title}</h1>
                    <List>
                        {this.props.messages.map((m,i)=>this.renderMessage(m,i))}
                    </List>
                    <div>
                        <input type="text"
                               value={this.state.newMessageContent}
                               onChange={e => this.setState({newMessageContent:e.target.value})}/>
                        <button onClick={()=>this.sendMessage()}>Send</button>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state:any,ownprops:props) => {
    const uid= ownprops.firebase.auth().currentUser.uid;
    const isCpLoaded= isLoaded(state.firestore.ordered.curCp),
          isDiscussionLoaded= isLoaded(state.firestore.ordered.discussion),
          isMessagesLoaded= isLoaded(state.firestore.ordered.messages),
          loaded = isCpLoaded && isDiscussionLoaded && isMessagesLoaded;

    let cp  = isCpLoaded ? state.firestore.ordered.curCp[0]  : {},
        discussion = isDiscussionLoaded ?  state.firestore.ordered.discussion[0] : {},
        messages = isDiscussionLoaded ?  state.firestore.ordered.messages : [];

    return {
        cp:cp,
        uid:uid,
        discussion,
        messages,
        loaded
    }
};

const mapDispatchToProps = {};

export default compose(
    withFirebase,
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props:props) => {
        const uid= props.firebase.auth().currentUser.uid;
        if (!uid) return [];
            return [
                {
                    collection: contactPointsCollectionName,
                    doc:props.match.params.cpId,
                    storeAs: 'curCp'
                },
                {
                    collection: contactPointsCollectionName,
                    doc:props.match.params.cpId,
                    subcollections:[
                        {
                            collection:discussionsSubCollectionName,
                            doc:props.uid
                        }
                    ],
                    storeAs: 'discussion'
                },
                {
                    collection: contactPointsCollectionName,
                    doc:props.match.params.cpId,
                    subcollections:[
                        {
                            collection:discussionsSubCollectionName,
                            doc:props.uid,
                            subcollections:{
                                collection:messagesSubCollectionName,
                                orderBy:['createDate','desc']

                            }
                        },
                    ],
                    storeAs: 'messages'
                }

            ]
        }
    ),
    withStyles(styles)
)(ContactPointDiscussion);