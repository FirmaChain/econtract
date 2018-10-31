import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import {
    regist_new_account,
} from "../../common/actions"
import Web3 from "../../common/Web3"

import {
    makeAuth,
    makeMnemonic,
    showMnemonic,
    mnemonicToSeed,
    SeedToMasterKeyPublic,
    SeedToMasterKeyPublicContract,
    SeedToEthKey,
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
    regist_new_account,
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

    onClickNextBtnAccountInfo = async()=>{
        if(!this.state.user_id){
            return alert("아이디를 입력해주세요!")
        }
        if(this.state.password.length < 5){
            return alert("비밀번호는 최소 6글자입니다.")
        }
        if(this.state.password !== this.state.password2){
            return alert("비밀번호 다시입력과 다릅니다.")
        }

        this.setState({
            step: this.state.step+1
        })
    }

    onClickFinishSortTest = async()=>{
        if(this.state.sort_test.map(e=>this.state.mnemonic.split(" ")[e]).join(" ") !== this.state.mnemonic){
            return alert("순서가 맞지 않습니다. 다시 한번 확인해주세요!")
        }
        
        let info = {
            email: this.state.email,
            username: this.state.username,
            userphone: this.state.userphone,
            useraddress: this.state.useraddress,
        }

        let keyPair = SeedToEthKey(this.state.account.seed, "0'/0/0");
        let privateKey = "0x"+keyPair.privateKey.toString('hex');

        let wallet = Web3.walletWithPK(privateKey)
        console.log(wallet)
        let encryptedInfo = aes_encrypt(JSON.stringify(info), this.state.account.masterKeyPublic);
        
        await window.showIndicator()
        let resp = await this.props.regist_new_account(this.state.account, encryptedInfo, this.state.email, this.state.username, wallet.address)
        await window.hideIndicator()

        if(resp.code == 1){
            history.push("/login");
            return alert("회원가입에 성공하였습니다.")
        }else{
            return alert(resp.error)
        }
    }

   keyPress = async(type, e) => {
      if(e.keyCode == 13){
        switch(type) {
            case 0:
                break;
            case 1:
                this.onClickNextBtnAccountInfo()
                break;
        }
      }
   }
    
    render_account(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> ID </div>
                    <div className="form-input">
                        <input placeholder="ID를 입력해주세요." value={this.state.user_id || ""} onChange={e=>this.setState({user_id:e.target.value})} />
                    </div>
                    
                    <div className="form-label"> 비밀번호 </div>
                    <div className="form-input">
                        <input type="password" placeholder="비밀번호를 입력해주세요." value={this.state.password || ""} onChange={e=>this.setState({password:e.target.value})}  />
                    </div>

                    <div className="form-label"> 비밀번호 확인 </div>
                    <div className="form-input">
                        <input type="password" placeholder="입력하신 비밀번호를 다시 입력해주세요." value={this.state.password2 || ""} onChange={e=>this.setState({password2:e.target.value})} onKeyDown={this.keyPress.bind(this, 1)} />
                    </div>

                    <div className="form-submit">
                        <button className="border" onClick={this.onClickNextBtnAccountInfo}> 다음 </button>
                    </div>
                </div>
            </div>
        </div>)
    }

    render_masterkey(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 마스터 키워드 </div>
                    <div className="form-textarea masterkey-list">
                        {this.state.mnemonic.split(" ").map((e,k)=>{
                            return <div key={k} className="masterkey-item">{e}</div>
                        })}
                    </div>
                    
                    <div className="form-submit">
                        <button className="border" onClick={this.next_term}> 다음 </button>
                    </div>
                </div>
            </div>
        </div>)
    }

    render_content(){
        if(this.state.step == 0){
            return this.render_account();
        }else if(this.state.step == 1){
            return this.render_masterkey();
        }
    }

	render() {
		return (<div className="default-page regist-page">
            <div className="logo">
                <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
            </div>
            <div className="back-key">
                <div className="round-btn" onClick={this.goBack}><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
                <h1>개인 회원가입</h1>
                {this.render_content()}
            </div>
		</div>);
	}
}
