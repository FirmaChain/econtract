import {connect} from "react-redux"
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
export default class Tab2 extends React.Component {
    componentDidMount(){
        setInterval(()=>{
            this.props.TestAction()
            this.props.AjaxTestAction()
        },2000)
    }

	render() {
		return (
			<View style={{
                justifyContent:"center",
                alignItems:"center",
                flex:1
            }}>
				<Text>==Tab2===={this.props.test.v?"1":"0"}=={this.props.test.c?"1":"0"}====</Text>
			</View>
		);
	}
}
