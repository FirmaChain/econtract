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
            return history.push("/recently")
        }
    }
    
    onClickLogin = async()=>{
        await window.showIndicator()
        
        if (!this.state.user_id || !this.state.password) {
            alert("아이디와 비밀번호를 확인해주세요.");
        } else {
            let resp = await this.props.login_account(this.state.user_id || "", this.state.password || "")
            if(resp == -2){
                alert("해당 기기에 연결된 계정 정보가 존재하지 않습니다.\n현재 기기에 인증이 필요할 경우 [다른 계정으로 로그인] 기능을 사용해 주세요.")
            }else if(resp == -1){
                alert("아이디와 비밀번호를 확인해주세요.");
            }else if(resp.eems){
                localStorage.setItem("browser_key_virgin", 0);
                history.push("/recently")
            }else{
                alert("login error;")
            }
        }

        await window.hideIndicator()
    }

    onClickClearBrowserKey = async()=>{
        await window.showIndicator();
        if (window._confirm("기기 인증 해제 후 기존의 계정으로 다시 로그인 하려면 [다른 계정으로 로그인] 과정을 거쳐야 하며,\n이 때 마스터 키워드가 필요합니다.\n기기 인증을 해제 하시겠습니까?")) { 
            localStorage.removeItem("browser_key");
            localStorage.removeItem("browser_key_virgin");
            alert("브라우저 인증이 해제되었습니다.");
            this.setState({is_clear_browser_key: true});
        }
        await window.hideIndicator();
    }

    onClickRecoverAccount = async() => {
        await window.showIndicator();
        if (window._confirm("다른 계정으로 로그인하기 전에 먼저 기기 인증을 해제해야 합니다.\n\n기기 인증 해제 후 기존의 계정으로 다시 로그인 하려면 [다른 계정으로 로그인] 과정을 거쳐야 하며,\n이 때 마스터 키워드가 필요합니다.\n기기 인증을 해제 하시겠습니까?")) {
            localStorage.removeItem("browser_key");
            localStorage.removeItem("browser_key_virgin");
            this.setState({is_clear_browser_key: true});
            history.push("/recover");
        }
        await window.hideIndicator();
    }

   keyPress = async(e) => {
      if(e.keyCode == 13){
        this.onClickLogin()
      }
   }

   render_new() {
		return (<div className="default-page register-page">
            <div className="logo">
                <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
            </div>
            <div className="back-key">
                <div className="round-btn" onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
            <h1>시작하기</h1>
                <div className="page">
                    <div className="column-400">
                    <div className="no-login-mid-desc">
                        서비스를 처음 시작하거나, 접속한 기기가 인증되지 않은 상태일 경우<br/>
                        아래의 방법으로 서비스를 시작할 수 있습니다.
                    </div>
                    <button className="new-already-button new-img" onClick={()=>history.push("/register")}>
                        <div></div>
                        <br/>
                        회원가입하기
                    </button>
                    <button className="new-already-button already-img" onClick={()=>history.push("/recover")}>
                        <div></div>
                        <br/>
                        기존 계정으로 로그인하기
                    </button>
                    </div>
                </div>
            </div>
		</div>);
   }

   render_login() {
		return (<div className="default-page login-page">
            <div className="logo">
                <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
            </div>
            <div className="back-key">
                <div className="round-btn" onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
            <h1>로그인</h1>
                <div className="page">
                    <div className="column-400">
                        <div className="form-layout">
                            <div className="form-label"> 아이디 </div>
                            <div className="form-input">
                                <input placeholder="아이디를 입력해주세요." value={this.state.user_id || ""} onChange={e=>this.setState({user_id:e.target.value})} />
                            </div>
                            
                            <div className="form-label"> 비밀번호 </div>
                            <div className="form-input">
                                <input type="password" placeholder="비밀번호를 입력해주세요." value={this.state.password || ""} onKeyDown={this.keyPress} onChange={e=>this.setState({password:e.target.value})} />
                            </div>

                            <div className="form-submit">
                                <button key={1} tabIndex={1} onClick={this.onClickRecoverAccount}> 다른 계정으로 로그인 하기 </button>
                                <button key={2} tabIndex={2} onClick={this.onClickClearBrowserKey}> 기기 인증 해제하기 </button>
                                <button className="border" onClick={this.onClickLogin}> 로그인 </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>);
   }

	render() {
        if(this.props.user_info !== false) {
            return <div />
        }

        if (!localStorage.getItem("browser_key") || localStorage.getItem("browser_key_virgin") == 1) {
            return this.render_new();
        } else {
            return this.render_login();
        }
	}
}
