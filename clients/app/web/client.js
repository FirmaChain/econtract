import "./styles/style.scss"

import translate from "../common/translate"
import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, Switch } from "react-router-dom"
import { createStore , applyMiddleware } from 'redux';
import { Provider  } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createReducer from '../common/reducers';
import history from './history';

import Template from "./components/template.comp"
import IndexPage from "./components/index.page"
import LoginPage from "./components/login.page"
import RegistPage from "./components/regist.page"
import ContractListPage from "./components/contract-list.page"
import TemplatePage from "./components/contract-template.page"

import {current_platform} from "../common/utils"

const store = createStore(
	createReducer({}),
	applyMiddleware(thunkMiddleware),
);

function resolver(props){
	if(props.auth){
		return new Promise(async (r,e)=>{
			r()
		})
	}

	return {}
}

window.addEventListener("load",()=>{
	ReactDOM.render(
		<Router history={history}>
			<Provider store={store}>
				<Template>
					<Route onEnter={resolver} exact path="/" component={IndexPage} />
					<Route onEnter={resolver} exact path="/login" component={LoginPage} />
					<Route onEnter={resolver} exact path="/regist" component={RegistPage} />
					<Route onEnter={resolver} exact path="/contracts" component={ContractListPage} />
					<Route onEnter={resolver} exact path="/template" component={TemplatePage} />
				</Template>
			</Provider>
		</Router>,
		document.getElementsByClassName("root-container")[0]
	);
})

console.log(translate)