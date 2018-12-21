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

import ProfilePage from "./profile.page"
import PriceStatusPage from "./price-status.page"
import GroupManagePage from "./group-manage.page"
import Footer from "./footer.comp"
import Web3 from "../../common/Web3"

import translate from "../../common/translate"
import {
    fetch_user_info,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
		if(this.props.user_info) {
			let info = this.props.user_info

			this.setState({
				...info
			})
		}
    }

    onSaveInformation = () => {

    }

    onInfoChange = (propertyName, e) => {
    	this.setState({
    		[propertyName]:e.target.value
    	})
    }

	render() {
        if(!this.props.user_info || !this.state.username)
            return <div />

        console.log(this.state)

		return (<div className="right-desc profile-page">
			<div className="info-container">
	            <div className="info">
	            	<div className="title">계정 정보</div>
	            	<div className="text-place">
	            		<div className="title">이름</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.username} onChange={this.onInfoChange.bind(this, "username")}/></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">이메일</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.email} onChange={this.onInfoChange.bind(this, "email")}/></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">휴대폰 번호</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.userphone} onChange={this.onInfoChange.bind(this, "userphone")}/></div>
	            	</div>
	            	{this.props.user_info.account_type == 0 ? <div className="text-place">
	            		<div className="title">주소</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.address} onChange={this.onInfoChange.bind(this, "address")}/></div>
	            	</div> : null}
	            	<div className="text-place">
	            		<div className="title">마스터 키워드 확인</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.username} onChange={this.onInfoChange.bind(this, "username")}/></div>
	            	</div>
	            </div>
	            {this.props.user_info.account_type != 0 ? <div className="info">
	            	<div className="title">기업 정보</div>
	            	<div className="text-place">
	            		<div className="title">기업명</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.company_name} onChange={this.onInfoChange.bind(this, "company_name")}/></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">사업자 등록번호</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.duns_number} onChange={this.onInfoChange.bind(this, "duns_number")}/></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">대표자 이름</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.company_ceo} onChange={this.onInfoChange.bind(this, "company_ceo")}/></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">주소</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.company_address} onChange={this.onInfoChange.bind(this, "company_address")}/></div>
	            	</div>
	            </div>:null}
            </div>
            <div className="button-container">
            	<div className="blue-but" onClick={this.onSaveInformation}>저장하기</div>
            </div>
        </div>)
	}
}

