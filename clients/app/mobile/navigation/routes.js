import React from 'React';
import Tab1 from './screen/Tab1';
import Tab2 from './screen/Tab2';
import Tab3 from './screen/Tab3';
import Tab4 from './screen/Tab4';
import Login from "./screen/Login"
import DocumentDetail from "./screen/DocumentDetail"
import DocumentViewer from "./screen/DocumentViewer"
import ImportDocument from "./screen/ImportDocument"
import Regist from "./screen/Regist"
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator ,createMaterialTopTabNavigator } from 'react-navigation';
import { CustomTransition } from "./RoutesTransition"
import RegistDocument from './screen/RegistDocument';
import RegistDocumentInfo from './screen/RegistDocumentInfo';
import CreateSignature from './screen/CreateSignature';
import AddCounterparty from './screen/AddCounterparty';
import EditCounterparty from './screen/EditCounterparty';
import SelectCounterparty from "./screen/SelectCounterparty";

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

export default createSwitchNavigator({
    Login: { screen: Login },
    Regist: { screen: Regist },

    App: createStackNavigator({
        Main: { screen: Tab1 },
        MyAgreement: { screen: Tab2 },
        Counterparty: { screen: Tab3 },
        MyWallet: { screen: Tab4 },
        RegDoc: {screen: RegistDocument},
        RegDocInfo: {screen: RegistDocumentInfo},
        CreateSignature: {screen: CreateSignature},
        AddCounterparty: {screen: AddCounterparty},
        EditCounterparty: {screen: EditCounterparty},
        SelectCounterparty: {screen: SelectCounterparty},
        DocumentDetail: {screen: DocumentDetail},
        DocumentViewer: {screen: DocumentViewer},
        ImportDocument: {screen: ImportDocument},
    },{
        initialRouteName: "Main",
        navigationOptions: { 
            header:null
        },
        transitionConfig: (conf)=>CustomTransition(conf,400),
    })

},{
    initialRouteName: "Login"
});