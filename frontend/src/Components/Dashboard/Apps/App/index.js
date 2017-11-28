import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class App extends Component{

    constructor(props){
        super(props);

        this.state = {
            hover: false,
            selected: false
        }
    }

    render(){
        const style={
            margin: '10px'
        }
        return (
            <Card style={style}>
                <CardHeader
                    title={this.props.appName}
                    subtitle={this.props.appUrl}
                    />
            </Card>
        )
    }
}