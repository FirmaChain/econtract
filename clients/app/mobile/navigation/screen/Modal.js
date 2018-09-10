import React from 'react';
import { 
    Modal,
    View, 
    TouchableOpacity, 
} from 'react-native';
import Text from '../../components/AppText'
import Style from 'react-native-extended-stylesheet';
import {
    WaveIndicator,
} from 'react-native-indicators';
import translate from "../../../common/translate"
  
  
export default class extends React.Component{
    constructor(){
        super();
        this.state = {
            indicator_show:false,
            alert_show:false,
            confirm_flag:false,
        }
    }
    alert_left_button = ()=>{
        this.setState({
            alert_show:false
        },()=>{
            this.alert_resolve(true)
            this.alert_resolve = null
        })
    }

    alert_right_button = ()=>{
        this.setState({
            alert_show:false
        },()=>{
            this.alert_resolve(false)
            this.alert_resolve = null
        })
    }

    componentDidMount(){
        window.showIndicator = (text)=>{
            text = translate(text)
            return new Promise((r)=>{
                if(!text || text == "")
                    text = "Loading..."
                this.setState({
                    indicator_text: text,
                    indicator_show: true,
                    alert_show: false,
                },()=>setTimeout(r,500))
            })
        }
        window.hideIndicator = ()=>{
            return new Promise((r)=>{
                this.setState({
                    indicator_text: "",
                    indicator_show: false,
                },()=>setTimeout(r,500))
            })
        }

        window.alert = (title, content, button1 = "OK")=>{
            title = translate(title)
            content = translate(content)
            button1 = translate(button1)

            return new Promise((resolve,reject)=>{
                this.alert_resolve = resolve
                this.setState({
                    alert_title : title,
                    alert_content : content,
                    alert_left_button : button1,
                    alert_show: true,
                    confirm_flag: false,
                    indicator_show: false,
                })
            })
        }

        window.confirm = (title, content, button1 = "Confirm", button2 = "Cancel")=>{
            title = translate(title)
            content = translate(content)
            button1 = translate(button1)
            button2 = translate(button2)
            
            return new Promise((resolve,reject)=>{
                this.alert_resolve = resolve
                this.setState({
                    alert_title : title,
                    alert_content : content,
                    alert_left_button : button1,
                    alert_right_button: button2,
                    alert_show: true,
                    confirm_flag: true,
                    indicator_show: false,
                })
            })
        }
    }

    render_indicator(){
        return (<Modal 
                visible={this.state.indicator_show} 
                transparent={true} 
                animationType="fade"
                onRequestClose={()=>{}}
            >
            <View style={styles.indicator_view}>
                <View style={styles.indicator}><WaveIndicator color='white'/></View>
                <Text style={styles.indicator_text}>{this.state.indicator_text}</Text>
            </View>
        </Modal>)
    }

    render_alert(){
        return (<Modal 
                transparent={true} 
                onRequestClose={()=>{}}
                animationType="fade"
                visible={this.state.alert_show}
            >
            <View style={alert_styles.container} >
                <View style={alert_styles.body}>
                    <Text style={alert_styles.title}>{this.state.alert_title}</Text>
                    <View style={alert_styles.content}>
                        <Text style={alert_styles.content_text}>{this.state.alert_content}</Text>
                    </View>

                    <View style={alert_styles.buttons}>
                        <TouchableOpacity style={[alert_styles.button, alert_styles.button_confirm, this.state.confirm_flag ? null : alert_styles.button_right_radius]} onPress={this.alert_left_button}>
                            <Text style={[alert_styles.button_text,alert_styles.white]}>{this.state.alert_left_button}</Text>
                        </TouchableOpacity>
                        {this.state.confirm_flag ? <TouchableOpacity style={[alert_styles.button, alert_styles.button_cancel]} onPress={this.alert_right_button}>
                            <Text style={alert_styles.button_text}>{this.state.alert_right_button}</Text>
                        </TouchableOpacity> : null }
                    </View>
                    
                </View>
            </View>
        </Modal>)
    }
    
    render(){
        return (<View>
            {this.render_indicator()}
            {this.render_alert()}
        </View>)
    }
}

const styles = Style.create({
    indicator_view:{
        flex:1,
        backgroundColor:"rgba(0, 0, 0, 0.4)",
        justifyContent:"center",
        alignItems:"center"
    },
    indicator:{
        height:70
    },
    indicator_text:{
        color:"#ffffff",
        fontFamily:"$fontBold",
    }
})

const alert_styles = Style.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.3)"
    },
    body:{
        width:"80%",
        height:200,
        backgroundColor:"#ffffff",
        borderTopLeftRadius:8,
        borderTopRightRadius:8,
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
    },
    title : {
        paddingTop:15,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:15,
        fontSize:20,
        fontFamily: '$fontBold',
        textAlign:"center",
        color:"#000"
    },
    content:{
        flex:1,
        paddingTop:0,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:15,
        justifyContent:"center",
        alignItems:"center"
    },
    content_text:{
    },
    buttons:{
        flexDirection:"row",
    },
    button:{
        flex:1,
        paddingTop:20,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:20,
    },
    button_text:{
        textAlign:"center",
        fontSize:15,
        fontFamily: '$fontBold'
    },
    button_confirm:{
        backgroundColor:"#324b5f",
        borderBottomLeftRadius:8
    },
    button_cancel:{
        backgroundColor:"#F2F0F0",
        borderBottomRightRadius:8
    },
    button_right_radius:{
        borderBottomRightRadius:8
    },
    white:{
        color:"#FFFFFF"
    }
})