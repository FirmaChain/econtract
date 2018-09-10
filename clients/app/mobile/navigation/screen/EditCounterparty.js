import React from 'react';
import {connect} from "react-redux"
import { 
    Alert, 
    Button, 
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Text from '../../components/AppText'
import TextInput from '../../components/AppTextInput'
import Icon from 'react-native-ionicons'
import Web3 from "../../../common/Web3"
import Style from 'react-native-extended-stylesheet';
import translate from "../../../common/translate"

import {
    SaveCounterparty,
    ModifyCounterparty
} from "../../../common/actions"

let mapStateToProps = function(state){
    return {
        friends:state.user.friend
    }
}

let mapDispatchToProps = function(dispatch){
    return {
        SaveCounterparty: (v)=>dispatch(SaveCounterparty(v)),
        ModifyCounterparty: (v, w)=>dispatch(ModifyCounterparty(v, w))
    }
}

@connect(mapStateToProps,mapDispatchToProps)
export default class extends React.Component {
    constructor(){
        super();
        this.state = {
        };
    }

    componentDidMount(){

        if(this.props.navigation.getParam("type") == "modify") {
            this.setState({
                name_value : this.props.navigation.getParam("name"),
                address_value : this.props.navigation.getParam("email"),
                ether_value : this.props.navigation.getParam("ether")
            })
        }
    }

    componentWillUnmount(){
    }

    async validCheck() {
        if(!this.state.name_value){
            await window.alert( "APP_TITLE", "NEED_COUNTERPARTY_NAME")
            return false;
        }

        if(!this.state.address_value){
            await window.alert( "APP_TITLE", "NEED_COUNTERPARTY_EMAIL")
            return false;
        }

        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.address_value)){
            await window.alert( "APP_TITLE", "WRONG_EMAIL_TYPE")
            return false;
        }

        if(!this.state.ether_value || this.state.ether_value == ""){
            await window.alert( "APP_TITLE", "NEED_ETHER_ADDRESS")
            return false;
        }

        if(!Web3.isValidWallet(this.state.ether_value)){
            await window.alert( "APP_TITLE", "INVALID_ETHEREUM")
            return false;
        }

        let accounts = Web3.allAccounts()
        for(let a of accounts){
            if(a.address.toLowerCase() == this.state.ether_value.toLowerCase()){
                await window.alert( "APP_TITLE", "CANNOT_ADD_ME_COUNTERPARTY")
                return false;
            }
        }

        return true
    }

    onAdd = async ()=>{

        if(!(await this.validCheck()))
            return false

        let name = this.state.name_value
        let email = this.state.address_value
        let ether = this.state.ether_value
        console.log(this.props.friends, ether)
        if(this.props.friends.find((i)=>i.ether.toLowerCase() == ether.toLowerCase())) {
            return await window.alert( "APP_TITLE", "ALREADY_ADDED_COUNTERPARTY")
        }

        this.props.SaveCounterparty({
            name,
            email,
            ether
        })
        this.props.navigation.goBack()
    }

    onModify = async ()=> {
        if(!(await this.validCheck()))
            return false

        let name = this.state.name_value
        let email = this.state.address_value
        let ether = this.state.ether_value

        this.props.ModifyCounterparty({
            name:this.props.navigation.getParam("name"),
            email:this.props.navigation.getParam("email"),
            ether:this.props.navigation.getParam("ether")
        }, {name, email, ether})

        this.props.navigation.goBack()
    }

    render_bottom() {
        let type = this.props.navigation.getParam("type")

        if(type == "new") {
            return (<TouchableOpacity onPress={this.onAdd} style={window.isIphoneX() ? styles.long_bottom_button : styles.bottom_button}>
                <Text style={styles.bottom_button_text}>{translate("ADD")}</Text>
            </TouchableOpacity>)
        } else if(type == "modify") {
            return (<TouchableOpacity onPress={this.onModify} style={window.isIphoneX() ? styles.long_bottom_button : styles.bottom_button}>
                <Text style={styles.bottom_button_text}>{translate("MODIFY")}</Text>
            </TouchableOpacity>)
        }
    }
 
    render() {
        let type = this.props.navigation.getParam("type")

        let title = ""
        let desc = ""
        switch(type) {
            case "new":
                title = translate("ADD_COUNTERPARTY_TITLE")
                desc = translate("ADD_COUNTERPARTY_DESC")
                break;
            case "modify":
                title = translate("MODIFY_COUNTERPARTY_TITLE")
                desc = translate("MODIFY_COUNTERPARTY_DESC")
                break;
        }

        return (<View style={styles.container}>
            <View style={styles.title}>
                <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                    <Icon style={styles.top_left} name="arrow-round-back" />
                </TouchableOpacity>
                <Text style={styles.spacer} />
                <Text style={styles.title_text}>{title}</Text>
                <Text style={styles.spacer} />
                <Text style={styles.top_right} />
            </View>
            <Text style={styles.sub_title_text}>{desc}</Text>

            <View style={styles.gap20} />
            <View style={styles.gap20} />

            <ScrollView style={styles.form_content}>
                <View style={styles.content}>
                    <Text>{translate("NAME")}</Text>
                    <TextInput onChangeText={(name_value)=>this.setState({name_value})}
                        placeholder="Enter the Counterparty's Name"
                        style={styles.input} underlineColorAndroid='transparent' value={this.state.name_value} />

                    <View style={styles.gap20} />

                    <Text>{translate("EMAIL_ADDRESS")}</Text>
                    <TextInput onChangeText={(address_value)=>this.setState({address_value})}
                        placeholder={translate("ENTER_COUNTERPARTY_EMAIL_ADDRESS")}
                        style={styles.input} underlineColorAndroid='transparent' value={this.state.address_value} />

                    <View style={styles.gap20} />

                    <Text>{translate("ETHEREUM_WALLET_ADDRESS")}</Text>
                    <TextInput onChangeText={(ether_value)=>this.setState({ether_value})}
                        placeholder={translate("ENTER_COUNTERPARTY_ETHER_ADDRESS")}
                        style={styles.input} underlineColorAndroid='transparent' value={this.state.ether_value} />

                    <View style={styles.spacer2} />
                </View>
            </ScrollView>

            {this.render_bottom()}
        </View>);
    }
}

const styles = Style.create({
    container : {
        flex:1,
        backgroundColor:"#FFFFFF",
        paddingTop:'$topPadding',
    },
    title:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
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
    spacer:{
        flex:1
    },
    spacer2:{
        height:300
    },
    content:{
        flex:1,
        paddingLeft:20,
        paddingRight:20
    },
    sub_title_text:{
        fontSize:11,
        color:"#48494A",
        fontFamily:"$font",
        justifyContent:"center",
        alignItems:"center",
        textAlign: 'center',
        width: '100%' 
    },
    form_content:{
        flex:1,
        width:"100%"
    },
    input:{
        marginTop:10,
        borderWidth:2,
        borderColor:"#324b5f",
        borderRadius:5,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10,
        fontSize:12
    },
    gap20:{
        width:20,
        height:20
    },
    bottom_button:{
        paddingTop:15,
        paddingBottom:15,
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        backgroundColor:"#324b5f",
    },
    long_bottom_button:{
        paddingTop:15,
        paddingBottom:15 + window.iphoneXPadding,
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        backgroundColor:"#324b5f",
    },
    bottom_button_text:{
        color:"#fff",
        fontSize:20,
        fontFamily:"$font",
    },
})