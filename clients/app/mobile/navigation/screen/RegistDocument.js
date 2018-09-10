import {connect} from "react-redux"
import React from 'react';
import {
    Platform,
    View,
    TouchableOpacity,
} from 'react-native';
import Text from '../../components/AppText'
import Icon from 'react-native-ionicons'
import Style from 'react-native-extended-stylesheet';
import { 
    DocumentPicker, 
    DocumentPickerUtil
} from 'react-native-document-picker';
import fs from 'react-native-fs';
import sha512 from 'js-sha512'
import TextTicker from 'react-native-text-ticker'
import translate from "../../../common/translate";

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
        super()
        this.state = {
        }
        this.onCLickLoadFlag = false;
    }

    onClickLoad = async()=>{
        if(this.onCLickLoadFlag)
            return

        this.onCLickLoadFlag = true
        
        setTimeout(() => {
            this.onCLickLoadFlag = false;
        }, 500)


        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, async (error,res) => {
            this.onCLickLoadFlag = false
            
            try{
                console.log("res",res)
                if(res == null)
                    return;

                if(res.fileSize > 1024 * 1024 * 4)
                    return window.alert("APP_TITLE", "FILE_TOO_BIG")
                
                if(Platform.OS == "ios"){
                    const split = res.uri.split('/');

                    const name = split.pop();
                    const inbox = split.pop();
                    const realPath = `${fs.TemporaryDirectoryPath}${inbox}/${name}`;
                    
                    let result = await fs.downloadFile({
                        fromUrl: res.uri,
                        toFile: realPath,
                    }).promise

                    if(result.statusCode == 200){
                        window.showIndicator("Loading File...")

                        let base64 = await fs.readFile(realPath,"base64")
                        let hash = sha512(base64)

                        window.hideIndicator()

                        this.setState({
                            hash: hash,
                            file_content: base64, 
                            fileName: res.fileName
                        })
                    }
                }else{
                    window.showIndicator("Loading File...")

                    let base64 = await fs.readFile(res.uri,"base64")
                    let hash = sha512(base64)

                    window.hideIndicator()

                    this.setState({
                        hash: hash,
                        file_content: base64, 
                        fileName: res.fileName
                    })
                }
            }catch(err){
                window.alert("APP_TITLE", "FAILED_READ_FILE")
                this.setState({error:err})
            }
        });
    }

    onNext = async()=>{
        if(!this.state.file_content)
            return await window.alert("APP_TITLE", "CHOOSE_DOCUMENT")

        this.props.navigation.push("RegDocInfo",{
            ...this.state
        })
    }

    render(){

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
                <Text style={styles.sub_title_text}>{translate("UPLOAD_DOCUMENT")}</Text>
                <Text style={styles.spacer} />
                <TouchableOpacity onPress={this.onClickLoad}>
                    <View style={styles.file_upload_button}>
                        <Icon style={styles.file_upload_button_icon} name="folder-open" />
                        <Text style={styles.file_upload_button_text}> {translate("BROWSER_FILE")} </Text>
                    </View>
                </TouchableOpacity>
                
                {this.state.hash ? <View style={styles.file_info}>
                    <View style={styles.hashbox}>
                        <TextTicker  duration={30000} loop bounce={false} repeatSpacer={50} marqueeDelay={5000}>
                            {this.state.fileName}
                        </TextTicker>
                    </View>
                    <View style={styles.hashbox}>
                        <TextTicker  duration={30000} loop bounce={false} repeatSpacer={50} marqueeDelay={5000}>
                            {this.state.hash}
                        </TextTicker>
                    </View>
                </View> : null }
                
                <Text style={styles.spacer} />
                <TouchableOpacity onPress={this.onNext} style={[bottom_button, this.state.hash ? styles.bottom_button_enable : null]}>
                    <Text style={styles.bottom_button_text}>{translate("Next")}</Text>
                </TouchableOpacity>
            </View>
        </View>);
    }
}

const styles = Style.create({
    container:{
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
    content:{
        justifyContent:"center",
        alignItems:"center",
        flex:1
    },
    sub_title_text:{
        fontSize:11,
        color:"#48494A",
        fontFamily:"$font",
    },
    file_upload_button:{
        borderRadius:5,
        backgroundColor:"#F2F0F2",
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        justifyContent:"center",
        alignItems:"center",
    },
    file_upload_button_icon:{
        color:"#A4A4A5"
    },
    file_upload_button_text:{
        color:"#A4A4A5",
        marginTop:10,
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
    hashbox:{
        marginTop:20,
        width:"70%",
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:5,
        paddingRight:5,
        borderRadius:10,
        backgroundColor:"#F2F0F2",
    },
    file_info:{
        width:"100%",
        alignItems:"center",
        marginTop:30
    }
})