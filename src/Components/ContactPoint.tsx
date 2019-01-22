import React, { Component } from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import { withFirebase ,isLoaded, firestoreConnect  } from 'react-redux-firebase'
import List from '@material-ui/core/List';;
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import {match, Redirect } from 'react-router';
import {contactPoint, discussion} from 'let-me-know-ts-definitions';
import {contactPointsCollectionName, discussionsSubCollectionName } from "../firebaseConfig";

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
    allDiscussions: discussion[];
    uid:string;
    loaded:boolean;
    firestore:any;
    firebase:any;
    classes:any;
}

class ContactPoint extends Component<props>{

    renderDiscussion(dsc:discussion, index:number){
        return (
            <ListItem key={index}>
                <div>
                    <span>{dsc.title}</span>
                </div>
            </ListItem>
        );
    }
    addDiscussion(){
        const newDiscusstionRef = this.props.firestore.collection(contactPointsCollectionName)
            .doc(this.props.cp.cpId).
            collection(discussionsSubCollectionName)
            .doc(this.props.uid);
        const newDiscussion:discussion={
            title:"",
            connectorId:this.props.uid,
            createdDate:this.props.firestore.FieldValue.serverTimestamp(),
            modifiedDate:this.props.firestore.FieldValue.serverTimestamp(),
            connectorAlias: ""
        };
        newDiscusstionRef.set(newDiscussion)
            .then((res:any)=>console.log(res))
            .catch((err:any)=>console.log(err));
    }
    render(){
        if(!this.props.loaded){
            return (<div>Loading...</div>);
        } else if(this.props.cp.userId != this.props.uid) {
            return (
                <Redirect to={`/ContactPoint/${this.props.cp.cpId}/${this.props.uid}`}/>
            );
        } else
            return(
                <div>
                    <h1>{this.props.cp.name}</h1>
                    <List subheader={<ListSubheader component="div">My Contact Points Discussions</ListSubheader>}>
                        {this.props.allDiscussions.map((d,i)=>this.renderDiscussion(d,i))}
                    </List>
                    <div><button onClick={()=>this.addDiscussion()}>Add Discussion</button></div>
                </div>
            );
    }
}

const mapStateToProps = (state:any,ownprops:props) => {
    const uid= ownprops.firebase.auth().currentUser.uid;
    const loaded = isLoaded(state.firestore.ordered.curCp) && isLoaded(state.firestore.ordered.allDiscussions)
    let cp:contactPoint  = isLoaded(state.firestore.ordered.curCp) ? state.firestore.ordered.curCp[0] : {},
        allDiscussions:discussion[] = state.firestore.ordered.allDiscussions;

    return {
        cp:cp,
        uid:uid,
        allDiscussions,
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
                            collection:discussionsSubCollectionName
                        }
                    ],
                    storeAs: 'allDiscussions'
                }
            ]
        }
    ),
    withStyles(styles)
)(ContactPoint);