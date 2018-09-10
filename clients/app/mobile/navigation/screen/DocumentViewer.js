import React from 'react';
import { 
    Modal, 
    View,
    ScrollView,
    TouchableOpacity, 
    Dimensions,
    Image,
} from 'react-native';
import Text from '../../components/AppText'
import Style from 'react-native-extended-stylesheet'
import {
    WaveIndicator,
} from 'react-native-indicators'
import { Base64 } from 'js-base64'
import Icon from 'react-native-ionicons'
import Pdf from 'react-native-pdf'
import fileType from "file-type"
import translate from '../../translate';

function CovertBase64ToArrayBuffer(data) {
    let UTF8Data = Base64.atob(data)
    let UTF8DataLength = UTF8Data.length

    let bytes = new Uint8Array(UTF8DataLength)

    for (var i = 0; i < UTF8DataLength; i++) {
        bytes[i] = UTF8Data.charCodeAt(i)
    }
    
    return new Uint8Array(bytes.buffer)
}

export default class extends React.Component{
    constructor(){
        super();
        this.state = {
        }
    }

    componentDidMount(){
        try{
            let file_data = this.props.navigation.getParam("file_data")
            let type = fileType(CovertBase64ToArrayBuffer(file_data))
            console.log("type",type,file_data.length)
            this.setState({
                file_data:file_data,
                ext:type.ext
            })
        }catch(err){
            (async()=>{
                await window.alert("APP_TITLE","NOT_SUPPORT_FILE")
                this.props.navigation.pop()
            })()
        }
    }

    render_document(){
        let ext = this.state.ext;
        if(ext == "pdf"){
            const source = {uri:`data:application/pdf;base64,${this.state.file_data}`}
            return <Pdf source={source}
                onLoadComplete={(numberOfPages,filePath)=>{
                    console.log(`number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page,numberOfPages)=>{
                    console.log(`current page: ${page}`);
                }}
                onError={(error)=>{
                    console.log(error);
                }}
                style={styles.pdf}/>
        } else if(ext == "jpg" || ext == "png" || ext == "gif"){
            return <Image resizeMode="contain" style={styles.img} source={{ uri: `data:image/png;base64,${this.state.file_data}` }} />
        } else {
            return <Text>.{ext} file extension is not supported</Text>
        }
    }

    render(){
        if(!this.state.file_data){
            return <View style={styles.container}>
                <Text style={styles.spacer} />
                <Text>Loading...</Text>
                <Text style={styles.spacer} />
            </View>
        }
        return (<View style={styles.container}>
            <View style={styles.title}>
                <TouchableOpacity onPress={()=>this.props.navigation.pop()}>
                    <Icon style={styles.top_left} name="arrow-round-back" />
                </TouchableOpacity>
                <Text style={styles.spacer} />
                <Text style={styles.title_text}>{translate("DOCUMENT_VIEWER")}</Text>
                <Text style={styles.spacer} />
                <Text style={styles.top_right} />
            </View>
            <View style={styles.content}>
                {this.render_document()}
            </View>
        </View>)
    }
}

const styles = Style.create({
    container: {
        flex:1,
        backgroundColor:"#FFFFFF",
        // paddingTop:'$topPadding',
    },
    title:{
        flexDirection:"row",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:'$topPadding',
        paddingBottom:25,
        alignItems:"center",
        justifyContent:"center"
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
    form_content:{
        flex:1,
        width:"100%",
        paddingTop:20,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:20,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    },
    img:{
        flex:1,
        width:"100%"
    }
})