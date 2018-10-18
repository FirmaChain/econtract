import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
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

	render() {
        if(this.props.user_info === null){
            return <div />
        }

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