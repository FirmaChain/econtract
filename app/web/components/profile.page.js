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

import ProfilePage from "./profile.page"
import PriceStatusPage from "./price-status.page"
import GroupManagePage from "./group-manage.page"
import Footer from "./footer.comp"
import Web3 from "../../common/Web3"

import translate from "../../common/translate"

import {
    SeedToMasterKeyPublic,
    getMasterSeed,
    aes_encrypt,
    entropyToMnemonic,
} from "../../common/crypto_test"

import {
    fetch_user_info,
    update_user_info,
    update_user_public_info,
    update_corp_info,
    update_username,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    update_user_info,
    update_user_public_info,
    update_corp_info,
    update_username,
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

    onSaveInformation = async () => {		
		let account_type = this.props.user_info.account_type;
		let info, corp_info, public_info
        if(account_type == 0) { // 개인 계정
            info = {
                email: this.props.user_info.email.trim(),
                username: this.state.username.trim(),
                userphone: this.state.userphone.trim(),
                useraddress: this.state.useraddress.trim(),
            }
        } else if(account_type == 1) { // 기업 관리자 계정
            corp_info = {
                company_name: this.state.company_name.trim(),
                duns_number: this.state.duns_number.trim(),
                company_ceo: this.state.company_ceo.trim(),
                company_address: this.state.company_address.trim(),
            }
            public_info = {
                email: this.props.user_info.email.trim(),
                username: this.state.username.trim(),
                job: this.state.job.trim(),
                userphone: this.state.userphone.trim(),
            }
            info = {/*
                corp_id:this.state.corp_id,
                corp_master_key:this.state.corp_master_key,
                corp_key:this.state.corp_key,*/
            }
        } else if(account_type == 2) { // 기업 직원 계정
            public_info = {
                email: this.props.user_info.email.trim(),
                username: this.state.username.trim(),
                job: this.state.job.trim(),
                userphone: this.state.userphone.trim(),
            }
            info = {
                /*corp_id:this.state.corp_id,
                corp_key:this.state.corp_key,*/
            }
        }
        try {
            await this.props.update_username(this.state.username)
            if(account_type == 0) {
    	    	let masterKeyPublic = SeedToMasterKeyPublic(getMasterSeed())
    	        let encryptedInfo = aes_encrypt(JSON.stringify(info), masterKeyPublic);
    	        await this.props.update_user_info(encryptedInfo)
            }

	        if(account_type == 1) {
	        	let encryptedCorpInfo = aes_encrypt(JSON.stringify(corp_info), Buffer.from(this.props.user_info.corp_key,'hex'))
	        	await this.props.update_corp_info(encryptedCorpInfo)
	        }

            if(public_info) {
                let encryptedPublicInfo = aes_encrypt(JSON.stringify(public_info), Buffer.from(this.props.user_info.corp_key,'hex'))
                await this.props.update_user_public_info(encryptedPublicInfo)
            }

	        await this.props.fetch_user_info()
    	} catch( err ) {
    		console.log(err)
    		return alert(translate("error_modify_public_info_msg"))

    	}
    	return alert(translate("success_modify_public_info"))
    }

    onInfoChange = (propertyName, e) => {
    	this.setState({
    		[propertyName]:e.target.value
    	})
    }

    onClickFindAddress = async (type)=>{
        await window.showIndicator()
        let address = await new Promise(r=>daum.postcode.load(function(){
            new daum.Postcode({
                oncomplete: r,
                onclose:r
            }).open();
        }));
        if(!!address && !!address.roadAddress) {
            console.log(address)
            if(type == "personal") {
                this.setState({
                    useraddress: address.roadAddress + " "
                })
            } else if(type == "company") {
                this.setState({
                    company_address: address.roadAddress + " "
                })
            }
        }
        await window.hideIndicator()
    }

    onClickViewMasterkeyword = async () => {
        this.setState({
            show_mnemonic:!this.state.show_mnemonic
        })
    }

	render() {
        if(!this.props.user_info)
            return <div />

        let account_type = this.props.user_info.account_type

		return (<div className="right-desc profile-page">
			<div className="info-container">
	            <div className="info">
	            	<div className="title">{translate("account_info")}</div>
	            	<div className="text-place">
	            		<div className="title">{translate("name")}</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.username} onChange={this.onInfoChange.bind(this, "username")}/></div>
	            	</div>
	            	{account_type != 0 ? <div className="text-place">
	            		<div className="title">{translate("job")}</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.job} onChange={this.onInfoChange.bind(this, "job")}/></div>
	            	</div> : null}
	            	<div className="text-place">
	            		<div className="title">{translate("email")}</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.email} onChange={this.onInfoChange.bind(this, "email")} disabled /></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">{translate("individual_phone")}</div>
	            		<div className="text-box"><input className="common-textbox" type="text" value={this.state.userphone} onChange={this.onInfoChange.bind(this, "userphone")} disabled /></div>
	            	</div>
	            	{account_type == 0 ? <div className="text-place">
	            		<div className="title">{translate("address")}</div>
	            		<div className="text-box">
	            			<input className="common-textbox" type="text"
	            				value={this.state.useraddress}
	            				onChange={this.onInfoChange.bind(this, "useraddress")}/>
	            			<div className="blue-but" onClick={this.onClickFindAddress.bind(this, "personal")}>{translate("find")}</div>
	            		</div>
	            	</div> : null}
                    <div className="text-place">
                        <div className="title">{translate("master_keyword")}</div>
                        <div className="text-box">
                            <div className={"master-keyword" + (this.state.show_mnemonic ? "" : " hide")}>{entropyToMnemonic(sessionStorage.getItem("entropy"))}</div>
                            <div className="blue-but" onClick={this.onClickViewMasterkeyword}>{this.state.show_mnemonic ? translate("close") : translate("view")}</div>
                        </div>
                    </div>

	            </div>
	            {account_type != 0 ? <div className="info">
	            	<div className="title">{translate("corp_info")}</div>
	            	<div className="text-place">
	            		<div className="title">{translate("corporation_name")}</div>
	            		<div className="text-box"><input className="common-textbox" type="text" disabled={account_type == 2} value={this.state.company_name} onChange={this.onInfoChange.bind(this, "company_name")}/></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">{translate("duns_number")}</div>
	            		<div className="text-box"><input className="common-textbox" type="text" disabled={account_type == 2} value={this.state.duns_number} onChange={this.onInfoChange.bind(this, "duns_number")}/></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">{translate("corporation_ceo_name")}</div>
	            		<div className="text-box"><input className="common-textbox" type="text" disabled={account_type == 2} value={this.state.company_ceo} onChange={this.onInfoChange.bind(this, "company_ceo")}/></div>
	            	</div>
	            	<div className="text-place">
	            		<div className="title">{translate("address")}</div>
	            		<div className="text-box">
	            			<input className="common-textbox" type="text"
	            				disabled={account_type == 2} value={this.state.company_address}
	            				onChange={this.onInfoChange.bind(this, "company_address")}/>
	            			{ account_type == 1 ? <div className="blue-but" onClick={this.onClickFindAddress.bind(this, "company")}>{translate("find")}</div> : null }
	            		</div>
	            	</div>
	            </div>:null}
            </div>
            <div className="button-container">
            	<div className="blue-but" onClick={this.onSaveInformation}>{translate("save")}</div>
            </div>
        </div>)
	}
}

