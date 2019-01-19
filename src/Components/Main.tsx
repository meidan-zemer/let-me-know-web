import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import {User} from "firebase";
import Header from './Header';
import ContactPoints from './ContactPoints';



interface props{
    signOut: ()=>any;
    user: User;
}

class Main extends  Component<props> {
    render(){
        return (
            <BrowserRouter >
                <div>
                    <Header user={this.props.user} signOut={this.props.signOut}/>
                    <Route  path='/' component={ContactPoints}/>
                </div>
            </BrowserRouter >
        );
    }
}

export default Main;