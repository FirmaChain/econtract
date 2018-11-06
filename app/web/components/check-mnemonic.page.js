import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history'
import {
    get_mnemonic,
    fetch_user_info
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    get_mnemonic,
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            step:0,
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
    }
    
    onClickLogin = async()=>{
        await window.showIndicator()
        
        if (!this.state.user_id || !this.state.password) {
            alert("아이디와 비밀번호를 입력해주세요.");
        } else {
            let resp = await this.props.get_mnemonic(this.state.user_id || "", this.state.password || "");
            if (resp) {
                this.setState({
                    step: 1,
                    mnemonic: resp,
                });
            } else {
                alert("마스터 키워드를 조회할 수 없습니다.");
            }
        }

        await window.hideIndicator()
    }

    onClickOK = async()=>{
        history.push("/login");
    }

    onClickSaveMnemonic = ()=>{
        let anchor = document.createElement('a');
        anchor.target = "_blank";
        anchor.href = "/static/recovery_phrase_document.pdf";
        anchor.click();
    }

    render_content() {
        if(this.state.step == 0){
            return this.render_login();
        }else if(this.state.step == 1){
            return this.render_masterkey();
        }
    }

    render_login() {
		return (
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
                                <button key={2} tabIndex={1} onClick={()=>history.push("/regist")}> 회원가입 </button>
                            ] : [
                                <button key={1} tabIndex={1} onClick={this.onClickRecoverAccount}> 다른 계정으로 로그인 하기 </button>,
                                <button key={2} tabIndex={2} onClick={this.onClickClearBrowserKey}> 브라우저 인증 해제하기 </button>
                            ]}
                            <button className="border" onClick={this.onClickLogin}> 로그인 </button>
                        </div>
                    </div>
                </div>
            </div>
        );


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
                        <div className="copy" onClick={this.onClickSaveMnemonic}>저장 양식 다운로드</div>
                    </div>
                    
                    <div className="form-submit">
                        <button className="border" onClick={this.onClickOK}> 확인 </button>
                    </div>
                </div>
            </div>
        </div>)
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
                <h1>마스터 키워드 확인</h1>
                {this.render_content()}
            </div>
		</div>);
	}
}
