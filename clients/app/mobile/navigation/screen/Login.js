import {connect} from "react-redux"
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as action from "../../../common/actions/test"

let mapStateToProps = function(state){
	return {
        ...state
    }
}

let mapDispatchToProps = function(dispatch){
	return {
        AjaxTestAction : ()=>{ dispatch(action.AjaxTestAction()) } ,
        TestAction :  ()=>{ dispatch(action.TestAction()) } 
	}
}

@connect(mapStateToProps,mapDispatchToProps)
export default class Login extends React.Component {
    componentDidMount(){
    }

	render() {
		return (
			<View style={{
                justifyContent:"center",
                alignItems:"center",
                flex:1
            }}>
				<Text>=LOGIN!====={this.props.test.v?"1":"0"}=={this.props.test.c?"1":"0"}====</Text>
			</View>
		);
	}
}
