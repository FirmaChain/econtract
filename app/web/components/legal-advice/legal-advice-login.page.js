import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../../history'
import translate from "../../../common/translate"
import {
    getNewBrowserKey,
} from "../../../common/crypto_test"
import {
    login_account,
    login_2fa_otp_auth,
    fetch_user_info
} from "../../../common/actions"

import Footer from "../footer.comp"
import CheckBox3 from "../checkbox3"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    login_account,
    login_2fa_otp_auth,
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            email:"",
            password:"",
            continue_login:true,
        };
	}

	componentDidMount(){
        (async()=>{
            await window.showIndicator()
            await this.props.fetch_user_info()
            await window.hideIndicator()
        })()
    }

    componentWillReceiveProps(props){
        if(!!props.user_info){
            return history.replace("/legal-advice/home")
        }
    }
    
    render() {
        return <div className="legal-advice-login legal-advice-maintain">
            <div className="container">
                <div className="logo"><img src="/static/anycase.png" /></div>

                <div className="text-place">
                    <div className="title">{translate("email")}</div>
                    <div className="text-box">
                        <input type="text" value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}}/>
                    </div>
                </div>
                <br/>
                <div className="text-place">
                    <div className="title">{translate("password")}</div>
                    <div className="text-box">
                        <input type="password" value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}}/>
                    </div>
                </div>

                <div className="continue-login">
                    <CheckBox3 on={this.state.continue_login}
                        size={24}
                        onClick={()=>this.setState({continue_login:!this.state.continue_login})}
                        text="로그인 유지"/>
                </div>

                <div className="login-button">로그인</div>

                <div className="sub">
                    <div className="register">회원가입하기</div>
                    <div className="forgot-password"><span>비밀번호</span>를 잊으셨나요?</div>
                </div>

                <div className="sub2">
                    <div>전문가 이신가요? &nbsp;&nbsp;<span>전문가 회원가입하기</span></div>
                </div>
            </div>
            <Footer />
        </div>
    }
}
