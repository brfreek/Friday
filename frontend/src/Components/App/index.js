
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';

import Login from '../Login';
import Dashboard from '../Dashboard';

const axios = require('axios');

class App extends Component {
  constructor(){
    super();
    var localToken = localStorage.getItem('friday-jwt-token');
    var localUuid = localStorage.getItem('friday-user-uuid');
    this.state = {
      jwtToken: localToken,
      user: localUuid
    }

    this.updateUser = this.updateUser.bind(this);
  }


  updateUser(user){
    var state = this.state;
    state.jwtToken = user.token;
    state.userName = user.name;
    state.userUuid = user.uuid;
    this.setState(state);
    localStorage.setItem('friday-jwt-token',  user.token);
    localStorage.setItem('friday-user-uuid', user.uuid);
  }
  
  render() {
    const serverURL = "http://localhost:3001/api/v1";
    if(!this.state.jwtToken || this.state.jwtToken === "" || !this.state.user || this.state.user === ""){
      return (
        <MuiThemeProvider>
          <Login serverURL={serverURL} updateUser={this.updateUser}/>
        </MuiThemeProvider>
      );  
    } else {
      return(
        <MuiThemeProvider>
          <Dashboard token={this.state.jwtToken} userUuid={this.state.userUuid} userName={this.state.userName}/>
        </MuiThemeProvider>
      )
    }
    
  }
}

export default App;
