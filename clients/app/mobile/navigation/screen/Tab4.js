import React from 'react';
import {connect} from "react-redux"
import { 
    View,
    ScrollView,
    TouchableOpacity,
    Share
} from 'react-native';
import Text from '../../components/AppText'
import TextInput from '../../components/AppTextInput'
import Style from 'react-native-extended-stylesheet';
import Web3 from '../../../common/Web3'
import TextTicker from 'react-native-text-ticker'
import translate from '../../translate';

const Gap = ()=><View style={{width:10,height:10}} />

let mapStateToProps = function(state){
	return {
        user:{
            ...state.user
        }
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
            fct:"(loading...)",
            eth:"(loading...)",
        }
    }

    componentDidMount(){
        this.onPressRefresh()    
    }

    onPressShareProfile = async()=>{
        // await window.showIndicator()
        let account = Web3.allAccounts()[0] || {}

        try{
            let p = btoa(unescape(encodeURIComponent(`${this.props.user.name}/${this.props.user.email}/${account.address}`)))
            let url = `firmapoc://intent/addfriend/${p}`
            Share.share({
                message: url
            })
        }catch(e){
            console.log(e)
        }
        // await window.hideIndicator()
    }

    onClickFaucet = async()=>{
        let account = Web3.allAccounts()[0] || {}
        await window.showIndicator("REQUEST_ETH_FAUCET")
        let result = {}
        try{
            result = await fetch(`http://mailer.firma-solutions.com/eth?address=${account.address}`,{
                method: 'GET',
            })
        } catch(Err) {
            console.log(Err)
        }
        await window.hideIndicator() 

        if(result.status) {
            window.alert("APP_TITLE", "REQUEST_ETH_FAUCET_SUCCESS")
        } else {
            window.alert("APP_TITLE", "REQUEST_ETH_FAUCET_FAILED")
        }
    }

    componentWillUnmount(){
        this.setState = function(){}
    }

    onPressRefresh = async()=>{
        // await window.showIndicator()
        try{
            this.setState({
                fct:"(loading...)",
                eth:"(loading...)",
            })
            
            let account = Web3.allAccounts()[0] || {}
            let fct = await Web3.fct_balance(account.address)
            let eth = await Web3.eth_balance(account.address)

            this.setState({
                fct:fct,
                eth:eth
            })
        }catch(err){ console.log(err) }
        // await window.hideIndicator()
    }

    onPressShare = async(text)=>{
        try{
            Share.share({
                message: text
            })
        }catch(e){
            console.log(e)
        }
    }
    
	render() {
        let account = Web3.allAccounts()[0] || {}
        console.log(account)
		return (<View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.title_text}>{translate("MY_WALLET")}</Text>
            </View>
            <ScrollView style={styles.form_content}>
                <View style={styles.content}>
                    <View style={styles.profile_container}>
                        <View style={styles.profile_header}>
                            <Text style={styles.profile_header_text}>
                                {translate("PERSONAL_PROFILE")}
                            </Text>
                        </View>
                        <View style={styles.profile_content}>

                            <View style={styles.profile_left}>
                                <Text style={styles.profile_text}>{this.props.user.name}</Text>
                                <Text style={styles.profile_gray_email}>{this.props.user.email}</Text>
                                <Text style={styles.profile_gray_email}>{this.props.user.phone}</Text>

                                <Gap />

                                {/* <TouchableOpacity onPress={this.onPressShareProfile}>
                                    <View style={styles.ether_check_btn}>
                                        <Text style={styles.ether_check_btn_text}>Share Profile</Text>
                                    </View>
                                </TouchableOpacity> */}
                            </View>

                            <View style={styles.profile_separate} />
                            <View style={styles.profile_right}>
                                <Text style={styles.profile_text}>{translate("TOTAL_FCT")}</Text>
                                <Text style={styles.profile_gray_text}>{this.state.fct} FCT</Text>

                                <Gap />

                                <Text style={styles.profile_text}>{translate("TOTAL_ETH")}</Text>
                                <Text style={styles.profile_gray_text}>{this.state.eth} ETH</Text>

                                <Gap />

                                <TouchableOpacity onPress={this.onPressRefresh}>
                                    <View style={styles.ether_check_btn}>
                                        <Text style={styles.ether_check_btn_text}>{translate("REFRESH")}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                    <View style={styles.ether_wallet_info}>
                        <Text>{translate("ETH_WALLET_ADDRESS")}</Text>
                        <TouchableOpacity style={styles.input_container} onPress={this.onPressShare.bind(this,account.address)}>
                            <TextInput style={styles.input} value={account.address} pointerEvents="none" editable={false} underlineColorAndroid='transparent' />
                        </TouchableOpacity>

                        <View style={styles.separate}/>
                        
                        <Text>{translate("ETH_PRIVATE_KEY")}</Text>
                        <TouchableOpacity style={styles.input_container} onPress={this.onPressShare.bind(this,account.privateKey)}>
                            <TextInput style={styles.input} value={account.privateKey} pointerEvents="none" editable={false} underlineColorAndroid='transparent' />
                        </TouchableOpacity>
                        
                        <View style={styles.separate}/>

                        <Text>{translate("GET_FREE_ETH")}</Text>

                        <TouchableOpacity onPress={this.onClickFaucet} >
                            <View style={styles.ether_check_btn}>
                                <Text style={styles.ether_check_btn_text}>Get</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    profile_container:{
        borderWidth:2,
        borderColor:"#F2F0F2",
        borderRadius:10
    },
    profile_header:{
        backgroundColor:"#F2F0F2",
        paddingTop:10,
        paddingLeft:10,
        paddingBottom:10,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
    },
    profile_header_text:{
        color:"#000000",
        fontFamily:"$font",
    },
    profile_content:{
        paddingTop:20,
        paddingLeft:0,
        paddingRight:0,
        paddingBottom:20,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },
    profile_left:{
        flex:1,
        alignItems:"center",
    },
    profile_right:{
        flex:1,
        alignItems:"flex-start",
        paddingLeft:30
    },
    profile_text:{
        color:"#1A1A1B",
        fontFamily:"$font",
    },
    profile_gray_text:{
        color:"#636465",
        fontSize:12,
        fontFamily:"$font",
    },
    profile_gray_email: {
        color:"#636465",
        fontSize:12,
        fontFamily:"$font",
        alignSelf: 'center',
        textAlign: 'center'  
    },
    profile_separate:{
        height:55,
        borderLeftWidth:1,
        borderLeftColor:"#F3F0F0"
    },
    ether_wallet_info:{
        alignItems:"center",
        paddingTop:30,
    },
    input:{
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 2,
        borderColor: "#324b5f",
        borderRadius: 5,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 12,
        // width: "70%"
    },
    input_container: {
        width:"90%"
    },
    circle_blue:{
        paddingTop:3,
        paddingLeft:3,
        paddingRight:3,
        paddingBottom:3,
        backgroundColor:"#69B5C0",
        borderRadius:50
    },
    circle_white:{
        paddingTop:3,
        paddingLeft:3,
        paddingRight:3,
        paddingBottom:3,
        backgroundColor:"#ffffff",
        borderRadius:50
    },
    status_box:{
        marginTop:20,
        marginBottom: 10,
        flexDirection:"row"
    },
    status_text:{
        color:"#69B5C0",
        fontSize:10,
        fontFamily:"$font",
    },
    ether_check_btn:{
        marginTop:10,
        backgroundColor:"#324b5f",
        borderRadius:20,
        paddingTop:6,
        paddingBottom:6,
        paddingLeft:15,
        paddingRight:15,
    },
    ether_check_btn_text:{
        color:"#ffffff",
        fontFamily:"$font",
    },
    separate:{
        width:"80%",
        borderTopColor:"#AAA",
        borderTopWidth:1,
        marginTop:30,
        marginBottom:30,
    },
    form_content:{
        flex:1,
        width:"100%"
    },
})