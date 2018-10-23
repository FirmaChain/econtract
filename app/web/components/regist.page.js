import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import {
    request_email_verification_code,
    check_email_verification_code,
    request_phone_verification_code,
    check_phone_verification_code,
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
    request_email_verification_code,
    check_email_verification_code,
    request_phone_verification_code,
    check_phone_verification_code,
    regist_new_account,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            step:0,
            step1:0,
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

    onClickRequestEmail =  async()=>{
        if(!this.state.email)
            return alert("이메일을 입력해주세요!")

        await window.showIndicator();
        let resp = await this.props.request_email_verification_code(this.state.email)
        if(resp == 1){
            alert("이메일이 발송되었습니다!")
            this.setState({
                step1:1
            })
        }else if(resp == -1){
            alert("이미 가입 된 이메일입니다!")
        }else{
            alert("인증코드 전송에 문제가 생겼습니다! 이메일을 정확히 기입해주세요.\n계속 문제가 발생할 경우 관리자에게 문의해주세요.")
        }
        await window.hideIndicator();
    }

    onClickVerificateEmail = async()=>{
        if(this.state.verification_code == null || this.state.verification_code.length !=4){
            return alert('인증코드는 4자리입니다.')
        }

        await window.showIndicator();
        let resp = await this.props.check_email_verification_code(this.state.email, this.state.verification_code)
        if(resp == 1){
            this.setState({
                step: this.state.step+1
            })
        }else{
            alert("잘못된 인증코드입니다.")
        }
        await window.hideIndicator();
    }

    onClickRequestPhone = async()=>{
        if(this.state.userphone == null || this.state.userphone.length != 13)
            return alert("전화번호를 정확히 입력해주세요!")
            
        await window.showIndicator();
        let resp = await this.props.request_phone_verification_code(this.state.userphone)
        if(resp == 1){
            alert("인증 코드가 발송되었습니다!")
            this.setState({
                phone_verification_code_sent:true
            })
        }else{
            alert("인증코드 전송에 문제가 생겼습니다!\n계속 문제가 발생할 경우 관리자에게 문의해주세요.")
        }
        await window.hideIndicator();
    }

    onClickVerificatePhone = async()=>{
        if(this.state.phone_verification_code == null || this.state.phone_verification_code.length !=4){
            return alert('인증코드는 4자리입니다.')
        }
        await window.showIndicator();
        let resp = await this.props.check_phone_verification_code(this.state.userphone, this.state.phone_verification_code)
        if(resp == 1){
            alert("정상적으로 인증되었습니다.")
            this.setState({
                verificated_phone:true
            })
        }else{
            alert("잘못된 인증코드입니다.")
        }
        await window.hideIndicator();
    }

    onChangePhoneForm = async(name, e)=>{
        let text = e.target.value;
        text = text.replace(/-/g,"")
        if(text.length >= 8){
            text = `${text.slice(0,3)}-${text.slice(3,7)}-${text.slice(7,11)}`
        }else if(text.length >= 4){
            text = `${text.slice(0,3)}-${text.slice(3,7)}`
        }else{
            text = `${text.slice(0,3)}`
        }
        
        this.setState({
            [name]:text
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

    onClickFindAddress = async()=>{
        await window.showIndicator()
        let address = await new Promise(r=>daum.postcode.load(function(){
            new daum.Postcode({
                oncomplete: r,
                onclose:r
            }).open();
        }));

        this.setState({
            useraddress: address.roadAddress+ " "
        })
        await window.hideIndicator()
    }

    onClickCreateEth = async()=>{
        let account = Web3.createAccount()
        this.setState({
            user_eth_pk:account.privateKey
        })
    }

    onClickNextBtnUserInfo = async()=>{
        if(!this.state.username)
            return alert("이름을 작성해주세요.")
        if(!this.state.verificated_phone)
            return alert("핸드폰 인증을 해주세요.")
        if(!this.state.useraddress)
            return alert("주소를 입력해주세요.")
        if(!this.state.user_eth_pk)
            return alert("이더리움 프라이빗키를 입력해주세요.")

        let wallet = Web3.walletWithPK(this.state.user_eth_pk)
        if(!wallet){
            return alert("이더리움 프라이빗키가 잘못되었습니다.")
        }

        let account = new_account(this.state.user_id, this.state.password);
        this.setState({
            step:this.state.step + 1,
            account:account,
            mnemonic:account.rawMnemonic,
        })
    }

    onClickSaveMnemonic = ()=>{
        let blob = new Blob([this.state.mnemonic], { type: 'text/plain' })
        let anchor = document.createElement('a');

        anchor.download = "Seed.txt";
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        anchor.click();
    }

    onClickSortTest = (e)=>{
        let sort_test = [...this.state.sort_test]
        let idx = sort_test.indexOf(e)
        if( idx >= 0 ){
            sort_test.splice(idx,1)
        }else{
            sort_test.push(e)
        }

        this.setState({
            sort_test:sort_test
        })
    }

    onClickFinishSortTest = async()=>{
        if(this.state.sort_test.map(e=>this.state.mnemonic.split(" ")[e]).join(" ") !== this.state.mnemonic){
            return alert("순서가 맞지 않습니다. 다시 한번 확인해주세요!")
        }
        
        let info = {
            email: this.state.email,
            user_id : this.state.user_id,
            password: this.state.password,
            username: this.state.username,
            userphone: this.state.userphone,
            useraddress: this.state.useraddress,
            eth_pk: this.state.user_eth_pk
        }
        let wallet = Web3.walletWithPK(this.state.user_eth_pk)
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
                this.onClickVerificateEmail()
                break;
            case 1:
                this.onClickNextBtnAccountInfo()
                break;
        }
      }
   }
    
    render_term(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 서비스 이용약관 </div>
                    <div className="form-textarea">
                    </div>
                    
                    <div className="form-label"> 개인정보취급방침 </div>
                    <div className="form-textarea">
                    </div>

                    <div className="form-submit">
                        <button className="border" onClick={this.next_term}> 동의 </button>
                    </div>
                </div>
            </div>
        </div>)
    }
    
    render_email(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 이메일 인증 </div>
                    <div className="form-input">
                        <input placeholder="이메일을 입력해주세요." 
                               value={this.state.email || ""} 
                               onChange={e=>this.setState({email:e.target.value})}
                               disabled={this.state.step1 == 1} />
                    </div>

                    {this.state.step1 == 1 ? [
                        <div key={0} className="form-label"> 이메일 인증번호 </div>,
                        <div className="form-input" key={1}>
                            <input placeholder="이메일로 발송된 인증번호를 적어주세요." 
                                   value={this.state.verification_code || ""}
                                   onKeyDown={this.keyPress.bind(this, 0)}
                                   onChange={e=>this.setState({verification_code:e.target.value})} />
                        </div>
                    ] : null }

                    <div className="form-submit">
                        { this.state.step1 == 1 ?
                            <button className="border" onClick={this.onClickVerificateEmail}> 확인 </button> : 
                            <button className="border" onClick={this.onClickRequestEmail}> 인증 메일 보내기 </button>
                        }
                    </div>
                </div>
            </div>
        </div>)
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

    render_personal(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 이메일 </div>
                    <div className="form-input">
                        {this.state.email}
                    </div>
                    
                    <div className="form-label"> 이름 </div>
                    <div className="form-input">
                        <input placeholder="이름을 입력해주세요." value={this.state.username || ""} onChange={e=>this.setState({username:e.target.value})} />
                    </div>

                    <div className="form-label"> 휴대폰 </div>
                    <div className="form-input">
                        <input placeholder="휴대폰" 
                               value={this.state.userphone || ""} 
                               onChange={this.onChangePhoneForm.bind(this,"userphone")}
                               disabled={this.state.phone_verification_code_sent} />
                        <button onClick={this.onClickRequestPhone} style={this.state.phone_verification_code_sent ? {"display":"none"}: null}>전송</button>
                    </div>

                    <div className="form-label"> 인증번호 </div>
                    <div className="form-input">
                        <input placeholder="인증번호를 입력해주세요." 
                               value={this.state.phone_verification_code || ""} 
                               onChange={e=>this.setState({phone_verification_code:e.target.value})} 
                               disabled={this.state.verificated_phone} />
                        <button onClick={this.onClickVerificatePhone} style={this.state.verificated_phone ? {"display":"none"}: null}>확인</button>
                    </div>

                    <div className="form-label"> 주소 </div>
                    <div className="form-input">
                        <input placeholder="주소를 입력해주세요." value={this.state.useraddress || ""} onChange={e=>this.setState({useraddress:e.target.value})} />
                        <button onClick={this.onClickFindAddress}>검색</button>
                    </div>

                    <div className="form-label"> 롭스텐 이더리움 프라이빗 키 </div>
                    <div className="form-input">
                        <input placeholder="기존 보유하고 계신 키값을 입력해주세요." value={this.state.user_eth_pk || ""} onChange={e=>this.setState({user_eth_pk:e.target.value})}/>
                        <button onClick={this.onClickCreateEth}>생성</button>
                    </div>
                    <div className="form-warning">
                        * 롭스텐 이더리움을 전송받기 위해 필요합니다.
                        보유하고 계신 키가 없다면 [생성] 버튼을 눌러 
                        생성하시면 됩니다.
                    </div>

                    <div className="form-submit">
                        <button className="border" onClick={this.onClickNextBtnUserInfo}> 다음 </button>
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
                        <div className="copy" onClick={this.onClickSaveMnemonic}>저장</div>
                    </div>
                    
                    <div className="form-submit">
                        <button className="border" onClick={this.next_term}> 다음 </button>
                    </div>
                </div>
            </div>
            <div className="column-300">
                <div className="right-desc">
                    * 전체 계약 잠금 해제시에 필요한 마스터 키워드입니다. 브라우저 및 기기 변경시 보안을 위해 접속하신 기기에서는 잠금 상태로 계약이 로드됩니다. 이전 해제 기록이 있는 계약이라면 해당 키워드를 사용해 일괄 해제 가능합니다.
                </div>
                <div className="right-desc">
                    해당 키워드를 서면으로 옮겨 적어 저장하셔서 필요시에 사용하시기 바랍니다. 안전한 계정 보안을 위해 전자매체에 저장, 타인에게 양도 등의 행위를 일체 권장하지 않습니다.
                </div>
            </div>
        </div>)
    }

    render_confirm_masterkey(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 마스터 키워드 확인 </div>
                    <div className="form-textarea masterkey-selection-list">
                        {this.state.sort_test.map((e,k)=>{
                            return <div className="item selected" key={k}>{this.state.mnemonic.split(" ")[e]}</div>
                        })}
                    </div>

                    <div className="masterkey-selection-list">
                        {this.state.mnemonic.split(" ").map((e,k)=>{
                            return <div key={k} 
                                        className={`item ${this.state.sort_test.indexOf(k) >= 0 ? "selected" : ""}`}
                                        onClick={this.onClickSortTest.bind(this,k)}
                                    >
                                {e}
                            </div>
                        })}
                    </div>
                    
                    <div className="form-submit">
                        <button className="border" onClick={this.onClickFinishSortTest}> 다음 </button>
                    </div>
                </div>
            </div>
            <div className="column-300">
                <div className="right-desc">
                    * 앞서 저장해둔 마스터 키워드를 차례대로 배치해 주세요
                </div>
            </div>
        </div>)
    }

    render_content(){
        if(this.state.step == 0){
            return this.render_term();
        }else if(this.state.step == 1){
            return this.render_email();
        }else if(this.state.step == 2){
            return this.render_account();
        }else if(this.state.step == 3){
            return this.render_personal();
        }else if(this.state.step == 4){
            return this.render_masterkey();
        }else if(this.state.step == 5){
            return this.render_confirm_masterkey();
        }
        
    }

	render() {
		return (<div className="default-page regist-page">
            <div className="back-key">
                <div className="round-btn" onClick={this.goBack}><i className="fas fa-arrow-left"></i></div>
                <div className="step-indicator">
                    <div className={`item ${this.state.step == 0 ? "enable": ""}`}>약관동의</div>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 1 ? "enable": ""}`}>이메일 인증</div>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 2 ? "enable": ""}`}>개인정보 입력</div>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 3 ? "enable": ""}`}>회원정보 입력</div>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 4 || this.state.step == 5 ? "enable": ""}`}>마스터 키워드 발급</div>
                </div>
            </div>
            <div className="container">
                <h1>개인 회원가입</h1>
                {this.render_content()}
            </div>
		</div>);
	}
}
