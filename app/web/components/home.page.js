import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Information from "./information.comp"
import Pager from "./pager"
import CheckBox from "./checkbox"
import TransactionBackgroundWork from "./transaction_background_work"
import CheckBox2 from "./checkbox2"
import history from '../history'
import Route from "./custom_route"
import moment from "moment"

import ContractListPage from "./contract-list.page"
import TemplatePage from "./template-list.page"
import GroupPage from "./group.page"
import Footer from "./footer.comp"

import translate from "../../common/translate"
import {
    fetch_user_info,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super()
		this.state={
        }
	}

    componentDidMount(){
        if(!this.props.user_info){
            (async()=>{
                await window.showIndicator()
                let user = await this.props.fetch_user_info()
                if(user == -2) {
                    window.logout()
                    alert("탈퇴 처리된 계정입니다.")
                    history.replace("/login")
                }
                await window.hideIndicator()
            })()
        }
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }
    }

    getStatus() {
        if(!!this.props.location && !!this.props.location.pathname)
            return this.props.location.pathname
        return "/home"
    }

	render() {
        if(!this.props.user_info)
            return <div />

        console.log(this.props.user_info)

		return (<div className="maintain">
            <div className="header-page">
                <div className="header">
                    <div className="left-logo">
                        <img src="/static/logo_blue.png" onClick={()=>history.push("/home")}/>
                    </div>
                    <div className="menu">
                        <div className={(this.getStatus().includes("/home") ? "selected-item" : "item")} onClick={() => history.push("/home")}>
                            <div>계약</div>
                        </div>
                        <div className={(this.getStatus().includes("/template") ? "selected-item" : "item")} onClick={() => history.push("/template")}>
                            <div>템플릿</div>
                        </div>
                        { ( !!this.props.user_info && (this.props.user_info.account_type == 1) ) ? 
                            <div className={(this.getStatus().includes("/group") ? "selected-item" : "item")} onClick={() => history.push("/group")}>
                                <div>그룹</div>
                            </div>: ""}
                    </div>
                    { !!this.props.user_info ? <Information /> : null }
                </div>
                <Route path="/home" render={() => <ContractListPage {...this.props}/>} />
                <Route path="/template" render={() => <TemplatePage {...this.props}/>} />
                <Route path="/group" render={() => <GroupPage {...this.props}/>} />
            </div>

            <Footer />
		</div>);
	}
}
