import React, { Component } from 'react';

const axios = require('axios');

class Apps extends Component{

    shouldComponentUpdate(nextProps, nextState){
        console.log('should app component update?')
        return true;
    }
    
    getAppsFromMendix(){
        const serverURL = "http://localhost:3001/api/v1/apps?user=" + this.props.userUuid;
        axios.get(serverURL, {
            headers: {
                'x-access-token' : this.props.jwtToken
            }
        }).then((response) => {
            console.log("Apps!!!: " + JSON.stringify(response.data));
        }).catch((error) => {
            console.log('Error: ' + error);
        });
    }

    render(){
        this.getAppsFromMendix();
        return(
            <div>
                
            </div>
        )
    }
}

export default Apps;