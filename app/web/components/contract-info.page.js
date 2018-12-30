import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import SignerSlot from "./signer-slot"
import history from '../history';
import pdfjsLib from "pdfjs-dist"
import translate from "../../common/translate"
import Information from "./information.comp"
import Footer from "./footer.comp"
import moment from "moment"

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'

import {
    fetch_user_info,
    get_contract,
} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    get_contract,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
        super();
        this.blockFlag = false

		this.state={};
	}

	componentDidMount(){
        (async()=>{
            await this.props.fetch_user_info()
            let contract_id = this.props.match.params.contract_id || 0
            let contract = await this.props.get_contract(contract_id)
            if(contract.payload.contract) {
                console.log(contract.payload)
                this.setState({
                    ...contract.payload
                })
            } else {
                alert("계약이 존재하지 않습니다.")
                history.goBack()
            }
        })()
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }
    }

    onClickBack = ()=>{
        history.goBack();
    }

    keyPress = async (type, e) => {
        if(e.keyCode == 13){
            switch(type) {
                case 0:
                break;
                case 1:
                break;
            }
        }
    }

	render() {
        if(!this.props.user_info || !this.state.contract)
            return <div></div>

        let status_text = (status)=>{
            if(status == 0) {
                return "내용 입력 중"
            } else if(status == 1) {
                if("내가 서명 했다면")
                    return "상대방 서명 전"
                else if("나는 서명 안했고 상대방중 하나라도 서명 했다면")
                    return "내 서명 전"
            } else if(status == 2) {
                return "계약 완료"
            } 
        }

        return (<div className="contract-info-page">
            <div className="header-page">
                <div className="header">
                    <div className="left-icon">
                        <i className="fal fa-times" onClick={()=>history.goBack()}></i>
                    </div>
                    <div className="title">계약 상세 정보</div>
                    { !!this.props.user_info ? <Information /> : null }
                </div>
                <div className="container">
                    <div className="content">
                        <div className="wrapper">
                            <div className="top">
                                <div className="title">{this.state.contract.name}</div>
                                <div className="date">
                                    마지막 활동 시간 : {moment(this.state.contract.updatedAt).format("YYYY-MM-DD HH:mm:ss")}<br/>
                                    계약 등록 일자 : {moment(this.state.contract.addedAt).format("YYYY-MM-DD HH:mm:ss")}
                                </div>
                            </div>
                            <div className="buttons">
                                <div className="flex1">&nbsp;</div>
                                <div className="modify">편집</div>
                                <div className="setting">설정</div>
                            </div>
                            <div className="indicator">
                                <div className="corner-line enable-line"></div>
                                <div className="circle enable-circle"></div>
                                <div className="line enable-line"></div>
                                <div className="circle enable-circle"></div>
                                <div className={"line " + (this.state.contract.status > 0 ? "enable-line" : "")}></div>
                                <div className={"circle " + (this.state.contract.status > 0 ? "enable-circle" : "")}></div>
                                <div className={"line " + (this.state.contract.status > 1 ? "enable-line" : "")}></div>
                                <div className={"circle " + (this.state.contract.status > 1 ? "enable-circle" : "")}></div>
                                <div className="corner-line"></div>
                            </div>
                            <div className="step-text">
                                <div className="corner-space"></div>
                                <div className="item">계약 정보 등록</div>
                                <div className="space"></div>
                                <div className="item">내용 입력중</div>
                                <div className="space"></div>
                                <div className="item">서명 대기중</div>
                                <div className="space"></div>
                                <div className="item">계약 완료</div>
                                <div className="corner-space"></div>
                            </div>
                        </div>
                    </div>
                    <div className="chat"></div>
                </div>
            </div>
            <Footer />
		</div>);
	}
}
