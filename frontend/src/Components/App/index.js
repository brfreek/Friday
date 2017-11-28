
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
      user: localUuid,
      userName: '',
      sessionExpired: false,
    }

    this.updateUser = this.updateUser.bind(this);
    this.logout = this.logout.bind(this);
  }

  updateUser(user){
    var state = this.state;
    state.jwtToken = user.token;
    state.userName = user.name;
    state.user = user.uuid;
    this.setState(state);
    localStorage.setItem('friday-jwt-token',  user.token);
    localStorage.setItem('friday-user-uuid', user.uuid);
  }
  
  logout(expired){
    var state = this.state;
    state.jwtToken = "";
    state.userName = "";
    state.user = "";
    state.expired = expired;
    this.setState(state);
    localStorage.setItem('friday-jwt-token', null);
    localStorage.setItem('friday-user-uuid', null);    
  }
  render() {
    const serverURL = "http://localhost:3001/api/v1";
    if(!this.state.jwtToken || this.state.jwtToken === "" || !this.state.user || this.state.user === ""){
      return (
        <MuiThemeProvider>
          <Login serverURL={serverURL} updateUser={this.updateUser} expired={this.state.sessionExpired}/>
        </MuiThemeProvider>
      );  
    } else {
      return(
        <MuiThemeProvider>
          <Dashboard token={this.state.jwtToken} userUuid={this.state.user} userName={this.state.userName} logout={this.logout}/>
        </MuiThemeProvider>
      )
    }
    
  }
}

export default App;
