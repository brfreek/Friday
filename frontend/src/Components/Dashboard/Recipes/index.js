import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

const axios = require('axios');

class Recipes extends Component {

    constructor(props){
        super(props);

        this.state = {
            viewValue: 1,
            createNew: false
        }

        this.changeRecipeView = this.changeRecipeView.bind(this);
    }

    getRecipes(){

    }

    changeRecipeView(event, index, value){
        var state = this.state;
        state.viewValue = value;
        this.setState(state);
    }

    createRecipe(){
        var state = this.state;
        state.createNew = !state.createNew;
        this.setState(state);
    }

    render() {

        return(
            <div>
                <Toolbar> 
                    <ToolbarGroup firstChild={true}>
                        <DropDownMenu value={this.state.viewValue} onChange={this.changeRecipeView}>
                            <MenuItem value={1} primaryText="All recipes" />
                            <MenuItem value={2} primaryText="My Recipes" />
                        </DropDownMenu>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <RaisedButton label={this.state} primary={true} onClick={this.createRecipe}/>
                    </ToolbarGroup>
                </Toolbar>
                <div className={'recipes-content'} style={{marginTop: '20px'}}>
                    {this.state.createNew ? 
                        <div>
                        new
                        </div>            
                    : 
                        <div>
                        old
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Recipes;