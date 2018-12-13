import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import {
    recover_account,
    check_join_publickey,
} from "../../common/actions"
import Web3 from "../../common/Web3"

import Footer from "./footer.comp"

import {
    makeAuth,
    makeMnemonic,
    mnemonicToSeed,
    getBrowserKey,
    SeedToMasterKeyPublic,
    BrowserKeyBIP32,
    validateMnemonic,
} from "../../common/crypto_test"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = {
    recover_account,
    check_join_publickey,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            step:0,
            sort_test:[]
        };
	}

	componentDidMount(){
    }

    goBack = ()=>{
        if(this.state.step == 0){
            history.goBack()
        }else{
            this.setState({
                step: this.state.step -1
            })
        }
    }

    next_term = ()=>{
        this.setState({
            step: this.state.step+1
        })
    }

    onClickInputMnemonic = async() => {
        let mnemonic = this.state.mnemonic.trim();
        if (!mnemonic) {
            return alert("마스터 키워드를 입력해주세요.");
        }
        if (!validateMnemonic(mnemonic)) {
            return alert("유효하지 않은 마스터 키워드입니다.");
        }
        let seed = mnemonicToSeed(mnemonic);
        let masterKeyPublic = SeedToMasterKeyPublic(seed);

        await window.showIndicator();
        let resp = await this.props.check_join_publickey(masterKeyPublic.toString('hex'));
        if(resp){
            this.setState({
                step: this.state.step+1
            });
        }else{
            alert("일치하는 계정이 없습니다. 새로 가입해주세요.");
        }
        await window.hideIndicator();
        return;
    };

    onClickRecoverMyAccount = async()=>{
        if(!this.state.email){
            return alert("이메일을 입력해주세요!")
        }
        if(this.state.password.length < 8){
            return alert("비밀번호는 최소 8글자입니다.")
        }
        if(this.state.password !== this.state.password2){
            return alert("비밀번호가 일치하지 않습니다.")
        }

        let mnemonic = this.state.mnemonic.trim();
        getBrowserKey(true); // Reset browserkey
        let auth = makeAuth(this.state.email, this.state.password);
        let encryptedMasterSeed = makeMnemonic(auth, mnemonic);

        let seed = mnemonicToSeed(mnemonic);
        let masterKeyPublic = SeedToMasterKeyPublic(seed).toString('hex');
        let browserKeyPublic = BrowserKeyBIP32().publicKey.toString('hex');

        await window.showIndicator()
        let resp = await this.props.recover_account(browserKeyPublic, masterKeyPublic, auth.toString('hex'), encryptedMasterSeed, this.state.email);
        await window.hideIndicator()

        if(resp.code == 1){
            localStorage.setItem("browser_key_virgin", 0);
            history.push("/login");
            return alert("이제 기존 계정으로 로그인할 수 있습니다.")
        } else if(resp.code == -3) {
            return alert("일치하는 계정 정보가 없습니다.")
        } else {
            return alert(resp.error)
        }
    }

    openWhyMasterkeywordReInputModal = () => {
        window.openModal("CommonModal", {
            icon:"fal fa-lock-alt",
            title:"마스터 키워드 입력",
            subTitle:"미인증된 브라우저에 로그인을 할려면 기존 마스터 키워드가 필요합니다.",
            desc:`브라우저상에 저장되는 마스터 키워드는 브라우저 인증외에도 기존 계약 내용을 불러오는 기능이 있습니다.<br/><br/>
미인증된 브라우저에 기존 마스터 키워드를 입력하면 이전 브라우저에서 사용하던 계약을 그대로 사용하실 수 있습니다.`
        })
    }

    keyPress = async(type, e) => {
        if(e.keyCode == 13){
            switch(type) {
                case 0:
                this.onClickInputMnemonic()
                break;
                case 1:
                this.onClickRecoverMyAccount()
                break;
            }
        }
    }

    render_masterkey(){
        return (<div className="page">
            <div className="title-container">
                <div className="title">마스터키워드 입력하기</div>
                <div className="desc">로그인하려는 계정의 마스터키워드를 정확하게 입력해주시기 바랍니다.</div>
            </div>
            <div className="content">
                <div className="master-keyword-container">
                    <div className="sub-title-container">
                        <div className="title">마스터키워드</div>
                        <div className="what-is-masterkeyword" onClick={this.openWhyMasterkeywordReInputModal}>마스터키워드를 다시 입력하는 이유는?</div>
                    </div>

                    <textarea className="masterkeyword-input-slot"
                        placeholder="마스터 키워드를 입력해주세요."
                        value={this.state.mnemonic || ""}
                        onKeyDown={this.keyPress.bind(this, 0)}
                        onChange={e=>this.setState({mnemonic:e.target.value.replace(/\r\n|\r|\n|<br>/g, " ")})}></textarea>

                    <div className="reference">
                        * 12개의 단어로 이루어진 마스터 키워드를 띄어쓰기로 구분하여 입력해주세요.
                    </div>
                </div>

                <div className="bottom-container">
                    <div className="confirm-button" onClick={this.onClickInputMnemonic}>
                        다음
                    </div>
                </div>
            </div>
        </div>)
    }
    
    render_account(){
        return (<div className="page">
            <div className="title-container">
                <div className="title">비밀번호 설정</div>
                <div className="desc">로그인하려는 계정의 이메일과 비밀번호를 입력하여 브라우저에 등록해주세요.</div>
            </div>
            <div className="content">

                <div className="text-place">
                    <div className="name">등록한 이메일</div>
                    <div className="textbox">
                        <input className="common-textbox" type="text"
                            value={this.state.email || ""}
                            onChange={e=>this.setState({email:e.target.value})}
                            placeholder="가입하신 계정의 이메일을 입력해주세요."/>
                    </div>
                </div>

                <div className="text-place">
                    <div className="name">비밀번호</div>
                    <div className="textbox">
                        <input className="common-textbox" type="password"
                            value={this.state.password || ""}
                            onChange={e=>this.setState({password:e.target.value})}
                            placeholder="최소 8자리(영어, 숫자, 특수문자 사용 가능)"/>
                    </div>
                </div>

                <div className="text-place">
                    <div className="name">비밀번호 확인</div>
                    <div className="textbox">
                        <input className="common-textbox" type="password"
                            value={this.state.password2 || ""}
                            onChange={e=>this.setState({password2:e.target.value})}
                            onKeyDown={this.keyPress.bind(this, 1)}
                            placeholder="입력하신 패스워드를 다시 입력해주세요"/>
                    </div>
                </div>

                <div className="bottom-container">
                    <div className="confirm-button" onClick={this.onClickRecoverMyAccount}>
                        기존 계정으로 로그인
                    </div>
                </div>
            </div>
        </div>)
    }

    render_content(){
        if(this.state.step == 0){
            return this.render_masterkey();
        }else if(this.state.step == 1){
            return this.render_account();
        }
    }

	render() {
		return (<div className="maintain">
            <div className="register-common-page register-page">
                <div className="left-logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/login")}/>
                </div>
                <div className="desc-container">
                    <div className="info">
                        <div className="step-indicator">
                            <div className={`item ${this.state.step == 0 ? "enable": ""}`}>마스터키워드 입력</div>
                            <div className={`item ${this.state.step == 1 ? "enable": ""}`}>비밀번호 설정</div>
                        </div>
                    </div>
                    <div className="desc">
                        {this.render_content()}
                    </div>
                </div>
            </div>

            <Footer />
        </div>);
	}
}
