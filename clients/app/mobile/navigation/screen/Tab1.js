import {connect} from "react-redux"
import React from 'react';
import { Text, View, ListView } from 'react-native';

let mapStateToProps = function(state){
	return {
        ...state
    }
}

let mapDispatchToProps = function(dispatch){
	return {
	}
}

@connect(mapStateToProps,mapDispatchToProps)
export default class Tab1 extends React.Component {
    constructor(){
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let v = []
        for(let i=0;i<9999;i++)
            v.push("aa"+Math.floor(Math.random()*1000))

        this.state = {
            dataSource: ds.cloneWithRows(v),
        };
    }

    componentDidMount(){
        // codePush.sync({
        //     updateDialog: false,
        //     installMode: codePush.InstallMode.IMMEDIATE
        // });
    }

	render() {
		return (
			<View style={{
                flex:1
            }}>
                <Text>!@#!@#!@#!@#!@#!@</Text>
                <ListView
                    style={{}}
                    dataSource={this.state.dataSource}
                    renderRow={(data) => <View><Text>{data}</Text></View>}
                />
			</View>
		);
	}
}
