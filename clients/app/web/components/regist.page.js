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

    finish = ()=>{}
    
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
            <div className="column-300">
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
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 이메일 </div>
                    <div className="form-input">
                        example@example.com
                    </div>
                    
                    <div className="form-label"> 이름 </div>
                    <div className="form-input">
                        <input placeholder="이름을 입력해주세요." />
                    </div>

                    <div className="form-label"> 휴대폰 </div>
                    <div className="form-input">
                        <input placeholder="휴대폰" />
                        <button>전송</button>
                    </div>

                    <div className="form-label"> 인증번호 </div>
                    <div className="form-input">
                        <input placeholder="인증번호를 입력해주세요." />
                        <button>확인</button>
                    </div>

                    <div className="form-label"> 주소 </div>
                    <div className="form-input">
                        <input placeholder="주소를 입력해주세요." />
                    </div>

                    <div className="form-label"> 롭스텐 이러디름 프라이빗 키 </div>
                    <div className="form-input">
                        <input placeholder="기존 보유하고 계신 키값을 입력해주세요." />
                        <button>생성</button>
                    </div>
                    <div className="form-warning">
                        * 롭스텐 이더리움을 전송받기 위해 필요합니다.
                        보유하고 계신 키가 없다면 [생성] 버튼을 눌러 
                        생성하시면 됩니다.
                    </div>

                    <div className="form-submit">
                        <button className="border" onClick={this.next_term}> 다음 </button>
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
                        <div className="masterkey-item">slot</div>
                        <div className="masterkey-item">empower</div>
                        <div className="masterkey-item">loop</div>
                        <div className="masterkey-item">primary</div>
                        <div className="masterkey-item">wrap</div>
                        <div className="masterkey-item">laugh</div>
                        <div className="masterkey-item">panel</div>
                        <div className="masterkey-item">impulse</div>
                        <div className="masterkey-item">toward</div>
                        <div className="masterkey-item">decorate</div>
                        <div className="masterkey-item">cash</div>
                        <div className="masterkey-item">audit</div>
                        <div className="copy">복사</div>
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
                        <div className="item selected">slot</div>
                        <div className="item selected">cash</div>
                        <div className="item selected">audit</div>
                    </div>

                    <div className="masterkey-selection-list">
                        <div className="item selected">slot</div>
                        <div className="item">empower</div>
                        <div className="item">loop</div>
                        <div className="item">primary</div>
                        <div className="item">wrap</div>
                        <div className="item">laugh</div>
                        <div className="item">panel</div>
                        <div className="item">impulse</div>
                        <div className="item">toward</div>
                        <div className="item">decorate</div>
                        <div className="item selected">cash</div>
                        <div className="item selected">audit</div>
                    </div>
                    
                    <div className="form-submit">
                        <button className="border" onClick={this.finish}> 다음 </button>
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
                <div className="round-btn"><i className="fas fa-arrow-left"></i></div>
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