import "crypto"
import "./global"
import '../../shim'
import "../common/utils"
import React from 'react'
import { 
    createStore , 
    applyMiddleware 
} from 'redux'
import { 
    Provider, 
    connect 
} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import {
    createReactNavigationReduxMiddleware,
    reduxifyNavigator,
    createNavigationReducer,
} from 'react-navigation-redux-helpers'
import createReducer from '../common/reducers'
import codePush from "react-native-code-push"
import AppRoutes from "./navigation/routes"
import Network from "../common/Network"
import {
    View,
    Linking,
    BackHandler
} from 'react-native'
import Style from 'react-native-extended-stylesheet'
import BottomTab from './navigation/screen/BottomTab'
import "../common/Web3"
import "./storage"
import {
    SaveCounterpartyOnDeeplink,
    LoadUserInfo,
    UpdateFriendInfo,
} from "../common/actions"
import ModalManager from "./navigation/screen/Modal" 
import Store from "../common/Store"
import { 
    NavigationActions
} from 'react-navigation';

let iosTopPadding = 40
if(window.isIphoneX()) {
    iosTopPadding = 60
}

Style.build({
    '@media ios': {
        $font:"NotoSans-Regular",
        $fontBold:"NotoSans-Medium",
        $apexlight:"Apex Sans Light",
        $apexbook:"Apex Sans Book",
        $topPadding:iosTopPadding,
    },
    '@media android': {
        $font:"NotoSans-Regular",
        $fontBold:"NotoSans-Medium",
        $apexlight:"ApexSans-Light",
        $apexbook:"ApexSans-Book",
        $topPadding:30,
    },
});

const naviMiddleware = createReactNavigationReduxMiddleware("root", state => state.nav);
const AppWithNavigationState = connect(state => ({state: state.nav}))( reduxifyNavigator( AppRoutes, "root" ) );
const navReducer = createNavigationReducer(AppRoutes);

Network.init()
Network.get()

const store = Store(createStore(
    createReducer({ nav:navReducer }),
    applyMiddleware(thunkMiddleware,naviMiddleware),
))

// deeplink temp
let deeplink_url = null
function checkDeepLink(url){
    if (url && deeplink_url != url) {
        let reg = /firmapoc:\/\/intent\/(.*?)\/(.*)/g.exec(url)
        switch(reg[1]){
            case "addfriend":
                store.dispatch(SaveCounterpartyOnDeeplink(reg[2]))
            break;
        }
        deeplink_url = url
    }
}

Linking.addEventListener('url', (e)=>checkDeepLink(e.url));

@codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME })
export default class extends React.Component {
    componentDidMount(){
        codePush.sync({
            updateDialog: true,
            installMode: codePush.InstallMode.IMMEDIATE
        });
        
        store.dispatch(LoadUserInfo())
        store.dispatch(UpdateFriendInfo())
        Linking.getInitialURL().then(checkDeepLink).catch(err => console.error('An error occurred', err));

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = async () => {
        return false
    }

    codePushStatusDidChange(status) {
        switch(status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log("Checking for updates.");
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("Downloading package.");
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                console.log("Installing update.");
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                console.log("Up-to-date.");
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.log("Update installed.");
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
    }

    render() {
        return (<Provider store={store} >
            <View style={{flex:1}}>
                <ModalManager />
                <AppWithNavigationState />
                <BottomTab />
            </View>
        </Provider>)
    }
}
