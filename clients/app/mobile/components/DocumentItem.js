import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity,
    Image
} from 'react-native';
import TextTicker from 'react-native-text-ticker'
import Icon from 'react-native-ionicons'
import Style from 'react-native-extended-stylesheet';

function render_only_me(author) {
    return (<View>
    </View>)
}

function render_with_counterparties(author, counterparties) {
    let firstCounterparty = counterparties[0]

    return (<View style={styles.user}>
        <View style={styles.profile_view}>
            <Image style={styles.profile} source={{uri:`https://identicon-api.herokuapp.com/${author.ether}/70?format=png`}}/>
            <TextTicker
                style={styles.user_text}
                duration={3000}
                loop
                bounce={false}
                repeatSpacer={50}
                marqueeDelay={5000}>
                {author.name}
            </TextTicker>
        </View>
        <Icon style={styles.user_icon} name="repeat" />
        <View style={styles.profile_view}>
            <Image style={styles.profile} source={{uri:`https://identicon-api.herokuapp.com/${firstCounterparty.ether}/70?format=png`}}/>
            <TextTicker
                style={styles.user_text}
                duration={3000}
                loop
                bounce={false}
                repeatSpacer={50}
                marqueeDelay={5000}>
                {firstCounterparty.name}
            </TextTicker>
        </View>
    </View>)
}

function statusText(counterparties) {
    let b = counterparties.find((c)=>c.signed == null)
    if(b){
        return "in Progress"
    }else{
        return "completed"
    }
}

export default function(props){
    let delta = (Date.now() - props.date)/1000

    let delta_text = ""
    if( delta > 60*60*24*31 ){
        delta_text = `${Math.floor(delta / (60*60*24*31))} Month ago`
    }else if( delta > 60*60*24 ){
        delta_text = `${Math.floor(delta / (60*60*24))} Day ago`
    }else if( delta > 60*60 ){
        delta_text = `${Math.floor(delta / (60*60))} Hour ago`
    }else if( delta > 60 ){
        delta_text = `${Math.floor(delta / 60)} Minute ago`
    }else{
        delta_text = `${Math.floor(delta)} Second ago`
    }

    let author = props.author
    let counterparties = props.counterparties
    let additionalData = counterparties.length > 1 ? counterparties.length - 1 : null

    return (<TouchableOpacity style={styles.container} onPress={props.onPress}>
        <Text style={styles.date_text}> {delta_text} </Text>
        <View style={styles.doc_title}>
            <TextTicker
                style={styles.doc_title_text}
                duration={3000}
                loop
                bounce={false}
                repeatSpacer={50}
                marqueeDelay={5000}
            >
                {props.doc_name}
            </TextTicker>
        </View>
        <View style={styles.status}>
            <Text style={styles.status_text}>
                {statusText(counterparties)}
            </Text>
        </View>
        <View style={styles.spacer} />
        {counterparties.length > 0 ? render_with_counterparties(author, counterparties) : render_only_me(author)}
        {additionalData != null ? <Text style={styles.additional_data}>+ {additionalData} Users</Text>: null}
    </TouchableOpacity>)
}

const styles = Style.create({
    container:{
        alignItems:"center",
        borderRadius:10,
        borderColor:"#F1F0F0",
        borderWidth:2,
        width:"50% - 30",
        height:230,
        marginRight:10,
        marginTop:10,

        paddingLeft:6,
        paddingTop:6,
        paddingRight:6,
        paddingBottom:6,
    },
    doc_title:{
        borderRadius:20,
        borderWidth:1,
        borderColor:"#F1F0F0",
        backgroundColor:"#F1F0F0",
        paddingLeft:6,
        paddingRight:6,
        paddingTop:3,
        paddingBottom:3,
        marginTop:40,
        width:"100%",
    },
    doc_title_text:{
        color:"#08090A",
        fontFamily: "$fontBold",
        fontSize:11,
    },
    spacer: {
        height:20
    },
    date_text:{
        fontFamily:"$fontBold",
        textAlign:"right",
        color:"#A3A1A1",
        width:"100%",
        fontSize:10,
        marginTop:10,
        marginRight:10
    },
    profile_view: {
        justifyContent: 'center',
        alignItems: 'center' 
    },
    profile:{
        width:30,
        height:30
    },
    additional_data: {
        color:"#324b5f",
        fontSize:10,
        marginTop: 10,
        marginBottom:10
    },
    user:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },
    user_text:{
        fontSize:10,
        color:"#515253",
        marginTop:6,
        maxWidth:60
    },
    user_icon:{
        fontSize:20,
        marginLeft:5,
        marginRight:5
    },
    status:{
        marginTop:5
    },
    status_text:{
        color:"#515253",
        fontSize:11
    }
})