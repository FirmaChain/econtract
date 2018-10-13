import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import {
    login_account
} from "../../common/actions"

import {
    makeAuth,
    makeMnemonic,
    showMnemonic,
    mnemonicToSeed,
    SeedToMasterKeyPublic,
    BrowserKeyBIP32,
    makeSignData,
    aes_encrypt,
    ecdsa_verify,
    new_account
} from "../../common/crypto_test"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = {
    login_account
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
    }
    
    onClickLogin = async()=>{
        await window.showIndicator()
        
        let nonce = Date.now();
        let auth = makeAuth(this.state.user_id || "", this.state.password || "");
        let sign = makeSignData("FirmaChain Login", auth, nonce);

        let resp = await this.props.login_account(sign.publicKey,nonce,sign.payload)
        if(resp == -2){
            alert("회원가입 되어 있지 않은 브라우저입니다.")
        }else if(resp == -1){
            alert("아이디 혹은 패스워드가 다릅니다.")
        }else{
            window.setCookie("session", resp.session, 365)
            history.push("/contracts")
        }

        await window.hideIndicator()
    }

	render() {
		return (<div className="default-page login-page">
            <div className="back-key" onClick={()=>history.goBack()}>
                <div className="round-btn"><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
                <h1>로그인</h1>
                <div className="page">
                    <div className="column-300">
                        <div className="form-layout">
                            <div className="form-label"> ID </div>
                            <div className="form-input">
                                <input placeholder="ID를 입력해주세요." value={this.state.user_id || ""} onChange={e=>this.setState({user_id:e.target.value})} />
                            </div>
                            
                            <div className="form-label"> 비밀번호 </div>
                            <div className="form-input">
                                <input type="password" placeholder="비밀번호를 입력해주세요." value={this.state.password || ""} onChange={e=>this.setState({password:e.target.value})} />
                            </div>

                            <div className="form-submit">
                                <button tabIndex={1} onClick={()=>history.push("/regist")}> 회원가입 </button>
                                <button className="border" onClick={this.onClickLogin}> 로그인 </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>);
	}
}