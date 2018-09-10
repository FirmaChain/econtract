import {connect} from "react-redux"
import React from 'react'
import { 
    View, 
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import Text from '../../components/AppText'
import TextInput from '../../components/AppTextInput'
import TextTicker from 'react-native-text-ticker'
import Icon from 'react-native-ionicons'
import Style from 'react-native-extended-stylesheet'
import { 
    DocumentPicker, 
    DocumentPickerUtil
} from 'react-native-document-picker'
import Resource from "../../resource"
import Web3 from "../../../common/Web3"
import { sha256 } from 'js-sha256'
import fs from 'react-native-fs'
import {
    NewDocument,
    ReloadDocuments
} from "../../../common/actions/document"
import {byte2fct} from "../../global"
import translate from "../../../common/translate";

let mapStateToProps = function(state){
	return {
        user:{
            ...state.user
        }
    }
}

let mapDispatchToProps = function(dispatch){
	return {
        NewDocument : (data)=> dispatch(NewDocument(data)),
        ReloadDocuments : ()=>dispatch(ReloadDocuments()),
    }
}

@connect(mapStateToProps,mapDispatchToProps)
export default class extends React.Component {
    constructor(){
        super()
        this.state = {
            mb:0,
            counterparty:[],
            doc_name:"",
        }
    }

    isEnableNext(){
        return this.state.doc_name && this.state.sign_img && this.state.counterparty.length > 0
    }

    onNext = async ()=>{
        if(!this.isEnableNext())
            return 
        
        await window.showIndicator("SAVE_DOCUMENT_INFORMATION")

        try {
            let pin = Math.floor(Math.random() * 899999 + 100000);
            let from = Web3.allAccounts()[0];
            let doc_info = {
                doc_name: this.state.doc_name,
                file_name: this.state.fileName,
                file_content: this.state.fileData,
                counterparties: this.state.counterparty,
                pin: pin,
                author: {
                    ether: from.address,
                    email: this.props.user.email,
                    name: this.props.user.name,
                    signature: await fs.readFile(this.state.sign_img,"base64"),
                },
                status: 0,
                date: Date.now()
            };

            doc_info["id"] = sha256(JSON.stringify(doc_info) + Date.now());
            await this.props.NewDocument(doc_info);

            this.props.navigation.popToTop();

            await window.hideIndicator();

            await new Promise((r)=>setTimeout(r,100))
            this.props.navigation.push("DocumentDetail",{
                docId: doc_info["id"]
            });
        } catch(Err) {
            console.log(Err)
            window.hideIndicator()
        }
    }

    componentDidMount(){
        let fileData = this.props.navigation.getParam("file_content");
        let fileName = this.props.navigation.getParam("fileName")
        this.setState({
            fileName,
            fileData,
        })
    }

    createSignature = ()=>{
        this.props.navigation.push("CreateSignature",{
            onCallback:(path)=>{
                this.setState({
                    sign_img : path
                })
                return true
            }
        });
    }

    onClickAddCounterparty = ()=>{
        this.props.navigation.push("AddCounterparty", {
            onCallback:async (data)=>{
                let accounts = Web3.allAccounts()
                for(let a of accounts){
                    if(a.address.toLowerCase() == data.ether.toLowerCase()){
                        await window.alert("APP_TITLE","CANNOT_ADD_ME_COUNTERPARTY")
                        return false
                    }
                }
                
                if(this.state.counterparty.find((i)=>i.ether.toLowerCase() == data.ether.toLowerCase())){
                    await window.alert("APP_TITLE","DUPLICATED_ETH_ADDRESS")
                    return false
                }

                if(this.state.counterparty.find((i)=>i.email == data.email)){
                    await window.alert("APP_TITLE","DUPLICATED_EMAIL")
                    return false
                }

                this.setState({
                    counterparty:[...this.state.counterparty, data]
                })
                             
                return true
            }
        })
    }

    onClickRemoveCounterparty = async (i)=>{
        if(await window.confirm("APP_TITLE", "DELETE_COUNTERPARTY","DELETE")) {
            this.state.counterparty.splice(i, 1)
            this.setState({
                counterparty: [...this.state.counterparty]
            })
        }
    }

    onClickOpenFile = ()=>{
        this.props.navigation.push("DocumentViewer",{
            file_data:this.state.fileData
        })
    }

    render(){
        if(!this.state.fileData)
            return <View />

        let bottom_button = styles.bottom_button
        if(window.isIphoneX())
            bottom_button = styles.long_bottom_button

        return (<View style={styles.container}>
            <View style={styles.title}>
                <TouchableOpacity onPress={()=>this.props.navigation.pop()}>
                    <Icon style={styles.top_left} name="arrow-round-back" />
                </TouchableOpacity>
                <Text style={styles.spacer} />
                <Text style={styles.title_text}>{translate("DOCUMENT_REGISTRATION")}</Text>
                <Text style={styles.spacer} />
                <Text style={styles.top_right} />
            </View>
            <View style={styles.content}>
                <Text style={styles.sub_title_text}>{translate("SUB_TITLE_BASIC_INFO")}</Text>
                
                <ScrollView style={styles.form_content}>
                    
                    <Text style={styles.form_content_text}>{translate("UPLOAD_DOCUMENT")}</Text>
                    <View style={styles.upload_document}>
                        <Text style={styles.doc_name_text}>{this.state.fileName}</Text>
                        <TouchableOpacity onPress={this.onClickOpenFile}>
                            <View style={styles.document_icon}>
                                <Image resizeMode="contain" source={Resource.document} style={styles.doc_name_icon}/>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.form_content_text}>{translate("ESTIMATED_FEE")}</Text>
                    <View style={styles.transaction_fee}>
                        <Text style={styles.transaction_fee_text}>
                            {byte2fct(this.state.fileData.length).number_format()} FCT ({(this.state.fileData.length / 1024 / 1024).toFixed(2)}MB)
                        </Text>
                    </View>
                    
                    <Text style={styles.form_content_text}>{translate("DOCUMENT_TITLE")}</Text>
                    <View style={styles.document_title }>
                        <TextInput 
                            value={this.state.doc_name} 
                            style={styles.document_title_input} 
                            placeholder={translate("ENTER_DOCUMENT_TITLE")}
                            underlineColorAndroid='transparent'
                            onChangeText={(text)=>this.setState({doc_name:text})}
                            />
                    </View>
                    
                    {/*                     
                    <Text style={styles.form_content_text}>Document Password</Text>
                    <View style={styles.document_title }>
                        <TextInput 
                            value={this.state.doc_password} 
                            style={styles.document_title_input} 
                            placeholder="Enter The Document Password" 
                            underlineColorAndroid='transparent'
                            onChangeText={(text)=>this.setState({doc_password:text})}
                            secureTextEntry={true}
                            />
                        <Text>* 계약 체결 전 파일을 열어볼 수 있는 패스워드입니다. 계약의 당사자에게만 직접 전달해주세요.</Text>
                    </View>
                    */}

                    <Text style={styles.form_content_text}>{translate("CREATE_YOUR_SIGNATURE")}</Text>
                    {this.state.sign_img ? <View style={styles.signature_canvas }>
                        <View style={styles.clear_box}>
                            <TouchableOpacity style={styles.clear_button} onPress={()=>this.setState({sign_img:null})}>
                                <Text style={styles.clear_text}> {translate("CLEAR")} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sign_container} >
                            <Image resizeMode="contain" style={styles.sign_img} source={{ uri: `file://${this.state.sign_img}` }} />
                        </View>
                    </View> : <View style={styles.signature_canvas }>
                        <TouchableOpacity style={styles.spacer} onPress={this.createSignature}>
                            <View style={styles.spacer} />
                            <Text style={styles.empty_signature_text}> {translate("TOUCH_HERE_AND_SIGN")} </Text>
                            <View style={styles.spacer} />
                        </TouchableOpacity>
                    </View>}

                    <Text style={styles.form_content_text}>{translate("COUNTERPARTY")}</Text>
                    <View style={styles.counterparty}>
                        {this.state.counterparty.map((row,i)=>{
                            return (<TouchableOpacity key={i} style={styles.counterparty_more_btn} onPress={this.onClickRemoveCounterparty.bind(this,i)}>
                                <Image style={styles.counterparty_profile} source={{uri:`https://identicon-api.herokuapp.com/${row.ether}/70?format=png`}}/>
                                <TextTicker
                                    style={styles.counterparty_name}
                                    duration={3000}
                                    loop
                                    bounce={false}
                                    repeatSpacer={50}
                                    marqueeDelay={5000}>
                                    {row.name}
                                </TextTicker>
                                <Text style={styles.counterparty_email}>{row.email}</Text>
                                <Text style={styles.counterparty_ether}>{row.ether}</Text>
                            </TouchableOpacity>)
                        })}
                        <TouchableOpacity style={styles.counterparty_more_btn} onPress={this.onClickAddCounterparty}>
                            <Icon style={styles.counterparty_more_btn_text} name="md-add-circle" />
                            <Text style={styles.counterparty_more_btn_text}>{translate("COUNTERPARTY")}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{height:30}} />
                </ScrollView>
                
                <TouchableOpacity onPress={this.onNext} style={[bottom_button, this.isEnableNext() ? styles.bottom_button_enable : null]}>
                    <Text style={styles.bottom_button_text}>{translate("SAVE")}</Text>
                </TouchableOpacity>
            </View>
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
        paddingRight:20,
    },
    title_text:{
        fontSize:25,
        fontFamily:"$fontBold",
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
    content:{
        justifyContent:"center",
        alignItems:"center",
        flex:1,
    },
    sub_title_text:{
        fontSize:11,
        color:"#48494A",
        fontFamily:"$font",
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
    long_bottom_button:{
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

    form_content:{
        flex:1,
        width:"100%",
        paddingTop:20,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:20,
    },
    form_content_text:{
        fontFamily:"$font",
        marginBottom:5,
    },
    upload_document: {
        flexDirection:"row",
        alignItems:"center",
        marginTop: -10
    },
    doc_name:{
        flexDirection:"row",
        alignItems:"center",
    },
    doc_name_text:{
        fontSize:13,
        color:"#707072"
    },
    document_icon:{
        padding:5
    },
    doc_name_icon:{
        width:20
    },
    transaction_fee:{
        marginTop:2,
        marginBottom:20,
    },
    transaction_fee_text:{
        color:"#707072"
    },
    document_title:{
        marginTop:5,
        marginBottom:20,
    },
    document_title_input:{
        width:"100%",
        borderRadius:5,
        borderWidth:2,
        borderColor:"#324b5f",
        paddingBottom:5,
        paddingTop:5,
        paddingLeft:10,
    },
    signature_canvas:{
        borderRadius:5,
        backgroundColor:"#ffffff",
        borderColor:"#324b5f",
        borderWidth:2,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10,
        width:"100%",
        height:170,
        justifyContent:"center",
        alignItems:"center",
        marginBottom:20,
    },
    empty_signature_text:{
        fontSize:12,
        color:"#A4A4A5"
    },
    counterparty:{
        paddingBottom:10,
        flexDirection:"row",
        flexWrap:"wrap",
    },
    counterparty_more_btn:{
        borderRadius:5,
        backgroundColor:"#F2F0F2",
        padding:10,
        width:"50% - 40px",
        height:200,
        margin:10,
        justifyContent:"center",
        alignItems:"center",
    },
    counterparty_more_btn_text:{
        color:"#AEADAE"
    },
    clear_box:{
        justifyContent:"flex-end",
        alignItems:"flex-end",
        width:"100%",
    },
    clear_button:{
        backgroundColor:"#324b5f",
        borderRadius:20,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10,
    },
    clear_text:{
        fontSize:12,
        color:'white',
        fontFamily:"$font"
    },
    sign_container:{
        flex:1,
        width:"100%"
    },
    sign_img:{
        flex:1,
        width:"100%"
    },
    counterparty_profile:{
        width:66,
        height:66
    },
    counterparty_name:{
        fontSize:16,
        marginTop:16
    },
    counterparty_email:{
        fontSize:12
    },
    counterparty_ether:{
        fontSize:10,
        color:"#666",
        marginTop:3,
        textAlign:"center",
    }
})