import React from 'react';
import {connect} from "react-redux"
import { 
    View,
} from 'react-native';
import Text from '../../components/AppText'
import CounterpartyList from '../../components/CounterpartyList'
import ActionButton from 'react-native-action-button';

import Style from 'react-native-extended-stylesheet';
import translate from '../../translate';

let mapStateToProps = function(state){
	return {
    }
}

let mapDispatchToProps = function(dispatch){
	return {
	}
}

@connect(mapStateToProps,mapDispatchToProps)
export default class extends React.Component {
    constructor(){
        super();
        this.state = {
        }
    }

    componentDidMount(){

    }

    newCounterparty = async() => {
        this.props.navigation.push("EditCounterparty", {
            type:"new"
        })
    }

    editCounterparty = async(v) => {
        this.props.navigation.push("EditCounterparty", {
            type:"modify",
            name : v.name,
            email : v.email,
            ether : v.ether
        })
    }

	render() {
		return (<View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.title_text}>{translate("COUNTERPARTIES")}</Text>
            </View>

            <CounterpartyList onPressCounterparty={this.editCounterparty} />

            <ActionButton buttonColor='#324b5f' buttonTextStyle={{fontSize:30}} onPress={this.newCounterparty} />
        </View>);
	}
}

const styles = Style.create({
    container : {
        flex:1,
        backgroundColor:"#FFFFFF",
        paddingTop:'$topPadding'
    },
    title:{
        flexDirection:"row",
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20
    },
    title_text:{
        fontSize:25,
        fontFamily:"$fontBold",
    },
    content:{
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10
    },
    form_content:{
        flex:1,
        width:"100%"
    },
})