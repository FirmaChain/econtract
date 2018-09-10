import {connect} from "react-redux"
import React from 'react'
import { 
    View, 
    Image, 
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import Text from '../../components/AppText'
import {
    TryGoogleLogin,
    TryGoogleAccessToken,
} from "../../../common/actions"
import Resource from "../../resource"
import { GoogleSignin } from 'react-native-google-signin'
import Style from 'react-native-extended-stylesheet'

let mapStateToProps = function(state){
	return {
        ...state.user
    }
}

let mapDispatchToProps = function(dispatch){
	return {
        TryGoogleLogin : (token)=>dispatch(TryGoogleLogin(token)) ,
        TryGoogleAccessToken : (token)=>dispatch(TryGoogleAccessToken(token)) ,
	}
}

@connect(mapStateToProps,mapDispatchToProps)
export default class extends React.Component {
    constructor(){
        super()
        this.state = {}
    }
    componentDidMount(){
        window.showIndicator()
        setTimeout(async() => {
            await this.initLoading()
        }, 1000)
    }

    componentWillReceiveProps(props){
    }

    async initLoading(){
        window.showIndicator()
        try{
            await GoogleSignin.configure({
                iosClientId: '391844033242-8rnv6g70a1c6o3hrk2650v788ekdohud.apps.googleusercontent.com',
                webClientId: '391844033242-b6i1reh61v91lquae70mr8k33ioc9es0.apps.googleusercontent.com',
            })

            // await GoogleSignin.hasPlayServices({ autoResolve: true })
            await this.props.TryGoogleAccessToken()

        }catch(Err){
            console.log(Err)
        }
        window.hideIndicator()
    }

    signIn = async () => {
        await window.showIndicator()
        try {
            await this.props.TryGoogleLogin()
            if(this.props.access_token){
                setTimeout( ()=>this.props.navigation.navigate("Regist") )
            }
        } catch(Err) {
            console.log(Err)
            await this.initLoading()
            await window.hideIndicator()
        }
    };

	render() {
		return (
			<ImageBackground source={Resource.main_back} style={styles.container}>
                <Image source={Resource.white_logo} style={styles.logo_img}/>
                <Text style={styles._title}>FirmaChain</Text>
                <Text style={styles._sub_title}>E-Contract</Text>
                <TouchableOpacity style={styles.google_sign_in_container} onPress={this.signIn}>
                    <Image source={Resource.google_signin} style={styles.google_sign_in}/>
                </TouchableOpacity>
			</ImageBackground>
		);
	}
}

const styles = Style.create({
    container:{
        justifyContent:"center",
        alignItems:"center",
        flex:1,
        width:'100%',
        height:'100%',
    },
    logo_img:{
        width:75, 
        height:80,
        resizeMode: Image.resizeMode.contain,
        marginTop: 180
    },
    title:{
        fontFamily:"$apexbook",
        marginTop:10,
        fontSize:45,
        color:"#ffffff"
    },
    sub_title:{
        fontFamily:"$apexlight",
        fontSize:25,
        color:"#ffffff",
    },
    google_sign_in:{
        resizeMode: Image.resizeMode.contain,
        width:300,
    },
    google_sign_in_container: {
        marginTop:130
    }
})