import React, { Component } from 'react';

import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import {
    Step,
    Stepper,
    StepLabel
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';

export default class NewRecipe extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            error: false,
            errorId: 0,
            errorMessage: "",
            recipe: {},
            environments: [],
            appValue: -1,
            typeValue: -1,
            steps: {
                stepIndex: 0,
                finished: false
            }
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

    getStepContent(stepIndex){
        switch(stepIndex){
            case 0:
                var apps = this.props.apps.map((item, index) => {
                    return <MenuItem value={item.AppId} primaryText={item.Name} />;
                });
                apps.push(<MenuItem value={-1} primaryText="Select an app" />);
                return(
                    <div>
                        <CardTitle title="General" />
                        <CardText>
                            <TextField hintText="Name" /><br />
                            <DropDownMenu value={this.state.typeValue} onChange={this.handleTypeValue}>
                                <MenuItem value={-1} primaryText="Select Type" />
                                <MenuItem value="SINGLE" primaryText="Single" />
                                <MenuItem value="LISTENER" primaryText="Listener" />
                                <MenuItem value="SCHEDULED" primaryText="Scheduled" />
                            </DropDownMenu>
                            <DropDownMenu value={this.state.appValue} onChange={this.handleAppValueChange}>
                                {apps}
                            </DropDownMenu>
                        </CardText>
                    </div>
                );
                break;
        }
    }

    handleNext(){
        //Increment state step with 1 if it is not 3
    }
    handlePrev(){
        //Decrement state step with 1 if it is not 0
    }

    render(){

        const {finished, stepIndex} = this.state.steps;
        
        var style = {
            containerStyle : {
                width: '100%',
            },
            contentStyle: {
                margin: '0 16px'
            }
        }
        return(
            <div style={style.containerStyle}>
                <Card>
                    <Stepper activeStep={stepIndex}>
                        <Step>
                            <StepLabel>Whats for recipe are you making?</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>To which apps will it be deployed?</StepLabel>
                        </Step>
                    </Stepper>

                    <div style={style.contentStyle}>
                        {this.getStepContent(stepIndex)}
                        <div style={{marginTop: 12, display: 'flex', flexDirection: 'row'}}>
                            <FlatButton
                                label="Back"
                                disabled={stepIndex === 0}
                                onClick={this.handlePrev}
                                style={{marginRight: 12}}
                                />
                            <RaisedButton
                                label={ stepIndex === 2 ? "Finish" : "Next"}
                                primary={true}
                                onClick={this.handleNext}
                                />
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}


// </Card>
// <Card style={style.cardStyle}>
// <CardTitle title="Select environments" subtitle="Select which environments of which apps will be included in this recipe" />
// <CardText>

// </CardText> */}