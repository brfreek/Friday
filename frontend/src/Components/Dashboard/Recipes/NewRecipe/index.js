import React, { Component } from 'react';

import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class NewRecipe extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            error: false,
            errorId: 0,
            errorMessage: "",
            recipe: {},
            environments: [],
            appValue: 0,
            typeValue: "SINGLE",
        }

        this.handleTypeValue = this.handleTypeValue.bind(this);
        this.handleAppValueChange = this.handleAppValueChange.bind(this);
    }
    handleTypeValue(event, index, value){
        var state = this.state;
        state.typeValue = value;
        this.setState(state);
    }

    handleAppValueChange(event, index, value){
        var state = this.state;
        state.appValue = value;
        this.setState(state);
    }
    render(){

        var apps = this.props.apps.map((item, index) => {
            return <MenuItem value={item.AppId} primaryText={item.Name} />;
        });

        return(
            <div>
                <Card>
                    <CardTitle title="General" />
                    <CardText>
                        <TextField hintText="Name" /><br />
                        <DropDownMenu value={this.state.typeValue} onChange={this.handleTypeValue}>
                            <MenuItem value="SINGLE" primaryText="Single" />
                            <MenuItem value="LISTENER" primaryText="Listener" />
                            <MenuItem value="SCHEDULED" primaryText="Scheduled" />
                        </DropDownMenu>
                        <DropDownMenu value={this.state.appValue} onChange={this.handleAppValueChange}>
                            {apps}
                        </DropDownMenu>
                    </CardText>
                </Card>
            </div>
        )
    }
}