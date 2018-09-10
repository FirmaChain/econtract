import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
} from 'react-native';
import Style from 'react-native-extended-stylesheet';

export default function(){
    return (<View style={styles.container}>
        <Text style={styles.text}>
            No contracts available
        </Text>
    </View>)
}

const styles = Style.create({
    container:{
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
        borderColor:"#EDE8E8",
        backgroundColor:"#EDE8E8",
        width:"50% - 30",
        height:200,
        
        marginRight:10,
        marginTop:10,

        paddingLeft:6,
        paddingTop:6,
        paddingRight:6,
        paddingBottom:6,
    },
    text:{
        textAlign: 'center', 
        color:"#A3A1A1",
        fontFamily: "$fontBold",
        fontSize:13
    },
})