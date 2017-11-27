import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

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
            showMenu: false
        }
        this.showMenu = this.showMenu.bind(this);
        this.leftButtonTap = this.leftButtonTap.bind(this);
    }

    showMenu(){
        var state = this.state;
        state.showMenu = !state.showMenu;
        this.setState(state);
    }
    leftButtonTap(){
        this.showMenu();
    }
    render(){

        const menuStyle = {
            display: 'inline-block',
            margin: '16px 32px 16px 0',
            position: 'absolute'
          };
        return(
            <HashRouter>
                <div >
                    <AppBar title={'Friday'}
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
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
                        <Route exact path="/" component={Main} jwtToken={this.props.token} userUuid={this.props.userUuid} />
                        <Route path="/apps" component={Apps} jwtToken={this.props.token} userUuid={this.props.userUuid} />
                        <Route path="/recipes" component={Recipes} jwtToken={this.props.token} userUuid={this.props.userUuid} />
                        <Route path="/deployments" component={Deployments} jwtToken={this.props.token} userUuid={this.props.userUuid} />
                        {this.props.children}
                    </div>
                </div>
            </HashRouter>
        )
    }
}

export default Dashboard;