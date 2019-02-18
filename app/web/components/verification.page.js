/*import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history'
import translate from "../../common/translate"
import { sha256 } from 'js-sha256'
import Web3 from "../../common/Web3"

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
	constructor(props){
		super(props)
		this.state={
            step:0,
            percent:0,
            contract_name : this.props.match.params.id || null
        }
	}

	componentDidMount(){
    }

    componentWillReceiveProps(nextProps){
    }

    onClickUploadFile = async (e)=>{
        let file = e.target.files[0];

        let reader = new FileReader();
        reader.readAsArrayBuffer(file)
        reader.onload = async()=>{
            await window.showIndicator()
            try{
                this.setState({
                    file: file,
                    filename: file.name,
                    check_hash:sha256(reader.result)
                })
            }catch(err){
                console.log(err)
                window.alert(translate("no_form_file", ["PDF"]))
            }
            await window.hideIndicator()
        }
    }
//9dc1a3dce74374ada23711b60a863c3daf9321e9779928fadad886667f343eac
//0x85e3e519dad768899e72eab667c815af01ad5f6e67481294a302a9f511ebb8a0
    onVerify = async() => {
        if(this.state.file == null){
            return alert(translate("select_doc_file"))
        }
        if(!this.state.contract_name || this.state.contract_name.length < 64){
            return alert(translate("input_hash"))
        }

        this.setState({
            step:1,
            percent:5
        })
        
        try{
            let tx_receipt = await Web3.transaction(this.state.contract_name)
            this.setState({ percent:13 })
            await new Promise(r=>setTimeout(r,1000))
            if( tx_receipt ){
                let head = tx_receipt.input.slice(0,10)
                let topic_1 = tx_receipt.input.slice(10,74)
                this.setState({ percent:56 })
                await new Promise(r=>setTimeout(r,1000))
                this.setState({ percent:100 })
                
                if(topic_1 == this.state.check_hash){
                    this.setState({
                        ok:true,
                        step:2,
                    })
                }else{
                    this.setState({
                        ok:false,
                        step:2,
                        warning:translate("input_hash_file_hash_different")
                    })
                }
            }else{
                if(this.state.check_hash == this.state.contract_name){
                    this.setState({
                        ok:true,
                        step:2,
                    })
                }else{
                    this.setState({
                        ok:false,
                        step:2,
                        warning:translate("input_wrong_hash")
                    })
                }
                this.setState({ percent:100 })
            }
        }catch(err){
            alert(translate("verification_failed"))
        }
    }

    onClickReset = ()=>{
        this.setState({
            step:0,
            file:null,
            percent:0
        })
    }

	render() {
        //console.log(this.state.check_hash)
		return (<div className="verification-page">
            <div className={this.state.step == 0?`top`:`top toppadding`}>
                <div className="logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
                </div>
                <div className="title">{translate("verification_service_title")}</div>
                <div className="desc">{translate("verification_service_title_desc_1")}</div>
                <div className={this.state.step == 0?`desc-image`:`desc-image folded`}>
                    <div>
                        <img src="/static/pic_01.png" />
                        <div className="img-desc">{translate("verification_service_title_desc_2")}</div>
                    </div>
                    <div>
                        <img src="/static/pic_02.png" />
                        <div className="img-desc">{translate("verification_service_title_desc_3")}</div>
                    </div>
                    <div>
                        <img src="/static/pic_03.png" />
                        <div className="img-desc">{translate("verification_service_title_desc_4")}</div>
                    </div>
                </div>
            </div>
            <div className="progress">
                <div className="progress-fill" style={{width:`${this.state.percent}%`}}></div>
            </div>
            <div className={this.state.step == 0?`bottom`:`bottom move-out`}>
                <div className="form-label"> {translate("contract_hash_or_transaction")} </div>
                <div className="form-input">
                    <input placeholder={translate("please_input_doc_hash_or_contract_hash")} value={this.state.contract_name || ""} onChange={e=>this.setState({contract_name:e.target.value})} />
                </div>
                <div className="form-label"> {translate("contract_name")} </div>
                {this.state.file ? <div className="selected-file">
                    <div className="filename">{this.state.file.name}</div>
                    <div className="del-btn" onClick={()=>this.setState({file:null,imgs:[]})}>{translate("remove")}</div>
                </div> : <div className="upload-form">
                    <button className="file-upload-btn" onClick={()=>this.refs.file.click()}> <i className="fas fa-file-archive"></i> {translate("file_upload")} </button>
                    <input ref="file" type="file" onChange={this.onClickUploadFile} style={{display:"none"}}/>
                </div>}
                <div className="form-button">
                    <div className="submit-button" onClick={this.onVerify}>{translate("verification")}</div>
                </div>
            </div>
            <div className={this.state.step==1?`bottom`:`bottom move-in`} style={{textAlign: "center",paddingTop:"130px"}}>
                <div className="lds-grid">
                    <div/><div/><div/>
                    <div/><div/><div/>
                    <div/><div/><div/>
                </div>
            </div>
            <div className={this.state.step==2?`bottom checked-panel`:`bottom checked-panel move-out`}>
                <i className={this.state.ok ? "far fa-check-circle ok_icon":"far fa-times-circle no_icon"}></i>
                <div className="title">{this.state.ok ? translate("verification_success") : translate("verification_fail")}</div>
                <div className="sub-title">{translate("contract_hash_or_address")}</div>
                <div className="hash-text">{this.state.contract_name}</div>
                <div className="sub-title">{translate("upload_doc_file")}</div>
                <div className="content-text">{this.state.filename}</div>
                {this.state.ok ? null : <div className="sub-title">{translate("fail_reason")}</div> }
                {this.state.ok ? null : <div className="warning-text">{this.state.warning}</div> }

                <div className="btn" onClick={this.onClickReset}>{translate("re_verification")}</div>
            </div>
		</div>);
	}
}*/

import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history'
import translate from "../../common/translate"
import {
    login_account,
    fetch_user_info
} from "../../common/actions"

import Footer from "./footer.comp"

let mapStateToProps = (state)=>{
    return {
        user_info: state.user.info
    }
}

let mapDispatchToProps = {
    login_account,
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
    constructor(){
        super();
        this.state={};
    }

    componentDidMount(){
        (async()=>{
            await window.showIndicator()
            await this.props.fetch_user_info()
            await window.hideIndicator()

            alert("서비스 검수 기간 중입니다. 검수 기간은 2019/02/19 까지로 예정되어 있으며 완료되는 순간 모든 계약 데이터와 계정 정보가 초기화 됩니다.")
        })()
    }

    componentWillReceiveProps(props){
        if(!!props.user_info){
            return history.push("/home")
        }
    }
    
    onClickLogin = async ()=>{
        await window.showIndicator()
        
        if (!this.state.email || !this.state.password) {
            alert(translate("please_check_email_password"));
        } else {
            let resp = await this.props.login_account(this.state.email || "", this.state.password || "")
            if(resp.code == -3){
                alert(translate("re_login_desc_1"))
            } else if(resp.code == -4){
                alert(translate("please_check_email_password"));
            } else if(resp.eems){
                localStorage.setItem("browser_key_virgin", 0);
                history.push("/home")
            } else{
                alert("login error")
            }
        }

        await window.hideIndicator()
    }

    onClickClearBrowserKey = async ()=>{
        await window.showIndicator();
        if (window._confirm(translate("re_login_desc_2"))) { 
            localStorage.removeItem("browser_key");
            localStorage.removeItem("browser_key_virgin");
            alert(translate("browser_auth_is_unlock"));
            this.setState({is_clear_browser_key: true});
        }
        await window.hideIndicator();
    }

    onClickRecoverAccount = async () => {
        await window.showIndicator();
        if (window._confirm(translate("re_login_desc_3"))) {
            localStorage.removeItem("browser_key");
            localStorage.removeItem("browser_key_virgin");
            this.setState({is_clear_browser_key: true});
            history.push("/recover");
        }
        await window.hideIndicator();
    }

    openVerifiedBrowserModal = () => {
        window.openModal("CommonModal", {
            icon:"fas fa-browser",
            title:translate("verified_browser"),
            subTitle:translate("re_login_desc_4"),
            desc:translate("re_login_desc_5"),
        })
    }

    openNotVerifiedBrowserModal = () => {
        window.openModal("BrowserNotVerified", {})
    }

    keyPress = async (e) => {
        if(e.keyCode == 13){
            this.onClickLogin()
        }
    }

   render_new() {
        return (<div className="login-common-page first-login-page">
            <div className="left-logo">
                <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
            </div>
            <div className="container">
                <div className="top">
                    <div className="left">
                        <div className="content1 font5 font-bold">{translate("start_e_contract")}</div>
                        <div className="content2 font0"><i className="fas fa-lock-alt"></i> &nbsp; {translate("connect_browser_title_1")} <u onClick={this.openNotVerifiedBrowserModal}>{translate("connect_browser_title_2")}</u> {translate("connect_browser_title_3")}</div>
                    </div>
                    <div className="right">
                        <div className="content3 font2">
                            {translate("no_verify_desc")}
                        </div>
                    </div>
                </div>
                
                <div className="buttons">
                    <button className="new-already-button" onClick={()=>history.push({pathname:"/register", state:{type:0}})}>
                        <div className="icon"><i className="fas fa-user"></i></div>
                        <div className="nohover">
                            {translate("new_individual_register")}
                            <div className="small">{translate("individual_use")}</div>
                        </div>
                        <div className="yeshover">
                            <div className="big">{translate("new_individual_register")}</div>
                            <div className="small">{translate("individual_use")}</div>
                        </div>
                    </button>
                    <button className="new-already-button" onClick={()=>history.push({pathname:"/register", state:{type:1}})}>
                        <div className="icon"><i className="fas fa-user-tie"></i></div>
                        <div className="nohover">
                            {translate("new_corp_register")}
                            <div className="small">{translate("team_manage_use")}</div>
                        </div>
                        <div className="yeshover">
                            <div className="big">{translate("new_corp_register")}</div>
                            <div className="small">{translate("team_manage_use")}</div>
                        </div>
                    </button>
                    <button className="new-already-button" onClick={()=>history.push("/recover")}>
                        <div className="icon"><i className="fas fa-user-check"></i></div>
                        <div className="nohover">
                            {translate("original_account_login")}
                            <div className="small">&nbsp;</div>
                        </div>
                        <div className="yeshover">
                            <div className="big">{translate("original_account_login")}</div>
                            <div className="small">&nbsp;</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>);
   }

   render_login() {
        return (<div className="login-common-page login-page">
            <div className="left-logo">
                <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
            </div>
            <div className="container">
                <div className="title">{translate("start_e_contract")}</div>
                <div className="desc1"><i className="fas fa-lock-open-alt"></i> &nbsp; {translate("this_browser_was_verificated")}</div>
                <div className="desc2" onClick={this.openVerifiedBrowserModal}>{translate("what_is_verified_browser")}</div>

                <div className="textbox"><input className="common-textbox" id="email" type="email" placeholder={translate("please_input_email")} value={this.state.email || ""} onChange={e=>this.setState({email:e.target.value})}/></div>
                <div className="textbox"><input className="common-textbox" id="password" type="password" placeholder={translate("please_input_password")} value={this.state.password || ""} onKeyDown={this.keyPress} onChange={e=>this.setState({password:e.target.value})}/></div>

                <div className="login-btn" onClick={this.onClickLogin}>{translate("login")}</div>
                <br/>
                <div className="register-btn" onClick={this.onClickClearBrowserKey}>{translate("new_register")}</div>

                <div className="other">
                    <div className="recover-account" onClick={this.onClickRecoverAccount}>
                        {translate("another_account_login")}<br/>
                        {translate("browser_verification_unlock")}
                    </div>
                </div>
            </div>
        </div>);
   }


    render() {
        if(this.props.user_info !== false) {
            return <div />
        }

        return (<div className="maintain">
            {
                (!localStorage.getItem("browser_key") || localStorage.getItem("browser_key_virgin") == true) ? 
                    this.render_new() : this.render_login()  
            }
            <Footer />
        </div>)
    }
}
