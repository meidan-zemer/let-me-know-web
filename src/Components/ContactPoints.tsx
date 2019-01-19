import React, { Component } from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import PopUp from 'reactjs-popup';
import {contactPoint} from 'let-me-know-ts-definitions';
import { withFirebase } from 'react-redux-firebase'
import { firestoreConnect } from 'react-redux-firebase'
import {contactPointsCollectionName} from '../firebaseConfig';
interface compState {
  addContactPointPopup: {
    open: boolean;
    name: string;
    description: string;
  };
}
interface props {
    contactPoints:contactPoint[];
    firestore:any;
    firebase:any;
}
class ContactPoints extends Component<props, compState> {
  constructor(props: any) {
    super(props);
    this.state = {
      addContactPointPopup: {
        open: false,
        name: '',
        description: '',
      }
    };
  }

  setPopup(open:boolean){
      this.setState({ ...this.state, addContactPointPopup: { ...this.state.addContactPointPopup, open: open } });
  }
  addNewContactPoint() {
      let newCpDocRef = this.props.firestore.collection(contactPointsCollectionName).doc();
      let cp:contactPoint = {
          cpId: newCpDocRef.id,
          name:this.state.addContactPointPopup.name,
          description:this.state.addContactPointPopup.description,
          createDate:this.props.firestore.FieldValue.serverTimestamp(),
          modifyDate:this.props.firestore.FieldValue.serverTimestamp(),
          userId: this.props.firebase.auth().currentUser.uid
      };
      newCpDocRef.set(cp)
        .then(()=>{
            this.setPopup(false);
        })
        .catch((err:any)=>{
            console.log(err);
        });
  }
  render() {
    return (
      <div>
        <h1>Contact Points</h1>
          <button onClick={()=>this.setPopup(true)}>Add Contact Point</button>
          {
              this.props.contactPoints ?
              this.props.contactPoints.map((cp:contactPoint) =>
              <div> {cp.name} </div>
              )
                  :
                  null
          }
          <PopUp
          open={this.state.addContactPointPopup.open}
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

const mapStateToProps = (state:any) => {
    return {
        contactPoints: state.firestore.ordered[contactPointsCollectionName] ? state.firestore.ordered[contactPointsCollectionName] : [],
    }
}

const mapDispatchToProps = {}


export default compose(
    withFirebase,
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props:props) => {
            const uid= props.firebase.auth().currentUser.uid;
            if (!uid) return []
            return [
                {
                    collection: contactPointsCollectionName,
                    where: [
                        ['userId', '==', uid]
                    ]
                }
            ]
        }
    )
)(ContactPoints);
