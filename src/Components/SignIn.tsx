import React, { Component } from 'react';


interface  props {
    signInWithGoogle:()=>Promise<any>;
}
class SignIn extends Component<props>{
    render(){
        return (
            <div>
                <h1>Let Me Know</h1>
                <p> Please sign in using you google account</p>
                <button onClick={()=>this.props.signInWithGoogle()}>Sign In</button>
            </div>
        );
    }
}
export default SignIn;