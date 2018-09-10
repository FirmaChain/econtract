import React from 'react';
import {connect} from "react-redux"
import { 
    View,
    TouchableOpacity
} from 'react-native';
import Text from '../../components/AppText'
import CounterpartyList from '../../components/CounterpartyList'
import Style from 'react-native-extended-stylesheet';
import Icon from 'react-native-ionicons'
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

    onSelectCounterparty = async(v) => {
        let callback = this.props.navigation.getParam("onCallback")
        if(callback && callback(v)){
            this.props.navigation.pop()
        }
    }

	render() {
		return (<View style={styles.container}>
            <View style={styles.title}>
                <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                    <Icon style={styles.top_left} name="arrow-round-back" />
                </TouchableOpacity>
                <Text style={styles.spacer} />
                <Text style={styles.title_text}>{translate("SELECT_COUNTERPARTY")}</Text>
                <Text style={styles.spacer} />
                <Text style={styles.top_right} />
            </View>
            

            <CounterpartyList onPressCounterparty={this.onSelectCounterparty} />
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
        fontFamily:"$fontBold"
    },
    top_left:{
        paddingTop:10,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10,
    },
    top_right:{
        width: 20
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