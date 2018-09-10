import {connect} from "react-redux"
import React from 'react'
import { 
    View, 
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import TextInput from '../../components/AppTextInput'
import Text from '../../components/AppText'
import {
    RecvDocument,
    SaveSignatureInDocument,
} from "../../../common/actions"
import Style from 'react-native-extended-stylesheet'
import Icon from 'react-native-ionicons'
import {
    request,
    decrypt_with_pin
} from "../../global"
import Web3 from "../../../common/Web3"
import translate from "../../../common/translate";

let mapStateToProps = function(state){
	return {
        user:{
            ...state.user
        },
        document:{
            ...state.document
        }
    }
}

let mapDispatchToProps = function(dispatch){
	return {
        RecvDocument: (doc)=>dispatch(RecvDocument(doc)),
        SaveSignatureInDocument: (docId, sender, signature)=>dispatch(SaveSignatureInDocument(docId, sender, signature)),
	}
}

@connect(mapStateToProps,mapDispatchToProps)
export default class extends React.Component {
    constructor(){
        super()
        this.state = {
            pin_value:"" //test data
        }
    }

    isEnableNext(){
        return this.state.pin_value.length == 6
    }

    componentDidMount(){
        let docId = this.props.navigation.getParam("id");
        let ipfs = this.props.navigation.getParam("ipfs");
        
        (async()=>{
            await window.showIndicator("DOWNLOAD_DOCUMENT_FROM_IPFS")

            let raw = await window.ipfs_download(ipfs)
            console.log("raw == ", raw)
            if(typeof raw == "string"){
                this.setState({
                    doc:raw
                })

                new Promise(r=>setTimeout(r,1000))

                this.refs.keyboard.focus()
            }else{
                let docs = [ ...this.props.document.recv, ...this.props.document.req]
                let doc = docs.find(r=>r.id == raw.id)
                if( doc ){
                    try{
                        let data = decrypt_with_pin(raw.payload, doc.pin)
                        let json = JSON.parse(data)
                        console.log("json", json)

                        this.props.SaveSignatureInDocument(doc.id, json.from, json.signature)

                        await window.alert("APP_TITLE","SUCCESS_IMPORT_DOC_SIGN")    

                    }catch(err){
                        await window.alert("APP_TITLE","WRONG_DOC_DATA")    
                    }
                }else{
                    await window.alert("APP_TITLE","CANNOT_FIND_DOCUMENT_FROM_LOCAL")
                }
                this.props.navigation.pop()
            }

            await window.hideIndicator()
        })()
    }

    onNext = async()=>{
        if(!this.isEnableNext())
            return await window.alert("APP_TITLE", "INPUT_6_NUMBER")
            
        await window.showIndicator()
        try{
            let data = decrypt_with_pin(this.state.doc, this.state.pin_value)

            let accounts = Web3.allAccounts()
            let doc = JSON.parse(data)
            
            // let email = doc.counterparties.find((row)=>row.email == this.props.user.email )
            let address = [ doc.author , ...doc.counterparties].find((row)=>accounts.find( (e)=>row.ether.toLowerCase() == e.address.toLowerCase() ) )
            /*if( email == null ){
                await window.alert("APP_TITLE","Email is miss-matching")
            }else */if( address == null ){
                await window.alert("APP_TITLE","ETHEREUM_ADDRESS_MISS_MATCHING")
            }else{
                await window.alert("APP_TITLE","SUCCESS_IMPORT_DOC")
                this.props.RecvDocument(doc)
            }
                
            this.props.navigation.pop()
        }catch(err){
            console.log(err)
            await window.alert("APP_TITLE","WORNG_PIN")
        }
        await window.hideIndicator()
    }

    componentWillReceiveProps(props){
    }

	render() {
        if(this.state.doc == null)
            return <View />

        let bottom_button = styles.bottom_button
        if(window.isIphoneX())
            bottom_button = styles.long_bottom_button

        return (
            <View style={styles.container}>
                <ScrollView style={styles.incontainer}>
                <View style={styles.title}>
                    <TouchableOpacity onPress={()=>this.props.navigation.pop()}>
                        <Icon style={styles.top_icon} name="arrow-round-back" />
                    </TouchableOpacity>
                    <Text style={styles.spacer} />
                    <Text style={styles.title_text}>{translate("TITLE_IMPORT_DOCUMENT")}</Text>
                    <Text style={styles.spacer} />
                    {/* <TouchableOpacity onPress={this.onMore}>
                        <Icon style={styles.top_icon} name="more" />
                    </TouchableOpacity> */}
                </View>
                <View style={styles.content}>
                    <Text style={styles.sub_title_text}>{translate("SUB_TITLE_IMPORT_DOCUMENT")}</Text>
                    <View style={styles.pin_container}>
                        {/* <View style={styles.pin_box}><Text style={styles.pin}>{`${this.state.pin_value}`[0]}</Text></View>
                        <View style={styles.pin_box}><Text style={styles.pin}>{`${this.state.pin_value}`[1]}</Text></View>
                        <View style={styles.pin_box}><Text style={styles.pin}>{`${this.state.pin_value}`[2]}</Text></View>
                        <View style={styles.pin_box}><Text style={styles.pin}>{`${this.state.pin_value}`[3]}</Text></View>
                        <View style={styles.pin_box}><Text style={styles.pin}>{`${this.state.pin_value}`[4]}</Text></View>
                        <View style={styles.pin_box}><Text style={styles.pin}>{`${this.state.pin_value}`[5]}</Text></View> */}
                        {/* ref={(ref)=>{console.log("ref",ref);this.keyboard = ref; ref.focus();}} */}
                        <TextInput ref="keyboard" style={styles.pin_input} keyboardType="number-pad" placeholder="Typing PIN Number" autoFocus={true} value={this.state.pin_value} onChangeText={(pin_value)=>this.setState({pin_value})} />
                    </View>
                    <View style={styles.spacer}></View>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={this.onNext} style={[bottom_button, this.isEnableNext() ? styles.bottom_button_enable : null]}>
                <Text style={styles.bottom_button_text}>{translate("IMPORT")}</Text>
            </TouchableOpacity>
        </View>)
	}
}

const styles = Style.create({
    container: {
        flex:1,
        backgroundColor:"#FFFFFF",
        paddingTop:'$topPadding',
    },
    incontainer: {
        flex:1,
        backgroundColor:"#FFFFFF",
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
    top_icon:{
        marginTop:5
    },
    spacer:{
        flex:1
    },
    content:{
        justifyContent:"center",
        alignItems:"center",
        flex:1,
    },
    form_content:{
        flex:1,
        width:"100%",
        padding:20
    },
    bottom_button:{
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:"#B6B6B7",
        justifyContent:"center",
        alignItems:"center",
        width:"100%"
    },
    long_bottom_button: {
        paddingTop:15,
        paddingBottom:15 + window.iphoneXPadding,
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:"#B6B6B7",
        justifyContent:"center",
        alignItems:"center",
        width:"100%"
    },
    bottom_button_enable:{
        backgroundColor:"#324b5f",
    },
    bottom_button_text:{
        color:"#fff",
        fontSize:20,
        fontFamily:"$font",
    },
    pin_box:{
        flexDirection:"row",
        justifyContent:"center",
        // alignItems:"center",
        marginTop:5
    },
    pin:{
        width:40,
        height:40,
        borderRadius:10,
        backgroundColor:"#EEEAEE",
        justifyContent:"center",
        alignItems:"center",
        margin:10,
        marginLeft:5,
        marginRight:5,
    },
    pin_container:{
        flexDirection:"row"
    },
    pin_input:{
        flex:1,
        marginTop:30,
        marginLeft:20,
        marginRight:20,
        fontSize:17
    },
    spacer:{
        flex:1
    }
})