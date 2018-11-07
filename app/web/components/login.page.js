import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history'
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
            alert("아이디와 비밀번호를 입력해주세요.");
        } else {
            let resp = await this.props.login_account(this.state.user_id || "", this.state.password || "")
            if(resp == -2){
                alert("회원가입 되어 있지 않은 브라우저입니다.")
            }else if(resp == -1){
                alert("아이디 혹은 패스워드가 다릅니다.")
            }else if(resp.eems){
                history.push("/recently")
            }else{
                alert("login error;")
            }
        }

        await window.hideIndicator()
    }

    onClickClearBrowserKey = async()=>{
        await window.showIndicator();
        if (window._confirm("브라우저 인증을 해제하면 기존의 아이디와 비밀번호로 로그인할 수 없습니다.\n브라우저 인증을 해제 하시겠습니까?")) {
            localStorage.removeItem("browser_key");
            localStorage.removeItem("browser_key_virgin");
            alert("브라우저 인증이 해제되었습니다.");
            this.setState({is_clear_browser_key: true});
        }
        await window.hideIndicator();
    }

    onClickRecoverAccount = async() => {
        await window.showIndicator();
        if (window._confirm("다른 계정으로 로그인하기 전에 먼저 브라우저 인증을 해제해야 합니다.\n\n브라우저 인증을 해제하면 기존의 아이디와 비밀번호로 로그인할 수 없습니다.\n브라우저 인증을 해제 하시겠습니까?")) {
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

	render() {
        if(this.props.user_info !== false) {
            return <div />
        }

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
                    <div className="column-300">
                        <div className="form-layout">
                            <div className="form-label"> ID </div>
                            <div className="form-input">
                                <input placeholder="ID를 입력해주세요." value={this.state.user_id || ""} onChange={e=>this.setState({user_id:e.target.value})} />
                            </div>
                            
                            <div className="form-label"> 비밀번호 </div>
                            <div className="form-input">
                                <input type="password" placeholder="비밀번호를 입력해주세요." value={this.state.password || ""} onKeyDown={this.keyPress} onChange={e=>this.setState({password:e.target.value})} />
                            </div>

                            <div className="form-submit">
                                {!localStorage.getItem("browser_key") || localStorage.getItem("browser_key_virgin") == 1 ? [
                                    <button key={1} tabIndex={1} onClick={()=>history.push("/recover")}> 다른 계정으로 로그인 하기 </button>,
                                    <button key={2} tabIndex={1} onClick={()=>history.push("/register")}> 회원가입 </button>
                                ] : [
                                    <button key={1} tabIndex={1} onClick={this.onClickRecoverAccount}> 다른 계정으로 로그인 하기 </button>,
                                    <button key={2} tabIndex={2} onClick={this.onClickClearBrowserKey}> 브라우저 인증 해제하기 </button>
                                ]}
                                <button className="border" onClick={this.onClickLogin}> 로그인 </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>);
	}
}
