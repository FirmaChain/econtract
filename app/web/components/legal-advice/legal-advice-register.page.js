import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../../history'
import translate from "../../../common/translate"
import queryString from "query-string"
import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'

import {
} from "../../../common/crypto_test"

import {
    fetch_user_info
} from "../../../common/legal_actions"

import Footer from "../footer.comp"
import CheckBox3 from "../checkbox3"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(props){
		super(props);
        let _ = {}
        let params = queryString.parse(this.props.location.search)
        if(!!params.type && params.type == "expert") {
            _ = {
                type:1,
                step:0,
                email:"",
                password:"",
                phone_number:"",
                validate_code:"",
                phone_validation:false,

                name:"",
                address1:"",
                address2:"",
            }
        } else {
            _ = {
                type:0,
                email:"",
                password:"",
                phone_number:"",
                validate_code:"",
                phone_validation:false
            }
        }

		this.state = _;
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
            //return history.replace("/legal-advice/home")
        }
    }


    onClickRequestPhone = async () => {
        if(this.state.phone_number == null || this.state.phone_number.length != 13 || !/^0\d{2}-\d{4}-\d{4}$/.test(this.state.phone_number))
            return alert(translate("please_input_correct_phone"))
    }

    onChangePhoneForm = async (name, e) => {
        let text = e.target.value;
        text = text.replace(/[^0-9]/g,"")
        text = window.phoneFomatter(text)

        this.setState({
            [name]:text
        })
    }

    render_expert_step_0() {
        let phone_send_active = true;
        if(this.state.phone_number == null || this.state.phone_number.length != 13 || !/^0\d{2}-\d{4}-\d{4}$/.test(this.state.phone_number))
            phone_send_active = false;

        return <div className="legal-advice-register legal-advice-maintain">
            <div className="header">
                <div className="logo-img" onClick={e=>history.push("/legal-advice/")}><img src="/static/duite_review.png"/></div>
                <div className="title">전문가 회원가입</div>
            </div>
            <div className="legal-advice-register-expert">
                <div className="container" style={{textAlign: 'left' }}>
                </div>
                <div className="container">
                    <div className="subject enable-sub">계정,일반 정보</div>

                    <div className="title">계정</div>

                    <div className="text-place">
                        <div className="title">이메일</div>
                        <div className="text-box">
                            <input id="email" type="email" 
                                placeholder="example@example.com"
                                value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}}/>
                        </div>
                    </div>

                    <div className="text-place">
                        <div className="title">비밀번호</div>
                        <div className="text-box">
                            <input type="password" 
                                placeholder="영문 + 숫자 + 특수문자 (최소 8자)"
                                value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="text-place">
                        <div className="title">휴대폰 번호 인증</div>
                        <div className="text-box">
                            <input type="text" 
                                placeholder="010-1234-1234"
                                value={this.state.phone_number} onChange={this.onChangePhoneForm.bind(this, "phone_number")}/>
                            <div className={`right-button ${phone_send_active ? "" : "deactive"}`}>전송</div>
                        </div>
                    </div>
                    <div className="text-place">
                        <div className="title">인증번호</div>
                        <div className="text-box">
                            <input type="text" 
                                value={this.state.validate_code} onChange={(e)=>{this.setState({validate_code:e.target.value})}}/>
                        </div>
                    </div>

                    <div className="title" style={{marginTop:"20px"}}>일반</div>

                    <div className="text-place">
                        <div className="title">이름</div>
                        <div className="text-box">
                            <input type="text" 
                                placeholder="이름을 입력해주세요."
                                value={this.state.name} onChange={(e)=>{this.setState({name:e.target.value})}}/>
                        </div>
                    </div>

                    <div className="text-place">
                        <div className="title">주소</div>
                        <div className="text-box">
                            <input type="text" 
                                placeholder="아래의 검색 버튼을 통해 검색해 주세요."
                                value={this.state.address1} onChange={(e)=>{this.setState({address1:e.target.value})}}/>
                        </div>
                        <div className="text-box">
                            <input type="text" 
                                placeholder="상세 주소"
                                value={this.state.address2} onChange={(e)=>{this.setState({address2:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="common-button search-button">주소 검색</div>

                    <div className="sub">전문사무소가 있을 경우, 사무실 주소를 입력해주세요</div>

                    <div className="common-button next-button deactive" onClick={e=>{this.setState({step:1})}}>다음</div>
                </div>
                <div className="container" style={{textAlign: 'right' }}>
                    <div className="subject">다음 단계 : 전문가 정보, 전문 분야</div>
                </div>
            </div>
            <Footer />
        </div>
    }

    render_expert_step_1() {
        return <div className="legal-advice-register legal-advice-maintain">
            <div className="header">
                <div className="logo-img" onClick={e=>history.push("/legal-advice/")}><img src="/static/duite_review.png"/></div>
                <div className="title">전문가 회원가입</div>
            </div>
            <div className="legal-advice-register-expert">
                <div className="container" style={{textAlign: 'left' }}>
                    <div className="subject">계정,일반 정보</div>
                    <div className="go-back" onClick={e=>{this.setState({step:0})}}><i className="fal fa-long-arrow-left"></i> 뒤로가기</div>
                </div>
                <div className="container">
                    <div className="subject enable-sub">다음 단계 : 전문가 정보, 전문 분야</div>

                    <div className="title">계정</div>

                    <div className="text-place">
                        <div className="title">이메일</div>
                        <div className="text-box">
                            <input id="email" type="email" 
                                placeholder="example@example.com"
                                value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}}/>
                        </div>
                    </div>

                    <div className="text-place">
                        <div className="title">비밀번호</div>
                        <div className="text-box">
                            <input type="password" 
                                placeholder="영문 + 숫자 + 특수문자 (최소 8자)"
                                value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}}/>
                        </div>
                    </div>

                    <div className="title" style={{marginTop:"20px"}}>일반</div>

                    <div className="text-place">
                        <div className="title">이름</div>
                        <div className="text-box">
                            <input type="text" 
                                placeholder="이름을 입력해주세요."
                                value={this.state.name} onChange={(e)=>{this.setState({name:e.target.value})}}/>
                        </div>
                    </div>

                    <div className="text-place">
                        <div className="title">주소</div>
                        <div className="text-box">
                            <input type="text" 
                                placeholder="아래의 검색 버튼을 통해 검색해 주세요."
                                value={this.state.address1} onChange={(e)=>{this.setState({address1:e.target.value})}}/>
                        </div>
                        <div className="text-box">
                            <input type="text" 
                                placeholder="상세 주소"
                                value={this.state.address2} onChange={(e)=>{this.setState({address2:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="common-button search-button">주소 검색</div>

                    <div className="sub">전문사무소가 있을 경우, 사무실 주소를 입력해주세요</div>

                    <div className="common-button next-button deactive" onClick={e=>{this.setState({step:1})}}>다음</div>
                </div>
                <div className="container">
                </div>
            </div>
            <Footer />
        </div>
    }

    render_expert() {
        switch(this.state.step) {
            case 0:
                return this.render_expert_step_0();
            case 1:
                return this.render_expert_step_1();
        }
    }

    render_user() {
        let phone_send_active = true;
        if(this.state.phone_number == null || this.state.phone_number.length != 13 || !/^0\d{2}-\d{4}-\d{4}$/.test(this.state.phone_number))
            phone_send_active = false;

        return <div className="legal-advice-register legal-advice-maintain">
            <div className="header">
                <div className="logo-img" onClick={e=>history.push("/legal-advice/")}><img src="/static/duite_review.png"/></div>
                <div className="title">회원가입</div>
            </div>
            <div className="legal-advice-register-user container">
                <div className="text-place">
                    <div className="title">이메일</div>
                    <div className="text-box">
                        <input id="email" type="email" 
                            placeholder="example@example.com"
                            value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}}/>
                    </div>
                </div>

                <div className="text-place">
                    <div className="title">비밀번호</div>
                    <div className="text-box">
                        <input type="password" 
                            placeholder="영문 + 숫자 + 특수문자 (최소 8자)"
                            value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}}/>
                    </div>
                </div>
                <div className="text-place">
                    <div className="title">휴대폰 번호 인증</div>
                    <div className="text-box">
                        <input type="text" 
                            placeholder="010-1234-1234"
                            value={this.state.phone_number} onChange={this.onChangePhoneForm.bind(this, "phone_number")}/>
                        <div className={`right-button ${phone_send_active ? "" : "deactive"}`}>전송</div>
                    </div>
                </div>
                <div className="text-place">
                    <div className="title">인증번호</div>
                    <div className="text-box">
                        <input type="text" 
                            value={this.state.validate_code} onChange={(e)=>{this.setState({validate_code:e.target.value})}}/>
                    </div>
                </div>

                <div className="common-button register-button deactive">회원가입</div>

                <div className="sub">
                    회원가입 버튼을 클릭할 경우, 본 서비스의 <span>이용약관</span> 및 
                    <span>개인정보 취급방침</span>에 동의하신걸로 간주합니다.
                </div>
            </div>
            <Footer />
        </div>
    }
    
    render() {
        if(this.state.type == 0) 
            return this.render_user();

        return this.render_expert();
    }
}
