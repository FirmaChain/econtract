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

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'

import translate from "../../common/translate"

import {
    SeedToMasterKeyPublic,
    getMasterSeed,
    aes_encrypt,
    aes_decrypt,
    entropyToMnemonic,
} from "../../common/crypto_test"

import {
    fetch_user_info,
    update_user_info,
    update_user_public_info,
    update_corp_info,
    update_username,
    re_issue_recover_password,
    issue_2fa_otp,
    register_2fa_otp,
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
    re_issue_recover_password,
    issue_2fa_otp,
    register_2fa_otp,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            issue_ing_2fa_otp:false,
        };
	}

	componentDidMount(){
        setTimeout(async () => {
            await this.onRefresh();
        })
    }

    onRefresh = async () => {
        if(this.props.user_info) {
            let info = this.props.user_info

            this.setState({
                ...info
            })
        }
    }

    createInformation(account_type) {
        let info, corp_info, public_info
        if(account_type == 0) { // 개인 계정
            info = {
                email: this.props.user_info.email.trim(),
                username: this.state.username.trim(),
                userphone: this.state.userphone.trim(),
                useraddress: this.state.useraddress.trim(),
                recover_password: this.state.recover_password,
            }
        } else if(account_type == 1) { // 기업 관리자 계정
            info = {
                corp_master_key:this.state.corp_master_key,
                corp_key:this.state.corp_key,
                group_keys:this.state.group_keys,
                recover_password: this.state.recover_password,
            }
            public_info = {
                email: this.props.user_info.email.trim(),
                username: this.state.username.trim(),
                department: this.state.department.trim(),
                job: this.state.job.trim(),
                userphone: this.state.userphone.trim(),
            }
            corp_info = {
                company_name: this.state.company_name.trim(),
                duns_number: this.state.duns_number.trim(),
                company_ceo: this.state.company_ceo.trim(),
                company_tel: this.state.company_tel.trim(),
                company_address: this.state.company_address.trim(),
            }
        } else if(account_type == 2) { // 기업 직원 계정
            info = {
                corp_id: this.state.corp_id,
                corp_key: this.state.corp_key,
                group_keys: this.state.group_keys,
                recover_password: this.state.recover_password,
            }
            public_info = {
                email: this.props.user_info.email.trim(),
                username: this.state.username.trim(),
                department: this.state.department.trim(),
                job: this.state.job.trim(),
                userphone: this.state.userphone.trim(),
            }
        }
        return {
            info,
            corp_info,
            public_info,
        }
    }


    reIssueRecoverPassword = async () => {
        let account_type = this.props.user_info.account_type;
        let info_data = this.createInformation(account_type)
        let info = info_data.info;

        const possible = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        let passphrase2_length = 12;
        let passphrase2 = "";
        for (let i = 0; i < passphrase2_length; i++)
            passphrase2 += possible.charAt(Math.floor(Math.random() * possible.length));

        let mnemonic = entropyToMnemonic(sessionStorage.getItem("entropy"))

        let emk = aes_encrypt(mnemonic, Buffer.from(passphrase2, 'hex'))
        let mk;
        try {
            mk = aes_decrypt(Buffer.from(emk, 'hex'), Buffer.from(passphrase2, 'hex'))
        } catch(err) {
            console.log(err)
        }

        if(mk != mnemonic) {
            return alert("something is very wrong. check rawMnemonic");
        }

        info.recover_password = passphrase2;

        try {

            let masterKeyPublic = SeedToMasterKeyPublic(getMasterSeed())
            let encryptedInfo = aes_encrypt(JSON.stringify(info), masterKeyPublic);
            let resp = await this.props.re_issue_recover_password(emk, encryptedInfo)

            await this.props.fetch_user_info()
            await this.onRefresh()
            await this.textCopy(this.state.recover_password)
        } catch( err ) {
            console.log(err)
            return alert(translate("error_re_issue_recover_password_msg"))
        }
        return alert(translate("success_re_issue_recover_password"))
    }

    onClickViewMasterkeyword = async () => {
        this.setState({
            show_mnemonic:!this.state.show_mnemonic
        })
    }

    onClickViewRecoverPassword = async () => {
        this.setState({
            show_recover_password:!this.state.show_recover_password
        })
    }

    onClickIssue2FAOtp = async () => {
        let resp = await this.props.issue_2fa_otp()
        console.log(resp)
        this.setState({
            issue_ing_2fa_otp: true,
            secret: resp.payload.secret,
        })
    }

	render() {
        if(!this.props.user_info)
            return <div />

        let account_type = this.props.user_info.account_type

		return (<div className="right-desc security-page">
			<div className="info-container">
                <div className="info">
                    <div className="title">{translate("security")}</div>
                    <div className="text-place">
                        <div className="title">{translate("recover_password")}</div>
                        <div className="text-box">
                            <div className={"recover-password" + (this.state.show_recover_password ? "" : " hide")}>{this.state.recover_password}</div>
                            <div className={"transparent-but" + (this.state.show_recover_password ? "" : " hide")} onClick={this.reIssueRecoverPassword}>{translate("re_issue")}</div>
                            <div className="blue-but" onClick={this.onClickViewRecoverPassword}>{this.state.show_recover_password ? translate("close") : translate("view")}</div>
                        </div>
                    </div>
                    <div className="text-place">
                        <div className="title">{translate("master_keyword")}</div>
                        <div className="text-box">
                            <div className={"master-keyword" + (this.state.show_mnemonic ? "" : " hide")}>{entropyToMnemonic(sessionStorage.getItem("entropy"))}</div>
                            <div className="blue-but" onClick={this.onClickViewMasterkeyword}>{this.state.show_mnemonic ? translate("close") : translate("view")}</div>
                        </div>
                    </div>
                    <div className="text-place">
                        <div className="title">{translate("google_2fa_otp")}</div>
                        <div className="text-box">
                            {this.props.user_info.use_otp == 0 ? 
                                <div className="blue-but" onClick={this.onClickIssue2FAOtp}>{translate("issue")}</div> : 
                                <div className="transparent-but long-but"><i className="far fa-shield-alt"></i> {translate("already_use_otp")}</div>}
                            {this.props.user_info.use_otp == 1 ? <div className="blue-but">{translate("re_issue_otp")}</div>: null}
                        </div>
                    </div>
                    {this.state.issue_ing_2fa_otp ? <div className="otp-place">
                        <img src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=${this.state.secret.otpauth_url}`}/>
                    </div> : null}
                </div>
            </div>
        </div>)
	}
}

