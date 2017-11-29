import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import {red500, green400, grey500} from 'material-ui/styles/colors';



const axios = require('axios');

export default class App extends Component{

    constructor(props){
        super(props);

        this.state = {
            hover: false,
            selected: false,
            environments: []
        }
        this.clickCard = this.clickCard.bind(this);
    }

    componentDidMount(){
        var environments = this.getEnvironmentStatus();
        if(environments){
            environments.then((result) => {
                console.log(JSON.stringify(result));
                var state = this.state;
                state.environments = result;
                this.setState(state);
            }).catch((error) => {
                console.log('not able to get environments');
            });
        }
    }

    getEnvironmentStatus(){
        if(this.props.jwtToken && this.props.userUuid){
            return new Promise((resolve, reject) => {
                const serverURL = "http://localhost:3001/api/v1/apps/environments?user=" + this.props.userUuid + "&appId=" + this.props.appId;
                axios.get(serverURL, {
                    headers: {
                        "x-access-token": this.props.jwtToken
                    }
                }).then((response) => {
                   resolve(response.data);
                }).catch((error) => {
                    console.log(JSON.stringify(error));
                    reject(error);
                });
            });
        } else {
            return null;
        }
    }

    clickCard(){
        this.props.onAppClick(this.props.appId);
    }
    openUrl(){

    }
    render(){
        const style={
            margin: '10px'
        }
        const contentStyle = {
            display: 'flex',
            flexDirection: 'row',
        }
        const chipStyle = {
            margin: '5px',
            color: '#ffffff'
        }
        const environments = this.state.environments.map((item, index) => {
            const color = item.Status === "Running" ? green400 : item.status === "Stopped" ? red500 : item.status === "Empty" ? grey500 : grey500;
            return (<Chip onClick={this.openUrl} backgroundColor={color} style={chipStyle}><span style={{color: '#fff'}}>{item.Mode}</span></Chip>)
        }, this);
        return (
            <Card style={style} onClick={this.clickCard}>
                <CardHeader
                    title={this.props.appName}
                    subtitle={this.props.appUrl}
                    />
                <CardText style={contentStyle}>
                    {environments}
                </CardText>
            </Card>
        )
    }
}