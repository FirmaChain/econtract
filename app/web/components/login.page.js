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
            alert("아이디와 비밀번호를 확인해주세요.");
        } else {
            let resp = await this.props.login_account(this.state.email || "", this.state.password || "")
            if(resp == -2){
                alert("해당 기기에 연결된 계정 정보가 존재하지 않습니다.\n현재 기기에 인증이 필요할 경우 [다른 계정으로 로그인] 기능을 사용해 주세요.")
            }else if(resp == -1){
                alert("아이디와 비밀번호를 확인해주세요.");
            }else if(resp.eems){
                localStorage.setItem("browser_key_virgin", 0);
                history.push("/home")
            }else{
                alert("login error;")
            }
        }

        await window.hideIndicator()
    }

    onClickClearBrowserKey = async ()=>{
        await window.showIndicator();
        if (window._confirm("신규 회원가입을 하시려면 브라우저 인증을 해제해야 합니다.\n브라우저 인증 해제 후 기존의 계정으로 다시 로그인 하시려면 [기존 계정으로 로그인] 과정을 거쳐야 하며,\n이 때 마스터 키워드가 필요합니다.\n\n브라우저 인증을 해제 하시겠습니까?")) { 
            localStorage.removeItem("browser_key");
            localStorage.removeItem("browser_key_virgin");
            alert("브라우저 인증이 해제되었습니다.");
            this.setState({is_clear_browser_key: true});
        }
        await window.hideIndicator();
    }

    onClickRecoverAccount = async () => {
        await window.showIndicator();
        if (window._confirm("다른 계정으로 로그인하기 전에 먼저 브라우저 인증을 해제해야 합니다.\n브라우저 인증 해제 후 기존의 계정으로 다시 로그인 하시려면 [기존 계정으로 로그인] 과정을 거쳐야 하며,\n이 때 마스터 키워드가 필요합니다.\n\n브라우저 인증을 해제 하시겠습니까?")) {
            localStorage.removeItem("browser_key");
            localStorage.removeItem("browser_key_virgin");
            this.setState({is_clear_browser_key: true});
            history.push("/recover");
        }
        await window.hideIndicator();
    }

    openVerifiedBrowserModal = () => {
        window.openModal("CommonModal", {
            icon:"fal fa-lock-alt",
            title:"인증된 브라우저",
            subTitle:"E-Contract 서비스는 마스터 키워드를 기반으로 로그인 하실 수 있습니다.",
            desc:`회원가입시 발급되는 마스터 키워드는 해당 계정에 귀속되며, 당시 사용된 브라우저에 자동으로 저장됩니다.<br/><br/>
회원님의 계정은 일치하는 마스터 키워드가 
저장되있는 브라우저에서만 로그인이 가능합니다.<br/><br/>
서비스에 가입한 적이 없다면 [신규 회원가입]을 통해 E-Contract 서비스를 경험해보시길 바랍니다.<br/><br/>
현재 접속해있는 브라우저에 회원님의 마스터 키워드가 저장되어 있지 않은 경우, [다른 계정으로 로그인] 기능을 통해 현재 인증된 계정을 해제하고 회원님의 기존 
마스터 키워드를 사용하여 로그인하실 수 있습니다.`
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
                <div className="content1 font5 font-bold">E-Contract 시작하기</div>
                <div className="content2 font2"><i className="fas fa-lock-alt"></i> &nbsp; 접속하신 브라우저는 미인증 상태입니다.</div>
                <div className="content3 font1" onClick={this.openNotVerifiedBrowserModal}><u>브라우저 미인증이란?</u></div>
                <div className="content4 font3">
                    E-Contract를 처음 시작하거나, 접속된 브라우저가 인증되지 않은 상태일 경우<br/>
                    아래의 방법으로 서비스를 시작할 수 있습니다.
                </div>
                <div className="buttons">
                    <button className="new-already-button" onClick={()=>history.push({pathname:"/register", state:{type:1}})}>
                        <i class="fas fa-user"></i>
                        <br/>
                        신규 일반 회원 가입
                        <div className="small">개인 사용</div>
                    </button>
                    <button className="new-already-button" onClick={()=>history.push({pathname:"/register", state:{type:2}})}>
                        <i class="fas fa-user-tie"></i>
                        <br/>
                        신규 기업 가입
                        <div className="small">팀 관리용</div>
                    </button>
                    <button className="new-already-button" onClick={()=>history.push("/recover")}>
                        <i class="fas fa-user-check"></i>
                        <br/>
                        기존 계정으로 로그인
                        <div className="small">&nbsp;</div>
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
                <div className="title">E-Contract 시작하기</div>
                <div className="desc1"><i className="fas fa-lock-open-alt"></i> &nbsp; 접속하신 브라우저는 인증되었습니다.</div>
                <div className="desc2" onClick={this.openVerifiedBrowserModal}>인증된 브라우저란?</div>

                <div className="textbox"><input className="common-textbox" id="email" type="email" placeholder="이메일을 입력해주세요." value={this.state.email || ""} onChange={e=>this.setState({email:e.target.value})}/></div>
                <div className="textbox"><input className="common-textbox" id="password" type="password" placeholder="비밀번호를 입력해주세요." value={this.state.password || ""} onKeyDown={this.keyPress} onChange={e=>this.setState({password:e.target.value})}/></div>

                <div className="login-btn" onClick={this.onClickLogin}>로그인</div>
                <br/>
                <div className="register-btn" onClick={this.onClickClearBrowserKey}>신규 회원가입</div>

                <div className="other">
                    <div className="recover-account" onClick={this.onClickRecoverAccount}>
                        다른 계정으로 로그인<br/>
                        (브라우저 인증 해제)
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
            <div className="footer">
                <div className="left">Copyright 2018 Firma Solutions, Inc, All right reserved</div>
                <div className="middle">
                    이용약관 | 개인정보처리방침
                </div>
                <div className="right">
                    developer@firma-solutions.com
                </div>
            </div>
        </div>)
	}
}
