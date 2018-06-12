import "./styles/style.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, Switch } from "react-router-dom"
import { createStore , applyMiddleware } from 'redux';
import { Provider  } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import RouteHook from './components/route.comp';
import createReducer from '../common/reducers';
import history from './history';
import PageTransition from "react-router-page-transition";

import Template from "./components/template.comp"
import IndexPage from "./components/index.page"
import ChatPage from "./components/chat.page"


import {current_platform} from "../common/utils"
import handshake_network from "../common/ChatSocket"

const store = createStore(
	createReducer({}),
	applyMiddleware(thunkMiddleware),
);

function resolver(props){
	if(props.auth){
		return new Promise(async (r,e)=>{
			// let user = await API.user()
			// if(!user.code){
			// 	return e("/login")
			// }
			// return r({ auth : user})
			r()
		})
	}

	return {}
}

window.addEventListener("load",()=>{
	handshake_network().then(()=>{
		ReactDOM.render(
			<Router history={history}>
				<Provider store={store}>
					<Template>
					<Route render={({ location }) => (<PageTransition timeout={500}>
							<Switch location={location}>
								<Route onEnter={resolver} exact path="/" component={IndexPage} />
								<Route onEnter={resolver} path="/chat/:chat" component={ChatPage} />
							</Switch>
						</PageTransition>)}
					/>
					</Template>
				</Provider>
			</Router>,
			document.getElementsByClassName("root-container")[0]
		);
	})
})
