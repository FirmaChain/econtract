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

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'

import {
    fetch_user_info,
    list_template,
    select_userinfo_with_email
} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    list_template,
    select_userinfo_with_email
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
        super();
        this.blockFlag = false
        this.roles = [
            {value:0, label: "생성자"},
            {value:1, label: "서명자"},
            {value:2, label: "보기 가능"}
        ]

		this.state={
            target_list:[], // type 0 : 개인, type 1 : 기업 담당자, type 2 : 기업 그룹
            target_me:true,
            target_other:true,
            individual:[{
                deletable:false,
                title:"성함",
                force:true
            },{
                deletable:false,
                title:"이메일",
                force:true
            },{
                deletable:false,
                title:"주소",
                force:true
            },{
                deletable:false,
                title:"휴대폰 번호",
                checked:false
            },{
                deletable:false,
                title:"주민등록번호",
                checked:false
            }],
            corporation:[{
                deletable:false,
                title:"기업명",
                force:true
            },{
                deletable:false,
                title:"사업자등록번호",
                force:true
            },{
                deletable:false,
                title:"주소",
                force:true
            },{
                deletable:false,
                title:"대표자 성함",
                checked:false
            },{
                deletable:false,
                title:"담당자 성함",
                checked:false
            },{
                deletable:false,
                title:"담당자 이메일",
                checked:false
            },{
                deletable:false,
                title:"담당자 휴대전화",
                checked:false
            }]
        };
	}

	componentDidMount(){
        (async()=>{
            await window.showIndicator()
            let user = await this.props.fetch_user_info()

            if(!user)
                return;

            if(user.account_type == 0) {
                this.setState({
                    template_list:await this.props.list_template(),
                    target_list:[{
                        user_type:0,
                        username:user.username,
                        email:user.email,
                        role:[0, 1]
                    },{
                        user_type:0,
                        username:user.username,
                        email:user.email,
                        role:[1]
                    },{
                        user_type:0,
                        username:user.username,
                        email:user.email,
                        role:[1]
                    },{
                        user_type:1,
                        username:"김정완",
                        email:"jwkim@firma-solutions.com",
                        company_name:"피르마 솔루션즈",
                        role:[1],
                    },{
                        user_type:2,
                        company_name:"피르마 솔루션즈",
                        group_name:"사업1팀",
                        count:5,
                        role:[2],
                    }]
                })
            } else if(user.account_type == 1 || user.account_type == 2) {
                this.setState({
                    template_list:await this.props.list_template(),
                    target_list:[{
                        user_type:1,
                        username:user.username,
                        email:user.email,
                        role:[0, 1]
                    },{
                        user_type:0,
                        username:user.username,
                        email:user.email,
                        role:[1]
                    },{
                        user_type:0,
                        username:user.username,
                        email:user.email,
                        role:[1]
                    },{
                        user_type:1,
                        username:"김정완",
                        email:"jwkim@firma-solutions.com",
                        company_name:"피르마 솔루션즈",
                        role:[1],
                    },{
                        user_type:2,
                        company_name:"피르마 솔루션즈",
                        group_name:"사업1팀",
                        count:5,
                        role:[2],
                    }]
                })
            } else {

            }

            await window.hideIndicator()

        })()


        history.block( (targetLocation) => {
            if(this.blockFlag)
                return true
            let out_flag = window._confirm("게약 작성을 중단하고 현재 페이지를 나가시겠습니까?")
            if(out_flag)
                history.block( () => true )
            return out_flag
        })
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }
    }

    getRole(value) {
        for(let v of this.roles) {
            if(v.value == value)
                return v
        }
        return null;
    }

    getRoleText(roles) {
        let str = ""

        for(let v of roles) {
            if(v == 0) {
                str += "생성자\n"
            } else if(v == 1) {
                str += "서명자\n"
            } else if(v == 2) {
                str += "보기 가능\n"
            }
        }
        return str.trim().replace(/\n/g, ", ");
    }

    onClickBack = ()=>{
        history.goBack();
    }

    onClickAdd = async ()=>{
        if(!this.state.add_email)
            return alert("이메일을 입력해주세요.")
        if(!this.state.add_role)
            return alert("역할을 선택해주세요.")

        if( !window.email_regex.test(this.state.add_email) )
            return alert("이메일 형식이 잘못되었습니다.")

        let resp = await this.props.select_userinfo_with_email(this.state.add_email)

        if(resp){
            this.setState({
                target_list:[...this.state.target_list, {
                    user_type:resp.account_type != 0 ? 1 : 0,
                    username:resp.username,
                    email:resp.email,
                    account_id:resp.account_id,
                    role:[this.state.add_role]
                }],
                add_email:""
            })
        }else{
            return alert("해당 이메일로 일치하는 가입자가 없습니다.")
        }
    }

    onToggleSignInfo = (name, k)=>{
        this.state[name][k].checked = !this.state[name][k].checked;
        this.setState({
            [name]:[...this.state[name]]
        })
    }

    onClickAddCorporation = ()=>{
        if(!this.state.add_corporation_info){
            return alert("항목의 이름을 입력해주세요.")
        }

        this.setState({
            corporation:[...this.state.corporation,{
                title:this.state.add_corporation_info,
                checked:true,
                deletable:true
            }],
            add_corporation_info:""
        })
    }

    onClickAddIndivisual = ()=>{
        if(!this.state.add_individual_info){
            return alert("항목의 이름을 입력해주세요.")
        }

        this.setState({
            individual:[...this.state.individual,{
                title:this.state.add_individual_info,
                checked:true,
                deletable:true
            }],
            add_individual_info:""
        })
    }

    onClickRegister = async ()=>{
        this.blockFlag = true;
        let contract_name = this.state.contract_name;
        let counterparties = this.state.target_list;
        let individual_info = this.state.individual.filter(e=>e.force||e.checked).map(e=>e.title);
        let corporation_info = this.state.corporation.filter(e=>e.force||e.checked).map(e=>e.title);
        let pin = "000000";
        await this.props.new_contract(subject, counterparties, pin, individual_info, corporation_info);

        console.log(
            contract_name,
            sign_target_me,
            sign_target_other,
            counterparties,
            individual_info,
            corporation_info,
        )

        history.push("/edit-contract/1")
    }

    onClickRemoveCounterparty = (k)=>{
        let _list = [...this.state.target_list]
        _list.splice(k,1)
        this.setState({
            target_list:_list
        })
    }

    onClickRemoveSignInfo = (name, k)=>{
        this.state[name].splice(k,1);
        this.setState({
            [name]:[...this.state[name]]
        })
    }

    openServiceNoRegisterModal = () => {
        window.openModal("CommonModal", {
            icon:"fal fa-user-slash",
            title:"서비스 미가입 사용자",
            subTitle:"계약 문서의 법적 효력을 위해 서비스 가입이 필요합니다.",
            desc:`서비스 가입을 거치지 않고 서명을 할 경우, 해당 계약의 법적 효력을 증명할 수 없습니다.<br/><br/>
사용자를 추가하기 위해선 양측의 서비스 가입이 
필수적이며, 가입 후 계약 정보 수정 화면에서 해당 
사용자를 꼭 추가해주세요.`,
            onClose:()=>{
            }
        })
    }


    keyPress = async (type, e) => {
        if(e.keyCode == 13){
            switch(type) {
                case 0:
                this.onClickAddIndivisual()
                break;
                case 1:
                this.onClickAddCorporation()
                break;
            }
        }
    }

	render() {
        if(!this.props.user_info)
            return <div></div>

        let _roles = this.roles.filter( (e, k) => k != 0 )

        return (<div className="upsert-contract-group-page header-page">
            <div className="header">
                <div className="left-logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/home")}/>
                </div>
                { !!this.props.user_info ? <Information /> : null }
            </div>
            <div className="head">
                <span className="back" onClick={()=> history.goBack()}>
                    <i className="fal fa-chevron-left"></i> <span>뒤로가기</span>
                </span>
                <div className="text">계약정보 등록</div>
            </div>
            <div className="content">
                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">계약명 입력</div>
                        <div className="desc-content">해당 계약명을 입력해주세요</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head"></div>
                            <div className="form-input">
                                <input className="common-textbox" type="text"
                                    value={this.state.contract_name || ""}
                                    placeholder="해당 계약명을 입력해주세요"
                                    onChange={e=>this.setState({contract_name:e.target.value})}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">서명 대상</div>
                        <div className="desc-content">계약에 서명하는 대상에 본인 포함 여부를 선택할 수 있습니다</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head"></div>
                            <div className="form-input">
                                <CheckBox2 on={this.state.target_me}
                                    size={18}
                                    disabled
                                    onClick={()=>this.setState({target_me:!this.state.target_me})}
                                    text={"본인 (" + this.props.user_info.username + ")"}/> &nbsp;&nbsp;&nbsp;&nbsp;
                                <CheckBox2 on={this.state.target_other}
                                    size={18}
                                    onClick={()=>this.setState({target_other:!this.state.target_other})}
                                    text={"타 서명자"}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{display:this.state.target_other ? "flex" : "none"}}>
                    <div className="left-desc">
                        <div className="desc-head">사용자 추가</div>
                        <div className="desc-content">계약에 서명하거나 볼 수 있는 사용자를 추가합니다</div>
                        <div className="desc-link" onClick={this.openServiceNoRegisterModal}>서비스 미가입자도 서명할 수 있나요?</div>
                    </div>
                    <div className="right-form">
                        <div className="column column-flex-2">
                            <div className="form-head">사용자 이메일</div>
                            <div className="form-input">
                                <input className="common-textbox" id="email" type="email"
                                    placeholder="이메일을 입력해주세요"
                                    value={this.state.add_email || ""}
                                    onChange={e=>this.setState({add_email:e.target.value})}/>
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-head">사용자 역할</div>
                            <div className="form-input">
                                <Dropdown className="common-select"
                                    controlClassName="control"
                                    menuClassName="item"
                                    options={_roles}
                                    onChange={e=>{this.setState({add_role:e.value, add_role_label:e.label})}}
                                    value={this.state.add_role_label} placeholder="역할" />
                                <div className={"btn-add-user" + ( (this.state.add_email || "").length==0? "" : " btn-add-user-active" )} onClick={this.onClickAdd}>추가</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="left-desc">
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">사용자 리스트</div>
                            <div className="form-list">
                                {this.state.target_list.map((e, k)=>{
                                    return <div className="item" key={k}>
                                        <div className="icon">
                                        {
                                            (()=>{ switch(e.user_type) {
                                                case 0:
                                                    return <i className="fas fa-user"></i>
                                                case 1:
                                                    return <i className="fas fa-user-tie"></i>
                                                case 2:
                                                    return <i className="fas fa-users"></i>
                                                break;
                                            } })()
                                        }
                                        </div>
                                        {
                                            (()=>{ switch(e.user_type) {
                                                case 0:
                                                    return <div className="desc">
                                                        <div className="username">{e.username}</div>
                                                        <div className="email">{e.email}</div>
                                                    </div>
                                                    break;
                                                case 1:
                                                    return <div className="desc">
                                                        <div className="username">{e.username}<span>{e.company_name}</span></div>
                                                        <div className="email">{e.email}</div>
                                                    </div>
                                                case 2:
                                                    return <div className="desc">
                                                        <div className="username">{e.group_name}<span>{e.company_name}</span></div>
                                                        <div className="email">{e.count}명의 그룹원</div>
                                                    </div>
                                            } })()
                                        }
                                        <div className="privilege">{this.getRoleText(e.role)}</div>
                                        <div className="action">
                                            {k == 0 ?
                                                null:
                                                <div className="delete" onClick={this.onClickRemoveCounterparty.bind(this, k)}>삭제</div>
                                            }
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">서명 정보</div>
                        <div className="desc-content">전자 서명시 계약에 들어갈 정보들을 선택합니다</div>
                    </div>
                    <div className="right-form align-normal">
                        <div className="checkbox-list">
                            <div className="form-head">개인 서명자 정보</div>
                            <div className="form-check-list">
                                {this.state.individual.map((e,k)=>{
                                    return <div className="item" key={k}>
                                        <CheckBox2 size={18} disabled={e.force} on={e.force || e.checked} onClick={this.onToggleSignInfo.bind(this,"individual",k)}/>
                                        <div className="name">{e.title}</div>
                                        {e.deletable ? <div className="delete" onClick={this.onClickRemoveSignInfo.bind(this,"individual", k)}><i className="fal fa-times"></i></div> : null}
                                    </div>
                                })}
                                <div className="bottom">
                                    <input className="text-box common-textbox"
                                        placeholder="항목 입력"
                                        type="text"
                                        value={this.state.add_individual_info || ""}
                                        onChange={e=>this.setState({add_individual_info:e.target.value})}
                                        onKeyDown={this.keyPress.bind(this, 0)}/>
                                    <div className="add-btn" onClick={this.onClickAddIndivisual}>
                                        <div>서명 정보 추가</div>
                                        <i className="fal fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="checkbox-list">
                            <div className="form-head">기업 서명자 정보</div>
                            <div className="form-check-list">
                                {this.state.corporation.map((e,k)=>{
                                    return <div className="item" key={k}>
                                        <CheckBox2 size={18} disabled={e.force} on={e.force || e.checked} onClick={this.onToggleSignInfo.bind(this,"corporation",k)}/>
                                        <div className="name">{e.title}</div>
                                        {e.deletable ? <div className="delete" onClick={this.onClickRemoveSignInfo.bind(this,"corporation", k)}><i className="fal fa-times"></i></div> : null}
                                    </div>
                                })}
                                <div className="bottom">
                                    <input className="text-box common-textbox"
                                        placeholder="항목 입력"
                                        type="text"
                                        value={this.state.add_corporation_info || ""}
                                        onChange={e=>this.setState({add_corporation_info:e.target.value})}
                                        onKeyDown={this.keyPress.bind(this, 1)}/>
                                    <div className="add-btn" onClick={this.onClickAddCorporation}>
                                        <div>서명 정보 추가</div>
                                        <i className="fal fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bottom-container">
                    <div className="regist-contract" onClick={this.onClickRegister}>등 록</div>
                </div>
            </div>
            <Footer />
		</div>);
	}
}
