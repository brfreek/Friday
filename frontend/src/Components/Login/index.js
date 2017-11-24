import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const axios = require('axios');

class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            open: true,
            username: "",
            password: "",
            error: "",
            usernameError: "",
            passwordError: "",
            disable: false,
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    setUserNameError(error){
        var state = this.state;
        state.usernameError = error;
        this.setState(state);
    }
    setPasswordError(error){
        var state = this.state;
        state.passwordError = error;
        this.setState(state);
    }
    handlePasswordChange(evt, newValue){
        var state = this.state;
        state.passwordError = "";
        state.password = newValue;
        this.setState(state);
    }
    handleUsernameChange(evt, newValue){
        var state = this.state;
        state.usernameError = "";
        state.username = newValue;
        this.setState(state);
    }
    handleLogin(){
        var loginURL = this.props.serverURL + '/auth';
        var state = this.state;
        state.disable = true;
        this.setState(state);

        if(this.state.username === ""){
            var state = this.state;
            state.disable = false;
            this.setState(state);
            return;   
        }
        if(this.state.password === ""){
            var state = this.state;
            state.disable = false;
            this.setState(state);
            return;
        }

        axios.post(loginURL, {
            name: this.state.username,
            password: this.state.password
        })
        .then((response) => {
            if(response.data.token !== ""){
                this.props.updateUser(response.data);
            } else {
                var state = this.state;
                state.error = "Error while logging in";
                this.setState(state);
            }
        })
        .catch((error) => {
            console.log("Error: " + JSON.stringify(error.response));
            var state = this.state;
            state.disable = false;
            this.setState(state);
        });

    }
    render(){
        const actions = [
            <FlatButton label="Login"
                primary={true}
                onClick={this.handleLogin}
                keyboardFocused={true}
                />
        ];

        return(
            <Dialog 
                title="Login"
                actions={actions}
                modal={true}
                open={this.state.open}>
                <TextField 
                    hintText="Mendix Email"
                    floatingLabelText="Username"
                    onChange={this.handleUsernameChange}
                    errorText={this.state.usernameError}
                    disabled={this.state.disable} /> 
                    <br />
                <TextField
                    hintText="Your password"
                    floatingLabelText="Password"
                    type="password"
                    onChange={this.handlePasswordChange}
                    errorText={this.state.passwordError}
                    disabled={this.state.disable} />
            </Dialog>
        )
    }
}

export default Login;