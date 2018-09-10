import React from 'react';
import {connect} from "react-redux"
import { 
    View,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import Text from './AppText'
import Style from 'react-native-extended-stylesheet';
import TextTicker from 'react-native-text-ticker'

let mapStateToProps = function(state){
	return {
        friends:state.user.friend
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

    pressCounterparty(v) {
        this.props.onPressCounterparty(v)
    }

    friend_slot_render = (o,k) => {
        return <TouchableOpacity key={o.ether+k} onPress={this.pressCounterparty.bind(this, o)}>
            <View style={styles.friend_container}>
                <Image style={styles.counterparty_pic} source={{uri:`https://identicon-api.herokuapp.com/${o.ether}/70?format=png`}}/>
                <View style={styles.counterparty_info}>
                    <Text style={styles.counterparty_info_title}>{o.name}</Text>
                    <Text style={styles.counterparty_info_email}>{o.email}</Text>
                    {/* <Text style={styles.counterparty_info_ether}>{o.ether}</Text> */}
                    <TextTicker
                        style={styles.counterparty_info_ether}
                        duration={3000}
                        loop
                        bounce={false}
                        repeatSpacer={50}
                        marqueeDelay={5000}>
                        {o.ether}
                    </TextTicker>
                </View>
            </View>
        </TouchableOpacity>
    }

	render() {
		return (<ScrollView style={styles.form_content}>
            {this.props.friends.map(this.friend_slot_render)}
        </ScrollView>);
	}
}


const styles = Style.create({
    form_content:{
        flex:1,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10
    },
    friend_container: {
    	flexDirection:"row",
    	alignItems:'center',
    	borderWidth: 1,
    	borderColor: '#eaeaea',
    	borderRadius: 5,
    	marginBottom: 10,
    	paddingHorizontal: 10,
    	paddingVertical: 10,
    },
    counterparty_pic:{
        width:60,
        height:60,
        marginRight: 15
    },
    counterparty_info:{
        flex:1
    },
    counterparty_info_title: {
    	fontSize: 15,
    },
    counterparty_info_email: {
    	fontSize: 10,
        color:"#666",
        marginTop: 5
    },
    counterparty_info_ether: {
    	fontSize: 10,
        color:"#666"
    },
})