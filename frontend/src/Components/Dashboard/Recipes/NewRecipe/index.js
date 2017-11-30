import React, { Component } from 'react';

export default class NewRecipe extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            error: false,
            errorId: 0,
            errorMessage: "",
            recipe: {},
            environments: []
        }
    }

    render(){

        return(
            <div>
                
            </div>
        )
    }
}