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

        await window.hideIndicator()
    }

   keyPress = async(e) => {
      if(e.keyCode == 13){
        this.onClickLogin()
      }
   }

	render() {
        if(this.props.user_info === null){
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
            localStorage.setItem("browser_key_virgin", 0);
                    {localStorage.getItem("browser_key_virgin") == 1 ? [
                                <button tabIndex={1} onClick={()=>history.push("/regist")}> 회원가입 </button>
                    ] : [
                                <button tabIndex={1} onClick={()=>history.push("/recover")}> 다른 계정으로 로그인 하기 </button>,
                                <button tabIndex={2} onClick={()=>history.push("/regist")}> 회원가입 </button>
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
