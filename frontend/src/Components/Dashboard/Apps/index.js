import React, { Component } from 'react';

const axios = require('axios');

class Apps extends Component{

    shouldComponentUpdate(nextProps, nextState){
        console.log('should app component update?: ' + JSON.stringify(nextProps.params));
        return true;
    }

    constructor(props){
        super(props);
        console.log('apps props: ' + JSON.stringify(props));
        this.getAppsFromMendix = this.getAppsFromMendix.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.props.userUuid !== nextProps.userUuid){
            return true;
        }
        if(this.props.jwtToken !== nextProps.jwtToken){
            return true;
        }
        return false;
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
                console.log("Apps!!!: " + JSON.stringify(response.data));
            }).catch((error) => {
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
        this.getAppsFromMendix();
        console.log('Rendered props: ' + JSON.stringify(this.props));
        return(
            <div>
                
            </div>
        )
    }
}

export default Apps;