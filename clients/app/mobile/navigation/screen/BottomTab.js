import React from 'react';
import {connect} from "react-redux"
import { 
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import Text from '../../components/AppText'
import Resource from "../../resource"
import Icon from 'react-native-ionicons'
import Style from 'react-native-extended-stylesheet';
import { NavigationActions } from 'react-navigation';

let mapStateToProps = function(state){
	return {
        nav : state.nav
    }
}

let mapDispatchToProps = function(dispatch){
	return {
        navigate : (routeName)=>{
            let action = NavigationActions.navigate({
                routeName: routeName,
            });
            return dispatch(action)
        }
	}
}

@connect(mapStateToProps,mapDispatchToProps)
export default class BottomTab extends React.Component{
    constructor(){
        super()
    }

    getRouteName(nav = null){
        nav = nav || this.props.nav
        if(nav.index == null)
            return nav.routeName
        return this.getRouteName(nav.routes[nav.index])
    }

    item_render(idx,icon,callback){
        let sel = idx == this.getRouteName()
        let tab;
        switch(icon) {
            case "tab1":
                tab = <Image resizeMode="contain" source={Resource.tab1} style={styles.tab_image}/>
                break;
            case "tab2":
                tab = <Image resizeMode="contain" source={Resource.tab2} style={styles.tab_image}/>
                break;
            case "tab3":
                tab = <Image resizeMode="contain" source={Resource.tab3} style={styles.tab_image}/>
                break;
            case "tab4":
                tab = <Image resizeMode="contain" source={Resource.tab4} style={styles.tab_image}/>
                break;
        }

        let gnbStyle = styles.gnb_button
        if(window.isIphoneX()) {
            gnbStyle = styles.long_gnb_button
        }

        return (<TouchableOpacity 
                onPress={callback}
                style={[gnbStyle, sel ? styles.gnb_button_selected : null]}>
            <View>
                {tab}
            </View>
        </TouchableOpacity>)
    }

    render(){
        let routeName = this.getRouteName()
        if(routeName != "Main" && routeName != "MyAgreement" && routeName != "MyWallet" && routeName != "Counterparty"){
            return <View/>
        }
        return <View style={styles.container}>
            <View style={styles.gnb}>
                {this.item_render("Main","tab1", ()=>{ this.props.navigate("Main") })}
                {this.item_render("MyAgreement","tab2", ()=>{ this.props.navigate("MyAgreement") })}
                {this.item_render("Counterparty","tab3", ()=>{ this.props.navigate("Counterparty") })}
                {this.item_render("MyWallet","tab4", ()=>{ this.props.navigate("MyWallet") })}
            </View>
        </View>
    }
}

const styles = Style.create({
    container : {
        backgroundColor:"#ffffff"
    },
    page : {
        flex:1
    },
    title:{
        fontSize:20,
        fontFamily: '$fontBold'
    },
    gnb:{
        flexDirection:"row",
        width:"100%",
        backgroundColor:"#324b5f",
    },
    gnb_button:{
        flex:1,
        alignItems:"center",
        height:55,
    },
    long_gnb_button: {
        flex:1,
        alignItems:"center",
        height:55 + window.iphoneXPadding
    },
    tab_image:{
        width:40,
        marginTop:-5
    },
    gnb_button_selected:{
        backgroundColor:"#273c4e"
    }
})

console.log("styles",styles)