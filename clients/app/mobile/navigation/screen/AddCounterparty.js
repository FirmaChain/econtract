import React from 'react';
import Style from 'react-native-extended-stylesheet';
import { 
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Text from '../../components/AppText'
import TextInput from '../../components/AppTextInput'
import Icon from 'react-native-ionicons'
import Web3 from "../../../common/Web3"
import translate from "../../../common/translate"

export default class extends React.Component {
    constructor(){
        super();
        this.state = {
        };
    }

    componentDidMount(){
    }

    componentWillUnmount(){
    }

    openCounterparties = async()=>{
        this.props.navigation.push("SelectCounterparty", {
            onCallback:async (v)=>{
                this.setState({
                    name_value: v.name,
                    address_value: v.email,
                    ether_value: v.ether,
                })
                return true;
            }
        })
    }

    onNext = async ()=>{
        let name = this.state.name_value
        let email = this.state.address_value
        let ether = this.state.ether_value

        if(!name)
            return await window.alert("APP_TITLE","NEED_COUNTERPARTY_NAME")

        if(!email)
            return await window.alert("APP_TITLE","NEED_COUNTERPARTY_EMAIL")

        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email))
            return await window.alert("APP_TITLE","WORNG_EMAIL_TYPE")

        if(!ether || ether == "")
            return await window.alert("APP_TITLE","NEED_ETHER_ADDRESS")

        if(!Web3.isValidWallet(ether))
            return await window.alert("APP_TITLE","INVALID_ETHEREUM")

        let callback = this.props.navigation.getParam("onCallback")
        let ret = callback && await callback({
            name: name,
            email: email,
            ether: ether,
        })
        if( ret == true ){
            this.props.navigation.goBack()
        }
    }
 
    render() {
        return (<View style={styles.container}>
            <View style={styles.title}>
                <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                    <Icon style={styles.top_left} name="arrow-round-back" />
                </TouchableOpacity>
                <Text style={styles.spacer} />
                <Text style={styles.title_text}>{translate("ADD_COUNTERPARTY")}</Text>
                <Text style={styles.spacer} />
                <Text style={styles.top_right} />
            </View>
            <Text style={styles.sub_title_text}>{translate("WRITE_COUNTERPARTY_INFO")}</Text>

            <View style={styles.gap20} />

            <ScrollView style={styles.form_content}>
                <View style={styles.content}>

                    <TouchableOpacity onPress={this.openCounterparties}>
                        <View style={styles.load_btn}><Text style={styles.load_btn_txt}>{translate("LOAD_FROM_COUNTERPARTIES")}</Text></View>
                    </TouchableOpacity>
                    <View style={styles.gap20} />

                    <Text>{translate("COUNTERPARTY_NAME")}</Text>
                    <TextInput onChangeText={(name_value)=>this.setState({name_value})}
                        placeholder={translate("ENTER_COUNTERPARTY_NAME")}
                        style={styles.input} underlineColorAndroid='transparent' value={this.state.name_value} />

                    <View style={styles.gap20} />

                    <Text>{translate("COUNTERPARTY_EMAIL_ADDRESS")}</Text>
                    <TextInput onChangeText={(address_value)=>this.setState({address_value})}
                        placeholder={translate("ENTER_COUNTERPARTY_EMAIL_ADDRESS")}
                        style={styles.input} underlineColorAndroid='transparent' value={this.state.address_value} />

                    <View style={styles.gap20} />

                    <Text>{translate("COUNTERPARTY_ETHEREUM_ADDRESS")}</Text>
                    <TextInput onChangeText={(ether_value)=>this.setState({ether_value})}
                        placeholder={translate("ENTER_COUNTERPARTY_ETHER_ADDRESS")}
                        style={styles.input} underlineColorAndroid='transparent'  value={this.state.ether_value} />

                    <Text style={styles.warning}> * {translate("ADD_COUNTERPARTY_WARNING")}</Text>

                    <View style={styles.spacer2} />
                </View>
            </ScrollView>

            <TouchableOpacity onPress={this.onNext} style={window.isIphoneX() ? styles.long_bottom_button : styles.bottom_button}>
                <Text style={styles.bottom_button_text}>{translate("ADD")}</Text>
            </TouchableOpacity>
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
    load_btn:{
        alignItems:"flex-end",
        justifyContent:"flex-end",
    },
    load_btn_txt:{
        marginTop:10,
        borderWidth:2,
        backgroundColor:"#324b5f",
        borderColor:"#324b5f",
        borderRadius:5,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10,
        fontSize:12,
        color:"#fff"
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
    long_bottom_button: {
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
    warning:{
        marginTop:10,
        color:"red",
        fontFamily:'$fontBold'
    }
})