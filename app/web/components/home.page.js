import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import Information from "./information.comp"
import Pager from "./pager"
import CheckBox from "./checkbox"
import TransactionBackgroundWork from "./transaction_background_work"
import CheckBox2 from "./checkbox2"
import history from '../history'
import Route from "./custom_route"
import moment from "moment"

import ContractListPage from "./contract-list.page"
import TemplatePage from "./contract-template.page"

import translate from "../../common/translate"
import {
    move_to_folder,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = {
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
        }
	}

	componentDidMount(){
    }

    getStatus() {
        if(!!this.props.location && !!this.props.location.pathname)
            return this.props.location.pathname
        return "home"
    }

	render() {
		return (<div className="home-page">
            <div className="header">
                <div className="left-logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/home")}/>
                </div>
                <div className="menu">
                    <div className={"item " + (this.getStatus() == "/home" ? "selected" : null)} onClick={() => history.push("/home")}>계약</div>
                    <div className={"item " + (this.getStatus() == "/template" ? "selected" : null)} onClick={() => history.push("/template")}>템플릿</div>
                </div>
                <Information />
            </div>
            <div className="content">
                <Route path="/home" component={ContractListPage} />
                <Route path="/template" component={TemplatePage} />
            </div>
		</div>);
	}
}
