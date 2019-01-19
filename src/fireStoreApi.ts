import fireBase from './firebaseConfig';


const db = fireBase.firestore();
const user = fireBase.auth().currentUser;
const uid = user ? user.uid : null;

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});

export function addContactPoint(name:string, deescription:string){
    db.collection("LetMeKnow").add({
        uid:uid,
        name:name,
        description:deescription
    }).then(()=>{

    })
}