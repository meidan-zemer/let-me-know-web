import React, { Component,CSSProperties } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import GoogleButton from 'react-google-button';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import LmkButton from '../UiComponents/LmkButton'
import LmkTextField from '../UiComponents/LmkTextField';


interface props {
  firebase: {
    login: (arg: any) => any;
    logout: () => any;
    auth: () => any;
  };
}

interface state {
  signIn: {
    email: string;
    password: string;
    err: string | null;
  };
  signUp: {
    email: string;
    password: string;
    err: string | null;
  };
  isSigninInProgress: boolean;
}

class SignIn extends Component<props, state> {

  constructor(props:props){
      super(props);
    this.state = {
      signIn: {
        password: '',
        email: '',
        err: null,
      },
      signUp: {
        password: '',
        email: '',
        err: null,
      },
      isSigninInProgress: false,
    };
  }

  googleSignIn() {
    this.props.firebase.login({ provider: 'google', type: 'popup' });
  }
  signIn() {
    const email = this.state.signIn.email;
    const password = this.state.signIn.password;
    this.setState({ ...this.state, signIn: { ...this.state.signIn, err: null }, isSigninInProgress: true });
    this.props.firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.setState({ isSigninInProgress: false }))
        .catch((err: any) => {
          this.setState({ ...this.state, signIn: { ...this.state.signIn, err: err.message }, isSigninInProgress: false });
        });
  }
  signUp() {
    const email = this.state.signUp.email;
    const password = this.state.signUp.password;
    this.setState({ ...this.state, signUp: { ...this.state.signUp, err: null }, isSigninInProgress: true });
    this.props.firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() =>
            this.setState({
              ...this.state,
              signIn: { ...this.state.signIn, email: email, password: password },
              isSigninInProgress: false,
            }),
        )
        .catch((err: any) => {
          this.setState({ ...this.state, signUp: { ...this.state.signUp, err: err.message }, isSigninInProgress: false });
        });
  }
  render() {
    return (
      <div style={styles.container}>
        <h1>Let Me Know</h1>
        <div>
          <h3>{"Sign In"}</h3>
          <div style={styles.iconTextContainer}>
              <span style={styles.iconContainer}><EmailIcon/></span>
              <LmkTextField placeholder={'E-mail'}
                                   value={this.state.signIn.email}
                                   onTextChange={t=>this.setState({signIn:{...this.state.signIn,email:t}})}
              />
          </div>
          <div style={styles.iconTextContainer}>
            <span style={styles.iconContainer}><LockIcon/></span>
            <LmkTextField placeholder={'Password'}
                                     value={this.state.signIn.password}
                                     onTextChange={t=>this.setState({signIn:{...this.state.signIn,password:t}})}
                                     type={'password'}

            />
          </div>
          <div style={{marginTop: '5%',width:'100%'}}>
            <LmkButton onClick={()=>this.signIn()}>{'Sign In'}</LmkButton>
          </div>
        </div>
        <div>
          <h3>{"Sign Up"}</h3>
          <div style={styles.iconTextContainer}>
            <span style={styles.iconContainer}><EmailIcon/></span>
            <LmkTextField placeholder={'E-mail'}
                          value={this.state.signUp.email}
                          onTextChange={t=>this.setState({signUp:{...this.state.signUp,email:t}})}
            />
          </div>
          <div style={styles.iconTextContainer}>
            <span style={styles.iconContainer}><LockIcon/></span>
            <LmkTextField placeholder={'Password'}
                          value={this.state.signUp.password}
                          onTextChange={t=>this.setState({signUp:{...this.state.signUp,password:t}})}
                          type={'password'}

            />
          </div>
          <div style={{marginTop: '5%',width:'100%'}}>
            <LmkButton onClick={()=>this.signUp()}>{'Sign Up'}</LmkButton>
          </div>
        </div>
        <div style={{marginTop:'5%', marginBottom:'5%'}}>
          <GoogleButton onClick={() => this.googleSignIn()} />
        </div>
      </div>
    );
  }
}


const styles = {
  container:{
    display: 'flex',
    flexDirection:'column' as CSSProperties["flexDirection"],
    alignItems: 'center',
    border: 'dashed',
    width: '400px',
    margin: '0 auto',
    borderColor: 'gray'
  },
  iconTextContainer:{
    display: 'flex',
    flexDirection:'row' as CSSProperties["flexDirection"],
    alignItems: 'center'

  },
  iconContainer:{
    marginRight:'4%',
    marginTop:'9%'
  }
};
export default compose(
  withFirebase,
  connect(),
)(SignIn);
