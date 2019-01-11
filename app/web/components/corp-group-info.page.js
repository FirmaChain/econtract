import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import Information from "./information.comp"
import moment from "moment"
import md5 from 'md5'

import {
    get256bitDerivedPublicKey,
    aes_encrypt,
    aes_decrypt,
    decrypt_corp_info,
} from "../../common/crypto_test"

import {
    add_member_group,
    remove_invite_group,
    hide_group,
    fetch_user_info,
    get_group_info,
    remove_group_member,
    remove_group_member_all,
    change_group_title,
    exist_group_member,
    add_member_group_exist,
    all_invite_list,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    add_member_group,
    remove_invite_group,
    hide_group,
    fetch_user_info,
    get_group_info,
    remove_group_member,
    remove_group_member_all,
    change_group_title,
    exist_group_member,
    add_member_group_exist,
    all_invite_list,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

    constructor() {
        super()
        this.state = {
            add_email:""
        }
    }

    componentDidMount() {
        /*if(this.getGroupId() == null) {
            alert(translate("wrong_url_enter"))
            return history.goBack()
        }*/
        if(this.getGroupId() != null && !isNaN(this.getGroupId()) ) {
            setTimeout(async()=>{
                this.props.onRefresh && (await this.props.onRefresh());
                await this.onRefresh()
            })
        }
    }

    onRefresh = async (nextProps) => {
        nextProps = !!nextProps ? nextProps : this.props
        
        await window.showIndicator()

        let info = await this.props.get_group_info(this.getGroupId(nextProps), 0, true )

        for(let v of info.invite_list) {
            if(v.data_for_inviter) {
                v.data_for_inviter = JSON.parse(aes_decrypt(Buffer.from(v.data_for_inviter, 'hex'), Buffer.from(this.props.user_info.corp_key, "hex") ))
            }
        }

        for(let v of info.members) {
            if(v.info) {
                v.info = JSON.parse(aes_decrypt(Buffer.from(v.info, 'hex'), Buffer.from(this.props.user_info.corp_key, "hex") ))
            }
        }

        await this.setState({...info})
        await window.hideIndicator()

    }

    componentWillReceiveProps(nextProps) {
        let prev_group_id = nextProps.group_id || null
        let group_id = this.props.group_id || null

        if(prev_group_id != group_id) {
            (async()=>{
                await this.onRefresh(nextProps)
            })()
        }
    }

    getGroupId(nextProps) {
        let props = !!nextProps ? nextProps : this.props

        let group_id = props.group_id
        if(!group_id) group_id = props.match.params.menu ? props.match.params.menu : null
        return group_id
    }

    onChangeGroupTitle = () => {
        window.openModal("AddCommonModal", {
            icon:"fas fa-users",
            title:translate("change_group_name"),
            subTitle:translate("new_group_name"),
            placeholder:translate("please_input_group_name"),
            confirmText:translate("change"),
            onConfirm: async (group_name) => {
                let resp = this.props.change_group_title(this.getGroupId(), group_name)
                if(resp) {
                    alert(translate("succes_group_name"))
                    await this.onRefresh()
                }
            }
        })
    }

    onRemoveGroup = async () => {

        window.openModal("RemoveCommonModal", {
            icon:"fas fa-trash",
            title:translate("remove_group"),
            subTitle:translate("remove_group_desc_1", [this.state.group.title]),
            onDelete: async (group_name) => {
                let resp = this.props.hide_group(this.getGroupId())
                if(resp){
                    alert(translate("success_remove_group"))
                    return history.push("/group")
                }
                alert(translate("fail_remove"))
            }
        })
    }

    onAddMember = async ()=>{
        if(this.state.add_email == "")
            return alert(translate("please_input_invite_member_email"))
        
        let email = this.state.add_email.trim()

        if(!window.email_regex.test(email))
            return alert(translate("no_email_regex"))
        

        await window.showIndicator()

        let exist = await this.props.exist_group_member(this.getGroupId(), email)

        let group_key = get256bitDerivedPublicKey(Buffer.from(this.props.user_info.corp_master_key, 'hex'), "m/0'/"+this.getGroupId()+"'").toString('hex');

        let data = {
            company_name: this.props.user_info.company_name,
            duns_number: this.props.user_info.duns_number,
            company_ceo: this.props.user_info.company_ceo,
            company_address: this.props.user_info.company_address,
            corp_key:this.props.user_info.corp_key,
            corp_id:this.props.user_info.corp_id,
            group_id:this.getGroupId(),
            group_key,
        }

        if(exist.code == -5) {

            let data_for_inviter = {
                email
            }

            let all_invite_list = await this.props.all_invite_list()

            for(let v of all_invite_list) {
                if(v.email_hashed == md5(email+v.passphrase1) ) {
                    await window.hideIndicator()
                    if(v.group_id == this.getGroupId())
                        return alert(translate("already_invite_this_group"))
                    else
                        return alert(translate("already_invite_another_group"))
                }
            }

            let resp = await this.props.add_member_group(this.getGroupId(), email, this.props.user_info.corp_key, data, data_for_inviter);
            if(resp) {
                if(resp.code == 1) {
                    this.setState({
                        add_email:""
                    })
                    alert(translate("success_invite_group"))
                } else if(resp.code == 2) {
                    alert(translate("already_this_group"))
                } else if(resp.code == -5) {
                    alert(translate("no_email_regex"))
                } else if(resp.code == -7) {
                    alert(translate("success_invite_group_but_not_email", [resp.invite_code]))
                } else if(resp.code == -8) {
                    alert(translate("already_register_individual"))
                } else if(resp.code == -9) {
                    alert(translate("already_register_corporation"))
                }
                await this.onRefresh()
            }
        } else if(exist.code == 1) {
            let data = {
                group_id:this.getGroupId(),
                group_key,
            }
            let resp = await this.props.add_member_group_exist(exist.payload.account_id, this.getGroupId(), email, data)

            if(resp.code == 1) {
                this.setState({
                    add_email:""
                })
                await this.onRefresh()
                alert(translate("success_invite_group"))
            } else if(resp.code == -7) {
                alert(translate("no_account_this_email"))
            } else if(resp.code == -8) {
                alert(translate("already_register_individual"))
            } else if(resp.code == -9) {
                alert(translate("already_register_corporation"))
            }

        } else if(exist.code == -6) {
            alert(translate("already_this_group"))
        }
        await window.hideIndicator()
    }

    onRemoveInviteList = async (invite_id) => {
        if( await window.confirm(translate("cancel_invitation"), translate("cancel_invitation_desc_1")) ){
            let resp = await this.props.remove_invite_group(this.getGroupId(), invite_id)
            if(resp) {
                alert(translate("success_cancel_invitation"))
                await this.onRefresh()
            }
            else
                alert(translate("fail_cancel_invitation"))
        }
    }

    onRemoveGroupMember = async (account_id) => {

        window.openModal("RemoveCommonModal", {
            icon:"fas fa-trash",
            title:translate("delete_group_member"),
            subTitle:translate("delete_group_member_desc_1"),
            onDelete: async (group_name) => {
                let resp = await this.props.remove_group_member(this.getGroupId(), account_id)
                if(resp) {
                    alert(translate("success_group_member"))
                    await this.onRefresh()
                }
                else {
                    alert(translate("fail_group_member"))
                }
            }
        })
    }

    onCopyRegisterLink = async (invite) => {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = `https://e-contract.io/register?registration_code=${invite.invite_code}&email_address=${invite.data_for_inviter.email}`;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);

        alert(translate("success_link_copy"))
    }

    onAllRemoveGroupMembers = async () => {

        window.openModal("RemoveCommonModal", {
            icon:"fas fa-trash",
            title:translate("remove_group_member_all"),
            subTitle:translate("remove_group_member_all_desc_1"),
            onDelete: async (group_name) => {
                let resp = await this.props.remove_group_member_all(this.getGroupId())
                if(resp) {
                    alert(translate("success_group_member"))
                    await this.onRefresh()
                }
                else {
                    alert(translate("fail_group_member"))
                }
            }
        })
    }

	render() {
        if(!this.state.group || this.getGroupId() == null )
            return <div></div>
		
        return (<div className="corp-group-info">
            <div className="group-head">
                <div className="info">
                    <div className="title">
                        <i className="fal fa-building"></i>
                        <span>{this.state.group.title}</span>
                    </div>
                    <div className="date">
                        {translate("create_date")} : {moment(this.state.group.added_at).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                    <div className="button-container">
                        <div className="button" onClick={this.onChangeGroupTitle}>{translate("change_group_name")}</div>
                        <div className="button delete" onClick={this.onRemoveGroup}>{translate("remove")}</div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="title">
                    <div className="head">{translate("group_member_manage")}</div>
                    <div className="desc">{translate("group_manage_change_delete_available")}</div>
                </div>
                <div className="row">
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">{translate("group_member_list")}</div>
                            <div className="form-list">
                                {this.state.members.map((e, k)=>{
                                    return <div className="item" key={k}>
                                        <div className="icon">
                                            <i className="fas fa-user-tie"></i>
                                        </div>
                                        <div className="desc">
                                                <div className="username">{e.info.username}</div>
                                                <div className="email">{e.info.email}</div>
                                        </div>
                                        <div className="privilege">
                                            {e.info.job}
                                        </div>
                                        <div className="action">
                                            <div className="delete" onClick={this.onRemoveGroupMember.bind(this, e.account_id)}>{translate("remove")}</div>
                                        </div>
                                    </div>
                                })}
                                {this.state.members.length == 0 ? <div className="empty">{translate("no_group_member")}</div> : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="title">
                    <div className="head">{translate("invite_group_member")}</div>
                    <div className="desc">{translate("invite_group_member_desc_1")}<br/>{translate("invite_group_member_desc_2")}</div>
                </div>
                <div className="row">
                    <div className="right-form">
                        <div className="column column-flex-2">
                            <div className="form-head">{translate("group_member_email")}</div>
                            <div className="form-input">
                                <input className="common-textbox" id="email" type="email"
                                    placeholder={translate("please_input_email")}
                                    value={this.state.add_email || ""}
                                    onChange={e=>this.setState({add_email:e.target.value})}/>
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-head">&nbsp;</div>
                            <div className="form-input">
                                <div className={"btn-add-user" + ( (this.state.add_email || "").length==0 ? "" : " btn-add-user-active" )} onClick={this.onAddMember}>{translate("add")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">{translate("group_invite_member_list")}</div>
                            <div className="form-list form-list-600">
                                {this.state.invite_list.map((e, k)=>{
                                    return <div className="item" key={k}>
                                        <div className="desc">
                                            <div className="email">{e.data_for_inviter.email}</div>
                                        </div>
                                        <div className="long-action">
                                            <div className="copy" onClick={this.onCopyRegisterLink.bind(this, e)}>{translate("register_link_copy")}</div>
                                        </div>
                                        <div className="action">
                                            <div className="delete" onClick={this.onRemoveInviteList.bind(this, e.invite_id)}>{translate("cancel")}</div>
                                        </div>
                                    </div>
                                })}
                                {this.state.invite_list.length == 0 ? <div className="empty">{translate("no_invite_member")}</div> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
	}
}
