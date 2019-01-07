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
import queryString from "query-string"

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'

import {
    fetch_user_info,
    list_template,
    select_userinfo_with_email,
    new_contract,
    get_group_info,
    update_epin_account,
    update_epin_group,
    get_template,
    genPIN,
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
    select_userinfo_with_email,
    new_contract,
    get_group_info,
    update_epin_account,
    update_epin_group,
    get_template,
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
            is_use_pin:false,
            contract_name:"",
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
                force:true
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
            let user = await this.props.fetch_user_info()
            let params = queryString.parse(this.props.location.search)

            if(!user) {
                return history.push("/login")
            }

            if(user.account_type == 0) {
                this.setState({
                    can_edit_account_id:this.props.user_info.account_id,
                    target_list:[{
                        user_type:0,
                        account_id: user.account_id,
                        username:user.username,
                        email:user.email,
                        public_key:user.publickey_contract,
                        role:[0, 1],
                    }]
                })
            } else if(user.account_type == 1 || user.account_type == 2) {
                this.setState({
                    can_edit_account_id:this.props.user_info.account_id,
                    target_list:[{
                        user_type:1,
                        account_id: user.account_id,
                        username:user.username,
                        email:user.email,
                        public_key:user.publickey_contract,
                        company_name:user.company_name,
                        role:[0, 1],
                    }/*,{
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
                    }*/]
                })
            } else {

            }

            if( params.template_id && !isNaN(params.template_id) ) {
                let template = await this.props.get_template(params.template_id)
                this.setState({
                    template
                })
            }

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

            for(let v of this.state.target_list) {
                if( !!v.account_id && v.account_id == resp.account_id ) {
                    return alert("이미 추가된 유저입니다.")
                }
            }
            let info = {
                user_type:resp.account_type != 0 ? 1 : 0,
                username:resp.username,
                email:resp.email,
                account_id:resp.account_id,
                role:[this.state.add_role],
                public_key:resp.publickey_contract,
            }

            this.setState({
                target_list:[...this.state.target_list, info],
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

        if(this.state.can_edit_account_id == null)
            return alert("첫 수정 권한을 지정해주세요.")

        if(this.state.is_use_pin) {
            if(this.state.pin_number == "" || this.state.pin_number.length != 6) {
                return alert("핀 번호를 입력해주세요.")
            } else if(this.state.pin_number == "000000") {
                return alert("핀 번호는 000000 으로 설정할 수 없습니다.")
            }
        }

        if(!this.state.contract_name || this.state.contract_name == "") {
            return alert("계약서명을 입력해주세요.")
        }

        this.blockFlag = true;

        let contract_name = this.state.contract_name;
        let counterparties = this.state.target_list.map(e=> {
            let role;
            for(let v of e.role) {
                if(v != 0) {
                    role = v;
                    break;
                }
            }
            return {
                ...e,
                role,
            };
        });

        let includeGroup = false;
        for( let v of counterparties ) {
            if( v.user_type == 2 ) {
                includeGroup = true;
                break;
            }
        }

        if(this.props.user_info.account_type != 0 && includeGroup == false) {
            this.blockFlag = false;
            return alert("기업 계정으로 계약 생성 시, 그룹을 최소한 하나는 추가해야 합니다.");
        }


        let individual_info = this.state.individual.filter(e=>e.force||e.checked).map(e=>e.title);
        let corporation_info = this.state.corporation.filter(e=>e.force||e.checked).map(e=>e.title);

        let necessary_info = {individual: individual_info, corporation: corporation_info};
        let is_pin_used = this.state.is_use_pin;
        let pin = is_pin_used ? this.state.pin_number : "000000";

        let template_model = null
        if(this.state.template) {
            template_model = Buffer.from(this.state.template.html).toString()
        }

        let resp =  await this.props.new_contract(contract_name, counterparties, pin, necessary_info, this.state.can_edit_account_id, !!is_pin_used ? 1 : 0, template_model);

        if(resp.code == 1) {
            let contract_id = resp.payload.contract_id
            if (is_pin_used) {
                await this.props.update_epin_account(contract_id, pin);
                if( includeGroup ) {
                    for( let v of counterparties ) {
                        if( v.user_type == 2 ) {
                            await this.props.update_epin_group(v.corp_id, v.group_id, contract_id, this.props.user_info, pin)
                        }
                    }
                }
            }
            history.replace(`/edit-contract/${contract_id}`)
        }

    }

    onViewTemplate = () => {
        if(!this.state.template)
            return;


        window.openModal("PreviewContract",{
            title: this.state.template.subject,
            model: Buffer.from(this.state.template.html).toString(),
        })

    }

    onClickRemoveCounterparty = (k, e)=>{
        let _list = [...this.state.target_list]
        _list.splice(k,1)
        if(e.account_id == this.state.can_edit_account_id)
            this.setState({can_edit_account_id:this.props.user_info.account_id})
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

    onAddGroup = async () => {
        let data = await this.props.get_group_info(0)
        data = data.map((e) => {
            return {
                user_type:2,
                corp_id: e.corp_id,
                group_id : e.group_id,
                title : e.title,
                public_key : Buffer.from(e.group_public_key).toString("hex"),
                company_name:this.props.user_info.company_name,
                role:[2],
            }
        })
        window.openModal("OneAddModal", {
            icon:"fal fa-users",
            title:"사용자에 그룹 추가하기",
            subTitle:"그룹 선택",
            desc:`선택하신 그룹의 그룹원들이 해당 계약에 보기 가능 사용자로 추가됩니다`,
            data,
            onConfirm:(group)=>{
                for(let v of this.state.target_list) {
                    if( !!v.corp_id && !!v.group_id && v.corp_id == group.corp_id && v.group_id == group.group_id) {
                        return alert("이미 추가된 그룹입니다.")
                    }
                }

                this.setState({
                    target_list:[...this.state.target_list, group]
                })
            }
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

                {this.state.template ? <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">선택된 템플릿</div>
                        <div className="desc-content">해당 계약에 사용될 템플릿입니다.</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head"></div>
                            <div className="form-input">
                                <input className="common-textbox" type="text"
                                    value={this.state.template.subject || ""}
                                    disabled />
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-head"></div>
                            <div className="form-input">
                                <div className="btn-add-user btn-add-user-active" onClick={this.onViewTemplate}>템플릿 미리보기</div>
                            </div>
                        </div>
                    </div>
                </div> : null}

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

                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">보안 설정</div>
                        <div className="desc-content">계약 열람시 PIN 입력 여부를 선택할 수 있습니다</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">계약 PIN 사용 여부</div>
                            <div className="form-input">
                                <CheckBox2 on={this.state.is_use_pin}
                                    size={18}
                                    onClick={()=>{
                                        this.setState({
                                            is_use_pin:!this.state.is_use_pin,
                                            pin_number:genPIN()
                                        })
                                    }}
                                    text={"PIN 보안 사용"}/>
                            </div>
                        </div>
                        {this.state.is_use_pin ? <div className="column column-flex-2">
                            <div className="form-head">PIN 설정</div>
                            <div className="form-input">
                                <input className="common-textbox" id="pin" type="text"
                                    placeholder="원하시는 PIN 번호를 입력해주세요 ( 숫자로 구성된 6자리 번호 )"
                                    value={this.state.pin_number || ""}
                                    onChange={e=>{
                                        if(!isNaN(e.target.value) && e.target.value.length < 7)
                                            this.setState({pin_number:e.target.value})
                                    }}/>
                            </div>
                        </div> : null}
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
                { (this.props.user_info.account_type != 0 && this.state.target_other) ?
                    <div className="row">
                        <div className="left-desc">
                        </div>
                        <div className="right-form small-right-form">
                            <div className="group-add-button" onClick={this.onAddGroup}>그룹 추가하기</div>
                        </div>
                    </div> : null
                }

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
                                                        <div className="username">#{e.title}<span>{e.company_name}</span></div>
                                                        <div className="email">&nbsp;</div>
                                                    </div>
                                            } })()
                                        }
                                        <div className="privilege">{this.getRoleText(e.role)}</div>
                                        <div className="can-edit">
                                            <CheckBox2 size={18} disabled={e.role.includes(2)}
                                                on={this.state.can_edit_account_id == e.account_id}
                                                onClick={ v => {
                                                    this.setState({can_edit_account_id:e.account_id})
                                                }} />
                                            <div className="name">수정 권한</div>
                                        </div>
                                        <div className="action">
                                            {k == 0 ?
                                                null:
                                                <div className="delete" onClick={this.onClickRemoveCounterparty.bind(this, k, e)}>삭제</div>
                                            }
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div className="explain">* 수정 권한은 처음에 편집할 사람을 지정하는 것입니다. 동시에 계약서를 여러명이 편집할 수 없습니다.</div>
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
