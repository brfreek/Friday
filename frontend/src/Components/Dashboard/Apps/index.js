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
    }
    componentWillMount(nextProps, nextState){
        this.getAppsFromMendix();
    }
    setApps(apps){
        var state = this.state;
        state.apps = apps;
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
                            this.props.showError("Something went wrong!");
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
            return <App appName={item.Name} appUrl={item.Url} appId={item.AppId} key={item.AppId}/>
        });
        return(
            <div>
                {apps}
            </div>
        )
    }
}

export default Apps;