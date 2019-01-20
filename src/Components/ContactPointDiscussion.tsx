import React, { Component } from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import { withFirebase } from 'react-redux-firebase'
import { firestoreConnect } from 'react-redux-firebase'
import List from '@material-ui/core/List';;
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import {match} from 'react-router';
import {contactPoint, discussion} from 'let-me-know-ts-definitions';
import {contactPointsCollectionName, discussionSubCollectionName } from "../firebaseConfig";


const styles = (theme:any) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

interface props {
    match:match<{cpId:string}>;
    cp:contactPoint;
    ownDiscussions: discussion[];
    connectorDiscussions: discussion[];
    uid:string;
    firestore:any;
    firebase:any;
    classes:any;
}

class ContactPointDiscussion extends Component<props>{

    renderDiscussion(discussion:discussion){
        return (
            <ListItem>
                <div>
                    <span>{discussion.title}</span>
                </div>
            </ListItem>
        );
    }
    addDiscussion(){
        const newDiscusstionRef = this.props.firestore.collection(contactPointsCollectionName)
            .doc(this.props.cp.cpId).
            collection(discussionSubCollectionName)
            .doc();
        const newDiscussion:discussion={
            title:"New Discussion",
            discussionId:newDiscusstionRef.id,
            connectorId:this.props.uid,
            createdDate:this.props.firestore.FieldValue.serverTimestamp()
        }
        newDiscusstionRef.set(newDiscussion)
            .then((res:any)=>console.log(res))
            .catch((err:any)=>console.log(err));
    }
    render(){
        return(
            <div>
                <h1>{this.props.cp.name}</h1>
                <List subheader={<ListSubheader component="div">My Contact Points Discussions</ListSubheader>}>
                    {this.props.ownDiscussions.map((d)=>this.renderDiscussion(d))}
                </List>
                <div><button onClick={()=>this.addDiscussion()}>Add Discussion</button></div>
                <List subheader={<ListSubheader component="div">Discussions I Started</ListSubheader>}>
                    {this.props.connectorDiscussions.map((d)=>this.renderDiscussion(d))}
                </List>
            </div>
        );
    }
}

const mapStateToProps = (state:any,ownprops:props) => {
    const uid= ownprops.firebase.auth().currentUser.uid;
    ///debugger;
    let cp  = {},
        ownDiscussions:discussion[]=[],
        connectorDiscussions:discussion[]=[];
    if( state.firestore.ordered.curCp)
        cp=state.firestore.ordered.curCp[0];
    if( state.firestore.ordered.ownDiscussions)
        ownDiscussions=state.firestore.ordered.ownDiscussions;
    if( state.firestore.ordered.connectorDiscussions)
        connectorDiscussions=state.firestore.ordered.connectorDiscussions;
    return {
        cp:cp,
        uid:uid,
        ownDiscussions,
        connectorDiscussions
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
                    subCollections:[
                        {
                            collection:discussionSubCollectionName
                        }
                    ],
                    storeAs: 'ownDiscussions'
                },
                {
                    collection: contactPointsCollectionName,
                    doc:props.match.params.cpId,
                    subCollections:[
                        {
                            collection: discussionSubCollectionName,
                            where: [
                                ['connectorId', '==', uid]
                            ]
                        }
                    ],
                    storeAs: 'connectorDiscussions'
                }
            ]
        }
    ),
    withStyles(styles)
)(ContactPointDiscussion);