import {connect} from "react-redux"
import React from 'react';
import { 
    View, 
    TouchableOpacity, 
    ScrollView,
} from 'react-native'
import Text from '../../components/AppText'
import TextInput from '../../components/AppTextInput'
import CountryCode from "../../countryCode" 
import Icon from 'react-native-ionicons'
import Picker from 'react-native-picker'
import Style from 'react-native-extended-stylesheet'
import Web3 from "../../../common/Web3"
import {
    SaveUserInfo,
    LoadUserInfo,
    TryGoogleAccessToken,
} from "../../../common/actions"
import { GoogleSignin } from 'react-native-google-signin'
import translate from "../../../common/translate";

let mapStateToProps = function(state){
	return {
        user: state.user
    }
}

let mapDispatchToProps = function(dispatch){
    return {
        TryGoogleAccessToken: ()=>dispatch(TryGoogleAccessToken()),
        SaveUserInfo: (pk)=>dispatch(SaveUserInfo(pk)),
        LoadUserInfo: ()=>dispatch(LoadUserInfo())
	}
}

@connect(mapStateToProps,mapDispatchToProps)
export default class extends React.Component {
    constructor(){
        super()
        this.state = {
            loading:true,
            countryCode:`82`
        }
    }

    componentDidMount(){
        (async()=>{
            await window.showIndicator()
            await this.props.TryGoogleAccessToken()
            await window.hideIndicator()

            let accounts = Web3.allAccounts()
            if( accounts.length > 0 )
                return this.props.navigation.navigate("Main")

            this.setState({
                loading:false
            })
        })()
    }

    componentWillReceiveProps(props){
    }

    getCountryFlag(text){
        for(let c of CountryCode){
            if(c[1] == text)
                return c
        }
    }

    gotoLogin = async()=>{
        window.showIndicator()
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        window.hideIndicator()

        this.props.navigation.navigate("Login")
    }

    onPhoneText = (phone)=>{
        phone = phone.replace(/-/g,"")
        if(phone.length >= 8){
            phone = `${phone.slice(0,3)}-${phone.slice(3,7)}-${phone.slice(7,11)}`
        }else if(phone.length >= 4){
            phone = `${phone.slice(0,3)}-${phone.slice(3,7)}`
        }else{
            phone = `${phone.slice(0,3)}`
        }
        this.setState({phone})
    }

    onClickCountryCode = ()=>{
        let data = CountryCode.map((row)=>{
            return `${row[0]} (+${row[1]})`
        })
        
        Picker.init({
            pickerData: data,
            pickerTitleText:translate("SELECT_YOUR_COUNTRY"),
            onPickerConfirm: data => {
                this.setState({
                    countryCode: /.*?\s\(\+(\d*)\)/.exec(data[0])[1]
                })
            },
            onPickerCancel: data => {
            },
            onPickerSelect: data => {
            }
        });
        Picker.show();
    }

    onClickSendSMS = async()=>{
        await window.alert("APP_TITLE", "Send sms");
        this.setState({
            enableSMS:true
        })
    }

    onClickRegist = async()=>{
        // if(!this.state.enableSMS)
        //     return ;
            
        if(!this.state.phone || this.state.phone == "")
            return await window.alert("APP_TITLE", "NEED_YOUR_PHONE_NUMBER")

        if(false /* verification code check */ )
            return await window.alert("APP_TITLE", "INVALID_VERIFICATION_SMS")
        
        let wallet = Web3.walletWithPK(this.state.privateKey)
        if(!wallet)
            return await window.alert("APP_TITLE", "INVALID_ETHEREUM_PRIVATE_KEY")

        await this.props.SaveUserInfo({
            pk : this.state.privateKey,
            phone: this.state.phone,
        })
        await this.props.LoadUserInfo()

        this.props.navigation.navigate("Main")
    }

    onClickGenerate = async()=>{
        try{
            let v = Web3.createAccount()
            this.setState({
                privateKey: v.privateKey,
            })
        }catch(err){
            window.alert(err.toString())
        }
    }

	render() {
        if(this.state.loading)
            return <View />

        let bottom_button = styles.bottom_button
        if(window.isIphoneX())
            bottom_button = styles.long_bottom_button


		return (
			<View style={styles.container}>
                <View style={styles.top_header}>
                    <TouchableOpacity onPress={this.gotoLogin}>
                        <Icon name="arrow-round-back" />
                    </TouchableOpacity>
                    <Text style={styles.spacer} />
                    <Text style={[styles.font_bold,styles.title]}> {translate("REGISTRATION")} </Text>
                    <Text style={styles.spacer} />
                    <Text style={styles.top_right} />
                </View>
                <ScrollView style={styles.content}>
                    <Text style={styles.font_medium}>{translate("MOBILE_PHONE")}</Text>
                    <View style={styles.line_form}>
                        <TouchableOpacity style={styles.country_code_button} onPress={this.onClickCountryCode}>
                            <View style={styles.country_code_text}>
                                <Text style={[]}>+{this.state.countryCode}</Text>
                            </View>
                        </TouchableOpacity>
                        <TextInput style={[styles.input]}
                            keyboardType='numeric'
                            onChangeText={this.onPhoneText}
                            value={this.state.phone}
                            placeholder="010-0000-0000"
                            underlineColorAndroid='transparent'
                        />
                    </View>
                    <Text style={styles.font_medium}>{translate("VERIFICATION_CODE")}</Text>
                    <View style={styles.line_form}>
                        <TextInput style={styles.input}
                            keyboardType='numeric'
                            onChangeText={(code) => this.setState({code})}
                            value={this.state.code}
                            placeholder={translate("ENTER_VERIFICATION_SMS")}
                            underlineColorAndroid='transparent'
                        />
                        <TouchableOpacity onPress={this.onClickSendSMS} style={styles.button} >
                            <View>
                                <Text style={styles.button_text}>{translate("SEND")}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.font_medium}>{translate("ROPSTEN_PRIVATE_KEY")}</Text>
                    <View style={styles.line_form}>
                        <TouchableOpacity onPress={this.onClickGenerate} style={styles.button} >
                            <View>
                                <Text style={styles.button_text}>{translate("GENERATE")}</Text>
                            </View>
                        </TouchableOpacity>
                        <TextInput style={styles.input}
                            onChangeText={(privateKey) => this.setState({privateKey})}
                            value={this.state.privateKey}
                            placeholder={translate("ENTER_ROPSTEN_PRIVATE_KEY")}
                            underlineColorAndroid='transparent'
                        />
                    </View>
                    <Text style={styles.tip}>{translate("GEN_ROPSTEN_DESC1")}</Text>
                    <Text style={styles.tip}>{translate("GEN_ROPSTEN_DESC2")}</Text>
                </ScrollView>
                <TouchableOpacity onPress={this.onClickRegist} style={[bottom_button, this.state.enableSMS ? styles.bottom_enable : null]} >
                    <Text style={[styles.font_bold,styles.white,{fontSize:20}]}>{translate("CONFIRM")}</Text>
                </TouchableOpacity>
			</View>
		);
	}
}

const styles = Style.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#ffffff"
    },
    top_header:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:'$topPadding',
        paddingBottom:20
    },
    top_right:{
        width: 20
    },
    title:{
        fontSize:20,
    },
    spacer:{
        flex:1
    },
    content:{
        flex:1,
        paddingLeft:20,
        paddingRight:20,
    },
    line_form:{
        flexDirection:"row",
        width:"100% - 20",
        marginTop:10,
        marginBottom:30,
    },
    input:{
        flex:3,
        borderWidth:2,
        borderColor:"#324b5f",
        borderRadius:5,
        paddingLeft:7,
        paddingBottom:6,
        paddingTop:6,
        fontSize:15,
        marginRight:10
    },
    button:{
        borderWidth:2,
        paddingBottom:6,
        paddingTop:6,
        flex:1,
        borderColor:"#324b5f",
        backgroundColor:"#324b5f",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:5,
        marginRight:10,
        paddingLeft:0,
    },
    tip: {
        justifyContent: 'center',
        alignItems: 'center',
        color:'#DB4455',
        fontFamily: '$fontBold'
    },
    button_text:{
        color:"white",
        fontFamily: '$fontBold'
    },
    bottom_button:{
        justifyContent:"center",
        alignItems:"center",
        paddingBottom:15,
        paddingTop:15,
        backgroundColor:"#324b5f",
        width:"100%"
    },
    long_bottom_button:{
        justifyContent:"center",
        alignItems:"center",
        paddingBottom:15 + window.iphoneXPadding,
        paddingTop:15,
        backgroundColor:"#324b5f",
        width:"100%"
    },
    bottom_enable:{
        backgroundColor:"#324b5f",
    },
    font_bold:{
        fontFamily:"$fontBold",
    },
    font_medium:{
    },
    white:{
        color:"#FFFFFF"
    },
    country_code_button:{
        flex:1,
        marginRight:10
    },
    country_code_text:{
        flex:3,
        borderWidth:2,
        borderColor:"#324b5f",
        borderRadius:5,
        justifyContent:"center",
        alignItems:"center",
        marginRight:0,
    }
})