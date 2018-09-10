import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            step:0
        };
	}

	componentDidMount(){
    }

    next_term = ()=>{
        this.setState({
            step: this.state.step+1
        })
    }
    
    render_term(){
        return (<div className="page">
            <div className="column">
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
            <div className="column">
                <div className="form-layout">
                    <div className="form-label"> 이메일 인증 </div>
                    <div className="form-input">
                        <input placeholder="이메일을 입력해주세요." />
                    </div>

                    <div className="form-submit">
                        <button className="border" onClick={this.next_term}> 인증 메일 보내기 </button>
                    </div>
                </div>
            </div>
        </div>)
    }

    render_account(){
        return (<div className="page">
            <div className="column">
                <div className="form-layout">
                    <div className="form-label"> ID </div>
                    <div className="form-input">
                        <input placeholder="ID를 입력해주세요." />
                    </div>
                    
                    <div className="form-label"> 비밀번호 </div>
                    <div className="form-input">
                        <input placeholder="비밀번호를 입력해주세요." />
                    </div>

                    <div className="form-label"> 비밀번호 확인 </div>
                    <div className="form-input">
                        <input placeholder="입력하신 비밀번호를 다시 입력해주세요." />
                    </div>

                    <div className="form-submit">
                        <button className="border" onClick={this.next_term}> 다음 </button>
                    </div>
                </div>
            </div>
        </div>)
    }

    render_personal(){
        return (<div className="page">
            <div className="column">
                <div className="form-layout">
                    <div className="form-label"> ID </div>
                    <div className="form-input">
                        <input placeholder="ID를 입력해주세요." />
                    </div>
                    
                    <div className="form-label"> 비밀번호 </div>
                    <div className="form-input">
                        <input placeholder="비밀번호를 입력해주세요." />
                    </div>

                    <div className="form-label"> 비밀번호 확인 </div>
                    <div className="form-input">
                        <input placeholder="입력하신 비밀번호를 다시 입력해주세요." />
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
            return this.render_term();
        }else if(this.state.step == 1){
            return this.render_email();
        }else if(this.state.step == 2){
            return this.render_account();
        }else if(this.state.step == 3){
            return this.render_personal();
        }
        
    }

	render() {
		return (<div className="default-page regist-page">
            <div className="back-key">
                <div className="round-btn"><i className="fas fa-arrow-left"></i></div>
                <div className="step-indicator">
                    <div className={`item ${this.state.step == 0 ? "enable": ""}`}>약관동의</div>
                    <i class="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 1 ? "enable": ""}`}>이메일 인증</div>
                    <i class="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 2 ? "enable": ""}`}>개인정보 입력</div>
                    <i class="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 3 ? "enable": ""}`}>회원정보 입력</div>
                    <i class="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 4 ? "enable": ""}`}>마스터 키워드 발급</div>
                </div>
            </div>
            <div className="container">
                <h1>개인 회원가입</h1>
                {this.render_content()}
            </div>
		</div>);
	}
}