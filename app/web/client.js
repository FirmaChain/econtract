import "./styles/style.scss"

import translate from "../common/translate"
import fs from "./filesystem"
import critical from "./critical_section"
import worker from "./worker"
import React from "react"
import ReactDOM from "react-dom"
import { Router, Switch } from "react-router-dom"
import Route from "./components/custom_route"
import { createStore , applyMiddleware } from 'redux'
import { Provider  } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createReducer from '../common/reducers'
import history from './history'
import pdfjsLib from "pdfjs-dist"
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

import Container from "./components/container.comp"
import IndexPage from "./components/index.page"
import LoginPage from "./components/login.page"
import RegisterPage from "./components/register.page"
import RecoverPage from "./components/recover.page"
import HomePage from "./components/home.page"
import TemplatePage from "./components/template-list.page"
import UpsertTemplatePage from "./components/upsert-template.page"

import AddContractPage from "./components/add-contract.page"
import UpsertContractPage from "./components/upsert-contract.page"
import ContractInfoPage from "./components/contract-info.page"
import PreviewCOntractPage from "./components/preview-contract.page"

import ApprovalPage from "./components/approval.page"
import AddApprovalPage from "./components/add-approval.page"
import UpsertApprovalPage from"./components/upsert-approval.page"

import InformationPage from "./components/information.page"

// import FolderPage from "./components/contract-folder-list.page"
// import InFolderPage from "./components/home.page"
// import AddTemplatePage from "./components/old-add-template.page"
// import EditTemplatePage from "./components/edit-template.page"
// import ContractEditorPage from "./components/contract-editor.page"
// import ContractConfirmPage from "./components/contract-confirm.page"
import VerificationPage from "./components/verification.page"
import CorpGroupInfoPage from "./components/corp-group-info.page"
import GroupPage from "./components/group.page"

import { current_platform } from "../common/utils"

const store = window.store = createStore(
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
				<Container>
					<Route onEnter={resolver} exact path="/verification" component={VerificationPage} />
					<Route onEnter={resolver} exact path="/login2/:id" component={LoginPage} />

					<Route onEnter={resolver} exact path="/" component={IndexPage} />
					<Route onEnter={resolver} exact path="/login" component={LoginPage} />
					<Route onEnter={resolver} exact path="/register" component={RegisterPage} />
					{/*<Route onEnter={resolver} exact path="/check-mnemonic" component={CheckMnemonicPage} />*/}
					<Route onEnter={resolver} exact path="/recover" component={RecoverPage} />

					<Route onEnter={resolver} exact path="/home" component={HomePage} />
					<Route onEnter={resolver} exact path="/home/:menu" component={HomePage} />
					<Route onEnter={resolver} exact path="/home/folder/:menu" component={HomePage} />

					<Route onEnter={resolver} exact path="/home/:group_id/:menu" component={HomePage} />
					<Route onEnter={resolver} exact path="/home/:group_id/folder/:menu" component={HomePage} />

					<Route onEnter={resolver} exact path="/template" component={HomePage} />
					<Route onEnter={resolver} exact path="/template/:menu" component={HomePage} />
					<Route onEnter={resolver} exact path="/new-template" component={UpsertTemplatePage} />
					<Route onEnter={resolver} exact path="/edit-template/:template_id" component={UpsertTemplatePage} />

					<Route onEnter={resolver} exact path="/approval" component={HomePage} />
					<Route onEnter={resolver} exact path="/approval/:menu" component={HomePage} />
					<Route onEnter={resolver} exact path="/add-approval" component={AddApprovalPage} />
					<Route onEnter={resolver} exact path="/edit-approval/:approval_id" component={UpsertApprovalPage} />

					<Route onEnter={resolver} exact path="/group" component={HomePage} />
					<Route onEnter={resolver} exact path="/group/:menu" component={HomePage} />
					<Route onEnter={resolver} exact path="/group/:menu/:account_id" component={HomePage} />
					{/*<Route onEnter={resolver} exact path="/group-info/:group_id" component={CorpGroupInfoPage} />*/}

					<Route onEnter={resolver} exact path="/profile" component={InformationPage} />
					<Route onEnter={resolver} exact path="/price-status" component={InformationPage} />
					<Route onEnter={resolver} exact path="/group-manage" component={InformationPage} />
					<Route onEnter={resolver} exact path="/security" component={InformationPage} />

					<Route onEnter={resolver} exact path="/add-contract" component={AddContractPage} />
					<Route onEnter={resolver} exact path="/edit-contract/:contract_id" component={UpsertContractPage} />
					<Route onEnter={resolver} exact path="/contract-info/:contract_id" component={ContractInfoPage} />
					{/*<Route onEnter={resolver} exact path="/preview-contract" component={PreviewCOntractPage} />

					<Route onEnter={resolver} exact path="/folder" component={FolderPage} />
					<Route onEnter={resolver} exact path="/folder/:id" component={InFolderPage} />
					<Route onEnter={resolver} exact path="/contract-editor/:id" component={ContractEditorPage} />
					<Route onEnter={resolver} exact path="/contract-confirm/:id/:revision" component={ContractConfirmPage} />

					<Route onEnter={resolver} exact path="/template" component={TemplatePage} />
					<Route onEnter={resolver} exact path="/add-template" component={AddTemplatePage} />
					<Route onEnter={resolver} exact path="/template-edit/:id" component={EditTemplatePage} />*/}
				</Container>
			</Provider>
		</Router>,
		document.getElementsByClassName("root-container")[0]
	);
})

/*fs.init().then(async()=>{
	console.log("fs ready")
}).catch(()=>{
	alert(translate("privilege_file_verification"))
	// location.reload()
})*/
// fs.init().then(async()=>{
// 	await fs.write("test",{ test:"test" })
// 	console.log(await fs.read("test"))

// 	worker.addWorker("upload-ipfs",function(data){
// 		console.log("worker 1 ",data)
// 	}).addWorker("transaction-eth",function(data){
// 		console.log("worker 2 ",data)
// 	}).addWorker("test",function(data){
// 		console.log("worker 3 ",data)
// 	}).start()
// })
