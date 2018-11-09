import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import {
    recover_account,
    check_join_publickey,
} from "../../common/actions"
import Web3 from "../../common/Web3"

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
        let mnemonic = this.state.mnemonic;
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

    onClickNextBtnAccountInfo = async()=>{
        if(!this.state.user_id){
            return alert("아이디를 입력해주세요!")
        }
        if(this.state.password.length < 6){
            return alert("비밀번호는 최소 6글자입니다.")
        }
        if(this.state.password !== this.state.password2){
            return alert("비밀번호가 일치하지 않습니다.")
        }

        let mnemonic = this.state.mnemonic;
        getBrowserKey(true); // Reset browserkey
        let auth = makeAuth(this.state.user_id, this.state.password);
        let encryptedMasterSeed = makeMnemonic(auth, mnemonic);

        let seed = mnemonicToSeed(mnemonic);
        let masterKeyPublic = SeedToMasterKeyPublic(seed).toString('hex');
        let browserKeyPublic = BrowserKeyBIP32().publicKey.toString('hex');

        await window.showIndicator()
        let resp = await this.props.recover_account(browserKeyPublic, masterKeyPublic, auth.toString('hex'), encryptedMasterSeed);
        await window.hideIndicator()

        if(resp.code == 1){
            localStorage.setItem("browser_key_virgin", 0);
            history.push("/login");
            return alert("이제 기존 계정으로 로그인할 수 있습니다.")
        }else{
            return alert(resp.error)
        }
    }

   keyPress = async(type, e) => {
      if(e.keyCode == 13){
        switch(type) {
            case 0:
                this.onClickInputMnemonic()
                break;
            case 1:
                this.onClickNextBtnAccountInfo()
                break;
        }
      }
   }
    
    render_account(){
        return (<div>
            <div className="page bottom-no-border">
                <div className="column-600">
                    <div className="form-layout">
                        <div className="form-label"> 아이디 </div>
                        <div className="form-input">
                            <input placeholder="아이디를 입력해주세요." value={this.state.user_id || ""} onChange={e=>this.setState({user_id:e.target.value})} />
                        </div>
                        
                        <div className="form-label"> 비밀번호 </div>
                        <div className="form-input">
                            <input type="password" placeholder="비밀번호를 최소 6자리 입력해주세요." value={this.state.password || ""} onChange={e=>this.setState({password:e.target.value})}  />
                        </div>

                        <div className="form-label"> 비밀번호 확인 </div>
                        <div className="form-input">
                            <input type="password" placeholder="입력하신 비밀번호를 다시 입력해주세요." value={this.state.password2 || ""} onChange={e=>this.setState({password2:e.target.value})} onKeyDown={this.keyPress.bind(this, 1)} />
                        </div>

                    </div>
                </div>
            </div>
            <button className="big-friendly-button top-no-border" onClick={this.onClickNextBtnAccountInfo}> 기존 계정으로 로그인 </button>
        </div>)
    }

    render_masterkey(){
        return (<div>
            <div className="page bottom-no-border">
                <div className="column-600">
                    <div className="form-layout">
                        <div className="form-label"> 마스터 키워드 </div>
                        <div className="form-input">
                            <input placeholder="마스터 키워드를 입력해주세요." value={this.state.mnemonic || ""} onChange={e=>this.setState({mnemonic:e.target.value})} />
                        </div>
                    </div>

                    <div className="mid-desc">
                        * 12개의 단어로 이루어진 마스터 키워드를 띄어쓰기로 구분하여 입력해주세요.
                    </div>
                </div>
            </div>
            <button className="big-friendly-button top-no-border" onClick={this.onClickInputMnemonic}> 다음 </button>
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
		return (<div className="default-page register-page">
            <div className="logo">
                <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
            </div>
            <div className="back-key">
                <div className="round-btn" onClick={this.goBack}><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
                <h1>다른 계정으로 로그인하기</h1>
                {this.render_content()}
            </div>
		</div>);
	}
}
