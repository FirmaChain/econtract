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
    decryptPIN,
} from "../../common/crypto_test"

import {
    fetch_user_info,
    get_contract,
    get_group_info,
    getGroupKey,
    select_subject,
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
    get_group_info,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
        super();
        this.blockFlag = false

		this.state={
            select_tab:0
        };
	}

	componentDidMount(){
        (async()=>{
            await this.props.fetch_user_info()
            let contract_id = this.props.match.params.contract_id || 0
            let contract, groups = []
            if(this.props.user_info.account_type != 0) {
                groups = await this.props.get_group_info(0)
                contract = await this.props.get_contract(contract_id, this.props.user_info, groups)
            } else {
                contract = await this.props.get_contract(contract_id, this.props.user_info)
            }

            if(!contract) {
                alert("계약이 암호화되어 있어 접근할 수 없습니다.")
                return history.goBack()
            }

            if(contract.payload.contract) {
                this.setState({
                    ...contract.payload,
                    groups
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

    getRoleText = (entity_id, corp_id, privilege) => {
        let text = []

        /*if(corp_id == 0 && this.state.contract.account_id == entity_id) {
            text.push("생성자")
        }*/

        switch(privilege) {
            case 1:
                text.push("서명자")
                break;
            case 2:
                text.push("보기 전용")
                break;
        }

        return text.join(", ")
    }

    status_text = ( status)=>{
        let contract = this.state.contract
        let infos = this.state.infos

        let corp_id = this.props.user_info.corp_id || -1
        let me = select_subject(this.state.infos, this.state.groups, this.props.user_info.account_id, corp_id).my_info
        if(status == 0) {
            return "내용 입력 중"
        } else if(status == 1) {

            console.log(infos)

            let sign_user = infos.map( (v, k) => {
                return {
                    corp_id : v.corp_id,
                    entity_id : v.entity_id,
                    signature : v.signature,
                }
            }).find(v => {
                return v.corp_id == 0 && v.entity_id == this.props.user_info.account_id
            })
            if(sign_user && sign_user.sign == "true") {
                return "상대방 서명 전"
            }
            return "내 서명 전"
        } else if(status == 2) {
            return "계약 완료"
        } 
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

    render_information_deck() {
        switch(this.state.select_tab) {
            case 0:
                return this.render_users()
            case 1:
                return this.render_information()
            case 2:
                return this.render_logs()
        }
    }

    render_users() {
        return <div className="deck users">
            {this.state.infos.map((e, k)=>{
                return <div className="item" key={e.entity_id+"_"+e.corp_id}>
                    <div className="icon">
                    {
                        (()=>{ switch(e.user_info.user_type) {
                            case 0:
                                return <i className="fas fa-user"></i>
                            case 1:
                                return <i className="fas fa-user-tie"></i>
                            case 2:
                                return <i className="fas fa-users"></i>
                        } })()
                    }
                    </div>
                    {
                        (()=>{ switch(e.user_info.user_type) {
                            case 0:
                                return <div className="desc">
                                    <div className="username">{e.user_info.username}</div>
                                    <div className="email">{e.user_info.email}</div>
                                </div>
                            case 1:
                                return <div className="desc">
                                    <div className="username">{e.user_info.username}<span>{e.user_info.company_name}</span></div>
                                    <div className="email">{e.user_info.email}</div>
                                </div>
                            case 2:
                                return <div className="desc">
                                    <div className="username">#{e.user_info.title}<span>{e.user_info.company_name}</span></div>
                                    <div className="email">&nbsp;</div>
                                </div>
                        } })()
                    }
                    <div className="privilege">{this.getRoleText(e.entity_id, e.corp_id, e.privilege)}</div>
                    <div className="is-sign">{e.privilege != 1 ? "" : (e.signature ? "서명 완료" : "서명 전")}</div>
                </div>
            })}
        </div>
    }

    render_information() {
        let contract = this.state.contract
        let review = this.state.review || {}

        let meOrGroup, creator;
        let users = [];
        let isAccount = false
        for(let v of this.state.infos) {
            if(v.corp_id == 0 && v.entity_id == this.props.user_info.account_id) {
                meOrGroup = v
                isAccount = true
            }

            if(v.corp_id == 0 && v.entity_id == contract.account_id)
                creator = v

            users.push(v.user_info.username ? v.user_info.username : v.user_info.title)
        }

        if(!meOrGroup && this.props.user_info.account_type != 0) {
            for(let v of this.state.infos) {
                if(v.corp_id == this.props.user_info.corp_id && !!this.state.groups.find(e=>e.group_id == v.entity_id) ) {
                    meOrGroup = v
                }
            }
        }
        users = users.join(", ")

        let pin = "000000"
        if(contract.is_pin_used) {
            if(isAccount)
                pin = decryptPIN(Buffer.from(meOrGroup.epin, 'hex').toString('hex'))
            else {
                let group_key = getGroupKey(this.props.user_info, meOrGroup.entity_id)
                pin = decryptPIN(Buffer.from(meOrGroup.epin, 'hex').toString('hex'), Buffer.from(group_key, 'hex'))
            }
        }

        return <div className="deck informations">
            <div className="item">
                <div className="title">계약명</div>
                <div className="desc">{contract.name}</div>
            </div>
            <div className="item">
                <div className="title">계약 상태</div>
                <div className="desc">{this.status_text(contract.status)}</div>
            </div>
            <div className="item">
                <div className="title">계약 고유 식별 값</div>
                <div className="desc">{review.document_hash || "미완료"}</div>
            </div>
            <div className="item">
                <div className="title">계약 등록 일자</div>
                <div className="desc">{moment(contract.addedAt).format("YYYY-MM-DD HH:mm:ss")}</div>
            </div>
            <div className="item">
                <div className="title">PIN 번호</div>
                <div className="desc">{contract.is_pin_used == 0 ? "PIN이 없습니다." : pin}</div>
            </div>
            <div className="item">
                <div className="title">IPFS ID</div>
                <div className="desc">{contract.ipfs || "미완료"}</div>
            </div>
            <div className="item">
                <div className="title">계약 완료 일자</div>
                <div className="desc">{contract.completedAt ? moment(contract.completedAt).format("YYYY-MM-DD HH:mm:ss") : "미완료"}</div>
            </div>
            <div className="item">
                <div className="title">계약 생성자</div>
                <div className="desc">{creator.user_info.username}</div>
            </div>
            <div className="item">
                <div className="title">트랜잭션 ID</div>
                <div className="desc">{review.transaction_id || "미완료"}</div>
            </div>
            <div className="item">
                <div className="title">기준 시간</div>
                <div className="desc">사용자 컴퓨터 기준</div>
            </div>
            <div className="item">
                <div className="title">계약 수신자</div>
                <div className="desc">{users}</div>
            </div>
        </div>
    }

    render_logs() {
        let logs = this.state.logs || [
            {
                log_id:1,
                text:"윤대현님이 계약을 수정했습니다.",
                name:"윤대현",
                email:"pbes0707@firma-solutions.com",
                addedAt:"2019-01-11 23:11:23",
                browser:"Chrome",
                ip:"172.30.1.28"
            }
        ]

        return <div className="deck logs">
            <div className="head">
                <div className="list-head-item list-name">이력</div>
                <div className="list-head-item list-user">사용자</div>
                <div className="list-head-item list-date">일자</div>
            </div>
            {logs.map((e, k) => {
                return <div key={e.log_id} className="item">
                    <div className="list-body-item list-name">
                        {e.text}
                    </div>
                    <div className="list-body-item list-user">
                        {e.name}
                        <div className="sub">{e.email}</div>
                    </div>
                    <div className="list-body-item list-date">
                        {moment(e.addedAt).format("YYYY-MM-DD HH:mm:ss")}
                        <div className="sub">{e.browser}/{e.ip}</div>
                    </div>
                </div>
            })}
            {logs.length == 0 ? <div className="empty-log">로그가 없습니다.</div> : null}
        </div>
    }

	render() {
        if(!this.props.user_info || !this.state.contract)
            return <div></div>

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
                            </div>
                            <div className="date">
                                마지막 활동 시간 : {moment(this.state.contract.updatedAt).format("YYYY-MM-DD HH:mm:ss")}<br/>
                                계약 등록 일자 : {moment(this.state.contract.addedAt).format("YYYY-MM-DD HH:mm:ss")}
                            </div>
                            <div className="buttons">
                                <div className="flex1">&nbsp;</div>
                                {this.state.contract.status != 2 ? <div className="blue-button" onClick={(e)=>history.push(`/edit-contract/${this.state.contract.contract_id}`)}>편집</div> : null}
                                <div className="blue-button">다운로드</div>
                                <div className="transparent-button">설정</div>
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
                                <div className="item enable-item">계약 정보 등록</div>
                                <div className="space"></div>
                                <div className="item enable-item">내용 입력중</div>
                                <div className="space"></div>
                                <div className={"item" + (this.state.contract.status > 0 ? " enable-item" : "")}>서명 대기중</div>
                                <div className="space"></div>
                                <div className={"item" + (this.state.contract.status > 1 ? " enable-item" : "")}>계약 완료</div>
                                <div className="corner-space"></div>
                            </div>

                            <div className="information-deck">
                                <div className="tab-container">
                                    <div className={"tab " + (this.state.select_tab == 0 ? "selected" : "")} onClick={e=>this.setState({select_tab:0})}>사용자</div>
                                    <div className={"tab " + (this.state.select_tab == 1 ? "selected" : "")} onClick={e=>this.setState({select_tab:1})}>상세 정보</div>
                                    <div className={"tab " + (this.state.select_tab == 2 ? "selected" : "")} onClick={e=>this.setState({select_tab:2})}>이력</div>
                                </div>
                                {this.render_information_deck()}
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
