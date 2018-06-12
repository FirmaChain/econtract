import React from 'React';
import Tab1 from './screen/Tab1';
import Tab2 from './screen/Tab2';
import Tab3 from './screen/Tab3';
import Tab4 from './screen/Tab4';
import Modal from './screen/Modal';
import Login from "./screen/Login"
import { createStackNavigator, createBottomTabNavigator ,createMaterialTopTabNavigator } from 'react-navigation';
// import { Ionicons } from '@expo/vector-icons';
import { CustomTransition } from "./RoutesTransition"

function createCustomBottomTabNavigator(array,opt){
    let screens = {}
    for(let k in array){
        array[k].navigationOptions.order = k
        screens[array[k].navigationOptions.title] = array[k]
    }
    return createBottomTabNavigator(screens,opt);
}

function createTabScreen(title, comp, icon, opts={} ){
    return {
        screen : comp,
        navigationOptions: {
            title:title,
            tabBarLabel: title,
            // tabBarIcon: ({ tintColor }) => (<Ionicons name={icon} size={opts.iconSize||26} color={tintColor} />),
            ...opts
        }
    }
}

let b = createMaterialTopTabNavigator({
    t1 : { screen:()=>{return <Tab1 />} },
    t2 : { screen:()=>{return <Tab1 />} },
    t3 : { screen:()=>{return <Tab1 />} },
    t4 : { screen:()=>{return <Tab1 />} },
})

export default createStackNavigator({
    Main: { 
        screen: createCustomBottomTabNavigator([
            createTabScreen("타이틀", b, "md-arrow-round-down"),
            createTabScreen("가나다", Tab2, "md-arrow-round-down"),
            createTabScreen("ㅅㅁㅁ", Tab3, "md-arrow-round-down"),
            createTabScreen("ㅈㄷㅈ", Tab4, "md-arrow-round-down"),
        ],{
            tabBarOptions: { },
        }),
        navigationOptions:({navigation})=>{
            console.log("???")
            return ({
                title: navigation.state.routes[navigation.state.index].key
            })
        }
    },
    Modal: { screen: Modal },
    Login: { screen: Login },
},{
    transitionConfig: () => CustomTransition(400),
    navigationOptions:({navigation})=>{
        try{
            if(navigation.state.routes[navigation.state.index].key == "타이틀"){
                return ({
                    header:null
                })
            }
        }catch(err){
            console.log(navigation)
        }

        let title = navigation.state.params ? navigation.state.params.title || "" : navigation.state.routeName
        return {
            title:title
        }
    }
});