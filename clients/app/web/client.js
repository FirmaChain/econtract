import "./styles/style.scss"

import translate from "../common/translate"
import fs from "./filesystem"
import critical from "./critical_section"
import worker from "./worker"
import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, Switch } from "react-router-dom"
import { createStore , applyMiddleware } from 'redux';
import { Provider  } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createReducer from '../common/reducers';
import history from './history';
import pdfjsLib from "pdfjs-dist"
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

import Template from "./components/template.comp"
import IndexPage from "./components/index.page"
import LoginPage from "./components/login.page"
import RegistPage from "./components/regist.page"
import ContractListPage from "./components/contract-list.page"
import TemplatePage from "./components/contract-template.page"
import FolderPage from "./components/contract-folder-list.page"
import InFolderPage from "./components/contract-list.page"
import AddTemplatePage from "./components/add-template.page"
import AddContractPage from "./components/add-contract.page"
import ContractEditorPage from "./components/contract-editor.page"

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
					<Route onEnter={resolver} exact path="/folder" component={FolderPage} />
					<Route onEnter={resolver} exact path="/template" component={TemplatePage} />
					<Route onEnter={resolver} exact path="/add-template" component={AddTemplatePage} />
					<Route onEnter={resolver} exact path="/add-contract" component={AddContractPage} />
					<Route onEnter={resolver} exact path="/folder/:id" component={InFolderPage} />
					<Route onEnter={resolver} exact path="/contract-editor" component={ContractEditorPage} />
				</Template>
			</Provider>
		</Router>,
		document.getElementsByClassName("root-container")[0]
	);
})

fs.init().then(async()=>{
	await fs.write("test",{ test:"test" })
	console.log(await fs.read("test"))

	worker.addWorker("1",function(data){
		console.log("worker 1 ",data)
	}).addWorker("2",function(data){
		console.log("worker 2 ",data)
	}).addWorker("3",function(data){
		console.log("worker 3 ",data)
	}).start()

	// for(let i=0;i<100;i++){
	// 	worker.add("1", {
	// 		data:i
	// 	})
	// }
})
