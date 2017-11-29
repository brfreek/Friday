import React, { Component } from 'react';
import App from './App';

const axios = require('axios');
var _ = require('lodash');
var _ = require('lodash/core');
var fp = require('lodash/fp');
var array = require('lodash/array');
var object = require('lodash/fp/object');

class Apps extends Component{

    constructor(props){
        super(props);
        this.state = {
            apps: []
        }
        this.setApps = this.setApps.bind(this);
        this.getAppsFromMendix = this.getAppsFromMendix.bind(this);
        this.getApp = this.getApp.bind(this);
    }
    componentWillMount(nextProps, nextState){
        this.getAppsFromMendix();
    }
    getApp(appId){
        if(this.props.userUuid && this.props.jwtToken){
            const serverURL = "http://localhost:3001/api/v1/apps?user=" + this.props.userUuid + "&appId=" + appId;
            axios.get(serverURL, {
                headers: {
                    "x-access-token": this.props.jwtToken
                }
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(JSON.stringify(error));
                this.manageError(error);
            });
        }
    }
    manageError(error){
        var status = error.response.status;
        switch(status){
            case 401:
                this.props.sessionExpired(true);
                break;
            default:
                // console.log(JSON.stringify(error.response.data.message));
                this.props.showError(error.response.data.message);
                break;
        }
    }
    setApps(apps){
        var state = this.state;
        state.apps = apps.sort((a,b) => {return a.Name > b.Name ? 1 : ((b.Name > a.Name) ? -1 : 0)});
        this.setState(state);
    }
    getAppsFromMendix(){
        console.log(this.props.userUuid)
        if(this.props.userUuid && this.props.jwtToken){
            const serverURL = "http://localhost:3001/api/v1/apps?user=" + this.props.userUuid;
            axios.get(serverURL, {
                headers: {
                    'x-access-token' : this.props.jwtToken
                }
            }).then((response) => {
                if(response.data.length > 0){
                    this.setApps(response.data);
                } else {
                    this.setApps([]);
                }
            }).catch((error) => {
                console.log(JSON.stringify(error));
                if(error.response){
                    var status = error.response.status;
                    switch(status){
                        case 401:
                            this.props.sessionExpired(true);
                            break;
                        default:
                            // console.log(JSON.stringify(error.response.data.message));
                            this.props.showError(error.response.data.message);
                            break;
                    }
                } else {
                    this.props.showError(error);
                }
            });
        }
    }
    

    render(){
        const apps = this.state.apps.map(function(item, index){
            return <App appName={item.Name} appUrl={item.Url} appId={item.AppId} key={item.AppId} onAppClick={this.getApp} jwtToken={this.props.jwtToken} userUuid={this.props.userUuid}  />
        }, this);
        return(
            <div>
                {apps}
            </div>
        )
    }
}

export default Apps;