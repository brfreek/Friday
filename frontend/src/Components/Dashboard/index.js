import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import Main from './Main';
import Apps from './Apps';
import Recipes from './Recipes';
import Deployments from './Deployments';

import {
    Route,
    NavLink,
    HashRouter
} from 'react-router-dom';

class Dashboard extends Component{
    constructor(props){
        super(props);

        this.state = {
            showMenu: false,
            error: false,
            errorMessage: ''
        }
        this.showMenu = this.showMenu.bind(this);
        this.leftButtonTap = this.leftButtonTap.bind(this);
        this.showError = this.showError.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    showMenu(){
        var state = this.state;
        state.showMenu = !state.showMenu;
        this.setState(state);
    }
    leftButtonTap(){
        this.showMenu();
    }
    showError(message){
        var state = this.state;
        state.error = true;
        state.errorMessage = message;
        this.setState(state);
    }
    closeDialog(){
        var state = this.state;
        state.error = false;
        state.errorMessage = "";
        this.setState(state);
    }
    render(){

        const menuStyle = {
            display: 'inline-block',
            margin: '16px 32px 16px 0',
            position: 'absolute'
          };
        const AppComponent = (props) => {
            return(
                <Apps  {...props} jwtToken={this.props.token} userUuid={this.props.userUuid} sessionExpired={this.props.logout} showError={this.showError} />
            )
        };

        const actions = [
            <FlatButton label="OK"
                primary={true}
                onClick={this.closeDialog} />
        ]
        const message = <Dialog  
                            actions={actions}
                            modal={false}
                            open={this.state.error}
                            onRequestClose={this.closeDialog}/>;

        console.log('Dashboard props: ' + JSON.stringify(this.props));
        return(
            <HashRouter>
                <div >
                    <AppBar title={'Friday'}
                        iconElementRight={<FlatButton label="Logout" onClick={this.props.logout} />}                            
                        onLeftIconButtonTouchTap={this.leftButtonTap} />
                    {this.state.showMenu ? 
                    <Paper style={menuStyle}>
                        <Menu>
                            <NavLink exact to="/"><MenuItem onClick={this.showMenu} >Dashboard</MenuItem></NavLink>
                            <NavLink to="/apps"><MenuItem onClick={this.showMenu} >Apps</MenuItem></NavLink>
                            <NavLink to="/recipes"><MenuItem onClick={this.showMenu} >Recipes</MenuItem></NavLink>
                            <NavLink to="/deployments"><MenuItem onClick={this.showMenu}>Deployments</MenuItem></NavLink>
                        </Menu>
                    </Paper>
                    : null}
                    <div className={'content'}>
                        {this.state.error ? message : null}

                        <Route exact path="/" component={Main}  />
                        <Route path="/apps" render={AppComponent} />
                        <Route path="/recipes" render={(props) => (
                            <Recipes {...props} jwtToken={this.props.jwtToken} userUuid={this.props.userUuid} />
                        )} />
                        <Route path="/deployments" render={(props) => (
                            <Deployments {...props} jwtToken={this.props.jwtToken} userUuid={this.props.userUuid} />
                        )} />
                    </div>
                </div>
            </HashRouter>
        )
    }
}

export default Dashboard;