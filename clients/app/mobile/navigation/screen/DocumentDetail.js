import React from 'react'
import {connect} from "react-redux"
import { 
    Modal,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native'
import Text from '../../components/AppText'
import Style from 'react-native-extended-stylesheet'
import Icon from 'react-native-ionicons'
import fs from 'react-native-fs'
import SignatureComp from "../../components/SignatureComp"
import {
    byte2fct,
    request,
    encrypt_with_pin,
    decrypt_with_pin
} from "../../global"
import TextTicker from 'react-native-text-ticker'
import { sha256 } from 'js-sha256'
import Resource from "../../resource"
import Web3 from "../../../common/Web3"
import {
    DocumentSendSignature,
    DocumentUpdateSignature
} from "../../../common/actions"
import Store from "../../../common/Store"
import translate from "../../../common/translate"

function isMe(c){
    let user = Store().getState().user
    let accounts = Web3.allAccounts()

    if(typeof c == "string"){
        return accounts.find((r)=>c == r.address)
    }else{
        return accounts.find((r)=>c.ether == r.address)
    }
}

function CounterpartyPrevSend(props){
    return <View style={styles.counterparties_item}>
        <Image style={styles.counterparty_pic} source={{uri:`https://identicon-api.herokuapp.com/${props.ether}/70?format=png`}}/>
        <View style={styles.counterparty_info}>
            <Text style={styles.counterparty_name}>{props.name}</Text>
            <Text style={styles.counterparty_email}>{props.email}</Text>
            <TextTicker style={styles.counterparty_ether} duration={3000} bounce={false} repeatSpacer={50} marqueeDelay={5000} loop>
                {props.ether}
            </TextTicker>
        </View>
    </View>
}

function CounterpartyWithSignutre(props){
    let isMine = isMe(props)

    function render_signature(){
        if(isMine){
            if(props.my_sign){
                return <View >
                    <View style={styles.clear_box}>
                        <TouchableOpacity style={styles.clear_button} onPress={()=>props.onRemoveSign()}>
                            <Text style={styles.clear_text}> {translate("CLEAR")} </Text>
                        </TouchableOpacity>
                    </View>
                    <Image resizeMode="stretch" source={{uri: `file://${props.my_sign}`}} style={styles.counterparty_signature_img} />
                </View>
            }else if(props.signed){
                return <SignatureComp sign={props.get_signature} style={styles.counterparty_signature_img} />
            }else{
                return <TouchableOpacity onPress={()=>props.onCreateSign(props)}>
                    <Text style={styles.empty_signature_text}> {translate("TOUCH_HERE_AND_SIGN")} </Text>
                </TouchableOpacity>
            }
        }else{
            if(props.signed){
                return <SignatureComp sign={props.get_signature} style={styles.counterparty_signature_img} />
            }else{
                return <Text style={styles.counterparty_signature_txt}> {translate("WAIT_RESPONSE_SIGN")} </Text>
            }
        }
    }

    return <View style={[styles.counterparties_item,{flexDirection:"column"}]}>
        <View style={{flexDirection:"row"}}>
            <Image style={styles.counterparty_pic} source={{uri:`https://identicon-api.herokuapp.com/${props.ether}/70?format=png`}}/>
            <View style={styles.counterparty_info}>
                <Text style={styles.counterparty_name}>{props.name}</Text>
                <Text style={styles.counterparty_email}>{props.email}</Text>
                <TextTicker style={styles.counterparty_ether} duration={3000} bounce={false} repeatSpacer={50} marqueeDelay={5000} loop>
                    {props.ether}
                </TextTicker>
            </View>
        </View>
        <View style={styles.counterparty_signature_box}>
            {render_signature(isMine)}
        </View>
    </View>
}

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
        DocumentUpdateSignature: (...v)=>dispatch(DocumentUpdateSignature(...v))
	}
}

@connect(mapStateToProps,mapDispatchToProps)
export default class extends React.Component{
    constructor(){
        super();
        this.state = {
            doc:null,
            sign:null,
        }
        this.onNextClickFlag = false;
    }

    async loading(){
        let docId = this.state.docId
        this.setState({
            sign:null
        })

        await window.showIndicator()
        let parties = await Web3.poc_getParties(docId);
        // let signed = await Web3.poc_allSign(docId);
        let sign = {}

        for(let i in parties){
            sign[ parties[i] ] = await Web3.poc_getSignIPFS(docId, i)
        }

        await window.hideIndicator()

        this.props.DocumentUpdateSignature(docId, sign)

        this.setState({
            sign:sign
        })
    }

    componentDidMount(){
        let docId = this.props.navigation.getParam("docId")
        this.setState({
            docId:docId
        }, ()=>{
            this.LoadDocument();
            this.loading();
        } )
    }

    componentWillReceiveProps(props){
        this.LoadDocument(props)
    }

    LoadDocument = (props = null)=>{
        props = props || this.props

        let doc = [...props.document.recv, ...props.document.req].find((o)=>o.id == this.state.docId)
        this.setState({
            doc:{
                ...doc
            }
        })
    }

    isEnableNext(){
        if(this.status()==3){
        }
        return true
    }

    status(){
        if(this.state.sign == null)
            return -1;
        
        if( Object.keys(this.state.sign).length == 0 ){
            return 0 // before transaction
        }

        for(let i in this.state.sign){
            if( isMe(i) && this.state.sign[i] == "" )
                return 3 // need your signature
        }

        for(let i in this.state.sign){
            if( this.state.sign[i] == "" )
                return 1 // waiting counterparties's signature
        }
        return 2;
    }

    sub_title(){
        let status = this.status()
        if(status == 0){
            return translate("TITLE_NEW_TRNASACTION") 
        }else if(status == 1){
            return translate("SUB_TITLE_WAIT_RESPONSE") 
        }else if(status == 2){
            return translate("SUB_TITLE_FINISH_ALL")
        }else if(status == 3){
            return translate("SUB_TITLE_SIGN_THIS_DOCUMENT")
        }
    }

    button_text(){
        let status = this.status()
        if(status == 0){
            return translate("START_TRANSACTION")
        }else if(status == 3){
            return translate("SEND_MY_SIGNATURE")
        }
    }

    onClickOpenFile = async()=>{
        await window.showIndicator()
        let data = await this.state.doc.get_content()
        await window.hideIndicator()

        this.props.navigation.push("DocumentViewer",{
            file_data:data
        })
    }

    render_content(){
        let status = this.status()
        if(status == 0){
            return this.render_prev_transaction()
        }else if( status == 1 || status == 2 || status == 3){
            return this.render_waiting_response()
        }
    }

    onRemoveSign= ()=>{
        this.setState({
            my_sign:null
        })
    }

    onCreateSign = (counterparty)=>{
        this.props.navigation.push("CreateSignature",{
            onCallback:async(path)=>{
                this.setState({
                    my_sign:path
                })
                return true
            }
        });
    }

    onNext = async()=>{
        if(this.onNextClickFlag)
            return;
        
        this.onNextClickFlag = true;

        setTimeout(() => {
            this.onNextClickFlag = false;
        }, 2000)

        let status = this.status()
        let doc = this.state.doc
        if(status == 0){
            let work_count = -1;
            let total_work = 5;
            
            async function AddCountIndicator(a,b){
                work_count ++
                await window.showIndicator(`${translate("NOT_CLOSE_THIS_APP")} (${a || work_count}/${b || total_work})`)
            }

            if(await window.confirm("APP_TITLE","CONFIRM_START_TRANSACTION")){
                try{
                    await AddCountIndicator();
                    let payload = {
                        id: doc.id,
                        doc_name: doc.doc_name,
                        file_name: doc.file_name,
                        file_content: await doc.get_content(),
                        pin:doc.pin,
                        author:{
                            name: doc.author.name,
                            ether: doc.author.ether,
                            email: doc.author.email,
                            signature: await doc.author.get_signature(),
                        },
                        counterparties:doc.counterparties.map((v)=>({
                            name: v.name,
                            email: v.email,
                            ether: v.ether,
                            signature: null,
                        })),
                        date:doc.date
                    }
                    
                    let file_ipfs = await window.ipfs_upload( encrypt_with_pin(JSON.stringify(payload), doc.pin) )
                    await AddCountIndicator();
                    
                    let signature_ipfs = await window.ipfs_upload( encrypt_with_pin(await doc.author.get_signature(), doc.pin) )
                    await AddCountIndicator();

                    let resp = await request("/regist-doc","POST",{
                        id:doc.id,
                        docName:doc.doc_name,
                        author:{
                            name: doc.author.name,
                            ether: doc.author.ether,
                            email: doc.author.email, 
                            signature: signature_ipfs.Hash,
                        },
                        counterparties:payload.counterparties,
                        file_ipfs:file_ipfs.Hash,
                    })

                    try{
                        await AddCountIndicator();
                        await Web3.poc_newContract(doc.id, doc.author.ether, doc.counterparties.map((v)=>v.ether))
                        await AddCountIndicator();
                        await Web3.poc_sign(doc.id, doc.author.ether, signature_ipfs.Hash)
                        await AddCountIndicator();
                    }catch(err){
                        if(err.message.indexOf("Insufficient funds for gas * price + value"))
                            throw "NotEngouhETH"
                        console.log(err)
                    }
                }catch(err){
                    if(err == "NotEngouhETH"){
                        return await window.alert("APP_TITLE", "NOT_ENGOUH_ETH")
                    } else {
                        return await window.alert("APP_TITLE", "Error Occured Msg : " + err)
                    }
                }
                await window.hideIndicator()
                await window.alert("APP_TITLE","FIN_ALL_TRANSACTION")
                await this.loading();              
            }
        } else if(status == 3){
            try{
                let from = [doc.author , ...doc.counterparties].find(isMe)
                let signature = (from.signed && await from.get_signature()) || (this.state.my_sign ? await fs.readFile(this.state.my_sign,"base64") : null)

                if(signature == null)
                    return await window.alert("APP_TITLE", "SIGNIN_FIRST")
                
                if(await window.confirm("APP_TITLE","SEND_SIGNATURE_NOW")){
                    await window.showIndicator("NOT_CLOSE_THIS_APP")
                    try{
                        let signature_ipfs = await window.ipfs_upload( encrypt_with_pin(signature, doc.pin) )

                        try{
                            await Web3.poc_sign(doc.id, from.ether, signature_ipfs.Hash)
                        }catch(err){
                            if(err.message.indexOf("Insufficient funds for gas * price + value"))
                                throw "NotEngouhETH"
                                
                            console.log(err)
                        }
                    }catch(err){
                        if(err == "NotEngouhETH"){
                            return await window.alert("APP_TITLE", "NOT_ENGOUH_ETH")
                        }
                        console.log(err)
                    }

                    await window.hideIndicator()
                    await window.alert("APP_TITLE","FIN_ALL_TRANSACTION")
                    await this.loading();
                }
            }catch(err){
                window.alert("APP_TITLE",err)
            }
        }
    }

    render_pin(){
        return <View>
            <Text style={styles.form_content_text}>PIN</Text>
            <View style={styles.pin_box}>
                <View style={styles.pin}><Text>{`${this.state.doc.pin}`[0]}</Text></View>
                <View style={styles.pin}><Text>{`${this.state.doc.pin}`[1]}</Text></View>
                <View style={styles.pin}><Text>{`${this.state.doc.pin}`[2]}</Text></View>
                <View style={styles.pin}><Text>{`${this.state.doc.pin}`[3]}</Text></View>
                <View style={styles.pin}><Text>{`${this.state.doc.pin}`[4]}</Text></View>
                <View style={styles.pin}><Text>{`${this.state.doc.pin}`[5]}</Text></View>
            </View>

            <Text style={styles.pin_explain_text}> * {translate("PIN_DESC_1")} </Text>
            <Text style={styles.pin_explain_text}> * {translate("PIN_DESC_2")} </Text>
        </View>
    }

    render_prev_transaction(){
        return (<View style={styles.container_default_document}>
            <Text style={styles.form_content_text}>{translate("DOCUMENT")}</Text>
            <View style={styles.doc_name}>
                <Text style={styles.doc_name_text}>{this.state.doc.file_name}</Text>
                <TouchableOpacity onPress={this.onClickOpenFile}>
                    <View style={styles.document_icon}>
                        <Image resizeMode="contain" source={Resource.document} style={styles.doc_name_icon}/>
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.form_content_text}>{translate("DOCUMENT_NAME")}</Text>
            <View style={styles.doc_name}>
                <Text style={styles.doc_name_text}>{this.state.doc.doc_name}</Text>
            </View>

            <Text style={styles.form_content_text}>{translate("ESTIMATED_FEE")}</Text>
            <View style={styles.transaction_fee }>
                <Text style={styles.transaction_fee_text}>
                    {byte2fct(this.state.doc.file_size).number_format()} FCT ({(this.state.doc.file_size / 1024 / 1024).toFixed(2)}MB)
                </Text>
            </View>

            <Text style={styles.form_content_text}>{translate("MY_SIGNATURE")}</Text>
            <View style={styles.signature_box }>
                <SignatureComp sign={this.state.doc.author.get_signature} style={styles.signature_img} />
            </View>

            {this.render_pin()}

            <View style={{height:20}} />
                    
            <Text style={styles.form_content_text}>{translate("COUNTERPARTY")}</Text>
            <View style={styles.counterparties}>
                {this.state.doc.counterparties.map((item,k)=>{
                    return <CounterpartyPrevSend key={k} {...item} user={this.props.user} />
                })}
            </View>
            <View style={{height:90}} />
        </View>)
    }

    render_waiting_response(){
        let status = this.status()

        return (<View style={styles.container_default_document}>
            <Text style={styles.form_content_text}>{translate("DOCUMENT")}</Text>
            <View style={styles.doc_name}>
                <Text style={styles.doc_name_text}>{this.state.doc.file_name}</Text>
                <TouchableOpacity onPress={this.onClickOpenFile}>
                    <View style={styles.document_icon}>
                        <Image resizeMode="contain" source={Resource.document} style={styles.doc_name_icon}/>
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.form_content_text}>{translate("DOCUMENT_NAME")}</Text>
            <View style={styles.doc_name}>
                <Text style={styles.doc_name_text}>{this.state.doc.doc_name}</Text>
            </View>

            <Text style={styles.form_content_text}>{translate("AUTHOR_INFORMATION")}</Text>
            <View style={styles.author_info}>
                <Text style={styles.author_info_text}>{this.state.doc.author.name}</Text>
                <Text style={styles.author_info_text}>{this.state.doc.author.email}</Text>
                <Text style={styles.author_info_text}>{this.state.doc.author.ether}</Text>
            </View>
            <View style={styles.signature_box }>
                <SignatureComp sign={this.state.doc.author.get_signature} style={styles.signature_img} />
            </View>

            {status != 3 ? this.render_pin() : null}
            
            <View style={{height:20}} />
                    
            <Text style={styles.form_content_text}>{translate("COUNTERPARTY")}</Text>
            <View style={styles.counterparties}>
                {this.state.doc.counterparties.map((item,k)=>{
                    return <CounterpartyWithSignutre key={k} {...item} user={this.props.user} onCreateSign={this.onCreateSign} onRemoveSign={this.onRemoveSign} my_sign={this.state.my_sign} />
                })}
            </View>
            <View style={{height:90}} />
        </View>)
    }

    render_bottom_button(){
        let status = this.status()
        let bottom_button = styles.bottom_button
        
        if(window.isIphoneX())
            bottom_button = styles.long_bottom_button

        if(status == 0 || status == 3){
            return <TouchableOpacity onPress={this.onNext} style={[bottom_button, this.isEnableNext() ? styles.bottom_button_enable : null]}>
                <Text style={styles.bottom_button_text}>{this.button_text()}</Text>
            </TouchableOpacity>
        }
    }

    render(){
        if(this.state.doc == null)
            return <View />

        return (<View style={styles.container}>
            <View style={styles.title}>
                <TouchableOpacity onPress={()=>this.props.navigation.pop()}>
                    <Icon style={styles.top_icon} name="arrow-round-back" />
                </TouchableOpacity>
                <Text style={styles.spacer} />
                <Text style={styles.title_text}>{translate("DOCUMENT_DETAIL")}</Text>
                <Text style={styles.spacer} />
            </View>
            {this.state.sign == null ? <View style={styles.content}>
                <Text>Now Loading...</Text>
            </View> : <View style={styles.content}>
                <Text style={styles.sub_title_text}>{this.sub_title()}</Text>
                <ScrollView style={styles.form_content}>
                    {this.render_content()}
                </ScrollView>
            </View>}
            {this.render_bottom_button()}
        </View>)
    }
}

const styles = Style.create({
    container: {
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
    container_default_document:{
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
    bottom_button_enable:{
        backgroundColor:"#324b5f",
    },
    bottom_button_text:{
        color:"#fff",
        fontSize:20,
        fontFamily:"$font",
    },
    form_content_text:{
        fontFamily:"$font",
        marginBottom:5,
    },
    doc_name:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:5,
        marginBottom:20,
    },
    author_info:{
        marginTop:5,
        marginBottom:20,
    },
    author_info_text:{
        fontSize:13,
        color:"#A4A4A5"
    },
    doc_name_text:{
        fontSize:13,
        color:"#707072"
    },
    document_icon:{
    },
    doc_name_icon:{
        width:20,
        height:20
    },
    transaction_fee:{
        marginTop:5,
        marginBottom:20,
    },
    transaction_fee_text:{
        color:"#707072"
    },
    signature_box:{
        padding:10,
        borderRadius:5,
        borderColor: '#324b5f',
        borderWidth: 2,
        width:220,
        height:140,
        marginTop:5,
        marginBottom:20
    },
    signature_img:{
        width:200,
        height:120
    },
    counterparties:{
    },
    counterparties_item:{
        marginTop:5,
        marginBottom:5,
        backgroundColor:"#EEEAEE",
        borderRadius:5,
        padding:5,
        flexDirection:"row"
    },
    counterparty_pic:{
        width:60,
        height:60,
        marginRight: 15
    },
    counterparty_info:{
        flex:1,
    },
    counterparty_name:{
        fontFamily:"$font",
        fontSize:14,
        marginBottom: 5,
        marginTop:5
    },
    counterparty_email:{
        fontFamily:"$font",
        fontSize:12
    },
    counterparty_ether:{
        fontFamily:"$font",
        fontSize:10,
        color:'#666'
    },
    counterparty_status:{
        marginLeft:16,
        marginRight:6
    },
    notyet:{
        color:"#A4A4A5"
    },
    finished:{
        color:"#00806B"
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
    pin_explain_text:{
        fontFamily:"$font",
        fontSize:12,
        color:"red"
    },
    counterparty_signature_box:{
        backgroundColor:"#ffffff",
        borderRadius:10,
        padding:10,
        marginTop:5,
    },
    counterparty_signature_img:{
        width:300,
        height:200
    },
    counterparty_signature_txt:{
        margin:10,
        fontSize:12,
        fontFamily:"$font"
    },
    empty_signature_text:{
        fontSize:12,
        color:"#A4A4A5"
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
    counterparty_icon : {
        width:50,
    },
    counterparty_icon_container : {
        alignSelf: 'flex-start',
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:5,
        paddingRight:5,
    },
    clear_text:{
        fontSize:12,
        color:'white',
        fontFamily:"$font"
    },
})