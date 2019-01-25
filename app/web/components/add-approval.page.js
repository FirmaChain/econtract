import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
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
    new_approval,
    select_userinfo_with_email,
} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    new_approval,
    select_userinfo_with_email,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
        super();
        this.blockFlag = false
		this.state={
            order_list:[], // type 0 : 개인, type 1 : 기업 담당자, type 2 : 기업 그룹
            approval_name:"",
        }
	}

	componentDidMount(){
        (async()=>{
            let user = await this.props.fetch_user_info()
            let params = queryString.parse(this.props.location.search)

            if(!user) {
                return history.push("/login")
            }

            if(user.account_type == 0) {
                history.goBack()
                return alert(translate("personal_dont_use_approval"));
            }

            this.setState({
                can_approval_account_id:this.props.user_info.account_id,
                order_list:[{
                    account_id: user.account_id,
                    username:user.username,
                    email:user.email,
                    department:user.department,
                    job:user.job,
                }]
            })

            /*if( params.template_id && !isNaN(params.template_id) ) {
                let template = await this.props.get_template(params.template_id, this.props.user_info.corp_key || null)
                this.setState({
                    template
                })
            }*/

        })()


        history.block( (targetLocation) => {
            if(this.blockFlag)
                return true
            let out_flag = window._confirm(translate("you_really_leave_this_page_approval"))
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

    onClickBack = () => {
        history.goBack();
    }

    onClickAdd = async () => {
        if(!this.state.add_email)
            return alert(translate("please_input_email"))
        if(!this.state.add_role)
            return alert(translate("please_select_role"))

        if( !window.email_regex.test(this.state.add_email) )
            return alert(translate("incorrect_email_expression"))

        let resp = await this.props.select_userinfo_with_email(this.state.add_email)

        if(resp) {
            for(let v of this.state.order_list) {
                if( !!v.account_id && v.account_id == resp.account_id ) {
                    return alert(translate("already_add_user"))
                }
            }
            let info = {
                account_id:resp.account_id,
                username:resp.username,
                email:resp.email,
                department:resp.department,
                job:resp.job,
            }

            this.setState({
                order_list:[...this.state.order_list, info],
                add_email:""
            })
        } else {
            return alert(translate("no_user_this_email"))
        }
    }

    onClickRegister = async ()=>{
        if(this.is_register)
            return
        
        this.is_register = true

        if(!this.state.approval_name || this.state.approval_name.trim() == "") {
            this.is_register = false
            return alert(translate("please_input_approval_name"))
        }

        this.blockFlag = true;

        let approval_name = this.state.approval_name.trim();

        if(approval_name.length > 80) {
            this.is_register = false;
            this.blockFlag = false;
            return alert(translate("approval_name_must_be_80_letters"))
        }

        let order_list = this.state.order_list.map(e=>e.account_id);

        let template_model = null
        if(this.state.template) {
            template_model = Buffer.from(this.state.template.html).toString()
        }

        await window.showIndicator()

        let resp =  await this.props.new_approval(approval_name, order_list, this.props.user_info.corp_key, template_model);

        await window.hideIndicator()

        if(resp.code == 1) {
            let approval_id = resp.payload
            history.replace(`/edit-approval/${approval_id}`)
        } else {
            alert(translate("fail_register_approval"))
        }
        
        this.is_register = false

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


    openServiceNoRegisterModal = () => {
        window.openModal("CommonModal", {
            icon:"fal fa-user-slash",
            title:translate("service_unregister_user"),
            subTitle:translate("u_need_register_for_legal_validity"),
            desc:translate("unregister_user_add_contract_popup_desc"),
            onClose:()=>{
            }
        })
    }


	render() {
        if(!this.props.user_info)
            return <div></div>

        let _roles = [
            {value:1, label: translate("approval_user")},
        ]

        return (<div className="upsert-contract-group-page header-page">
            <div className="header">
                <div className="left-logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/home")}/>
                </div>
                { !!this.props.user_info ? <Information /> : null }
            </div>
            <div className="head">
                <span className="back" onClick={()=> history.goBack()}>
                    <i className="fal fa-chevron-left"></i> <span>{translate("go_back")}</span>
                </span>
                <div className="text">{translate("register_approval_info")}</div>
            </div>
            <div className="content">
                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">{translate("input_approval_name")}</div>
                        <div className="desc-content">{translate("please_input_this_approval_name")}</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head"></div>
                            <div className="form-input">
                                <input className="common-textbox" type="text"
                                    value={this.state.approval_name || ""}
                                    placeholder={translate("please_input_this_approval_name")}
                                    onChange={e=>this.setState({approval_name:e.target.value})}/>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.template ? <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">{translate("selected_template")}</div>
                        <div className="desc-content">{translate("use_template_this_contract")}</div>
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
                                <div className="btn-add-user btn-add-user-active" onClick={this.onViewTemplate}>{translate("preview_template")}</div>
                            </div>
                        </div>
                    </div>
                </div> : null}

                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">{translate("user_add")}</div>
                        <div className="desc-content">{translate("user_add_desc")}</div>
                        <div className="desc-link" onClick={this.openServiceNoRegisterModal}>{translate("unregister_user_enable_sign_?")}</div>
                    </div>
                    <div className="right-form">
                        <div className="column column-flex-2">
                            <div className="form-head">{translate("user_email")}</div>
                            <div className="form-input">
                                <input className="common-textbox" id="email" type="email"
                                    placeholder={translate("please_input_email")}
                                    value={this.state.add_email || ""}
                                    onChange={e=>this.setState({add_email:e.target.value})}/>
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-head">{translate("user_role")}</div>
                            <div className="form-input">
                                <Dropdown className="common-select"
                                    controlClassName="control"
                                    menuClassName="item"
                                    options={_roles}
                                    onChange={e=>{this.setState({add_role:e.value, add_role_label:e.label})}}
                                    value={this.state.add_role_label} placeholder={translate("user_role")} />
                                <div className={"btn-add-user" + ( (this.state.add_email || "").length==0? "" : " btn-add-user-active" )} onClick={this.onClickAdd}>{translate("add")}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="left-desc">
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">{translate("user_list")}</div>
                            <div className="form-list">
                                {this.state.order_list.map((e, k)=>{
                                    return <div className="item" key={k}>
                                        <div className="icon">
                                            <i className="fas fa-user-tie"></i>
                                        </div>
                                        <div className="desc">
                                            <div className="username">{e.username}<span>{e.job}</span></div>
                                            <div className="email">{e.email}</div>
                                        </div>
                                        <div className="privilege">{"결재자"}</div>
                                        <div className="action">
                                            {k == 0 ?
                                                null:
                                                <div className="delete" onClick={this.onClickRemoveCounterparty.bind(this, k, e)}>{translate("remove")}</div>
                                            }
                                        </div>
                                    </div>
                                })}
                            </div>
                            <div className="explain"></div>
                        </div>
                    </div>
                </div>

                <div className="bottom-container">
                    <div className="regist-contract" onClick={this.onClickRegister}>{translate("register_space")}</div>
                </div>
            </div>
            <Footer />
		</div>);
	}
}
