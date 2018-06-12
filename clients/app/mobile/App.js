import React from 'react';
import { createStore , applyMiddleware } from 'redux';
import { Provider  } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';
import AppWithNavigationState from "./navigation/AppNavigator"
import createReducer from '../common/reducers';
import NaviReducer from "./reducer"
import {View} from "react-native"
import codePush from "react-native-code-push";

const naviMiddleware = createReactNavigationReduxMiddleware("root",state => state.nav);
const addListener = createReduxBoundAddListener("root");

import {current_platform} from "../common/utils"

console.log("================",current_platform(),"================")

import Network from "../common/Network"

Network.init()
console.log(Network.get())

// const createStoreWithMiddleware = applyMiddleware(
//   thunkMiddleware, // 함수를 dispatch() 하게 해줍니다
//   // loggerMiddleware, // 액션을 로깅하는 깔끔한 미들웨어입니다
//   naviMiddleware
// )(createStore);
// const store = createStoreWithMiddleware(createReducer(NaviReducer));

const store = createStore(
  createReducer({nav:NaviReducer}),
  applyMiddleware(thunkMiddleware,naviMiddleware),
);

@codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME })
export default class App extends React.Component {
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
    return (
      <Provider store={store} >
          <AppWithNavigationState addListener={addListener} />
      </Provider>
    );
  }
}
