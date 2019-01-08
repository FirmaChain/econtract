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
            alert("잘못된 경로로 들어왔습니다.")
            return history.goBack()
        }*/
        if(this.getGroupId() != null && !isNaN(this.getGroupId()) ) {
            setTimeout(async()=>{
                await this.onRefresh()
            })
        }
    }

    onRefresh = async () => {
        await window.showIndicator()
        this.props.onRefresh && (await this.props.onRefresh());

        let user_info = await this.props.fetch_user_info()
        if(!user_info)
            history.push('/login')
        let info = await this.props.get_group_info(this.getGroupId(), 0, true )

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

    componentWillReceiveProps(props) {
        if(props.user_info === false) {
            history.replace("/login")
        }
    }

    getGroupId() {
        let group_id = this.props.group_id
        if(!group_id) group_id = this.props.match.params.menu ? this.props.match.params.menu : null
        return group_id
    }

    onChangeGroupTitle = () => {
        window.openModal("AddCommonModal", {
            icon:"fas fa-users",
            title:"그룹명 변경",
            subTitle:"새 그룹명",
            placeholder:"그룹명을 입력해주세요.",
            confirmText:"변경",
            onConfirm: async (group_name) => {
                let resp = this.props.change_group_title(this.getGroupId(), group_name)
                if(resp) {
                    alert("그룹명 변경에 성공했습니다.")
                    await this.onRefresh()
                }
            }
        })
    }

    onRemoveGroup = async () => {

        window.openModal("RemoveCommonModal", {
            icon:"fas fa-trash",
            title:"그룹 삭제",
            subTitle:`${this.state.group.title} 그룹을 삭제합니다.<br/>삭제하시겠습니까?`,
            onDelete: async (group_name) => {
                let resp = this.props.hide_group(this.getGroupId())
                if(resp){
                    alert("성공적으로 삭제하였습니다.")
                    return history.push("/group")
                }
                alert("삭제에 실패하였습니다.")
            }
        })
    }

    onAddMember = async ()=>{
        if(this.state.add_email == "")
            return alert("초대하려는 그룹원의 이메일을 입력해주세요.")
        

        let email = this.state.add_email.trim()

        if(!window.email_regex.test(email))
            return alert("이메일이 형식에 맞지 않습니다.")
        

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
                        return alert("이미 해당 그룹에 초대중인 사용자입니다.")
                    else
                        return alert("이미 다른 그룹에서 초대중인 사용자입니다.")
                }
            }

            let resp = await this.props.add_member_group(this.getGroupId(), email, this.props.user_info.corp_key, data, data_for_inviter);
            if(resp) {
                if(resp.code == 1) {
                    this.setState({
                        add_email:""
                    })
                    alert("성공적으로 그룹에 초대하였습니다.")
                } else if(resp.code == 2) {
                    alert("이미 해당 그룹에 속해있는 사용자 입니다.")
                } else if(resp.code == -5) {
                    alert("이메일이 형식에 맞지 않습니다.")
                } else if(resp.code == -7) {
                    alert("가입은 되었으나 초대 이메일을 보내지 못했습니다. 초대 코드는 " + resp.invite_code + " 입니다.")
                } else if(resp.code == -8) {
                    alert("이미 개인 계정으로 가입되어 있습니다.")
                } else if(resp.code == -9) {
                    alert("이미 기업 계정으로 가입되어 있습니다.")
                }
                await this.onRefresh()
            }
        } else if(exist.code == 1) {
            let data = {
                group_id:this.getGroupId(),
                group_key,
            }
            let resp = await this.props.add_member_group_exist(exist.payload.account_id, this.getGroupId(), email, data)

            console.log(resp)
            if(resp.code == 1) {
                this.setState({
                    add_email:""
                })
                await this.onRefresh()
                alert("성공적으로 그룹에 초대하였습니다.")
            } else if(resp.code == -7) {
                alert("해당 이메일로 가입한 계정이 없습니다.")
            } else if(resp.code == -8) {
                alert("이미 개인 계정으로 가입되어 있습니다.")
            } else if(resp.code == -9) {
                alert("이미 기업 계정으로 가입되어 있습니다.")
            }

        } else if(exist.code == -6) {
            alert("이미 해당 그룹에 속해있는 사용자 입니다.")
        }
        await window.hideIndicator()
    }

    onRemoveInviteList = async (invite_id) => {
        if( await window.confirm("초대 취소", "해당 그룹원의 초대를 취소하시겠습니까?") ){
            let resp = await this.props.remove_invite_group(this.getGroupId(), invite_id)
            if(resp) {
                alert("초대를 취소하였습니다.")
                await this.onRefresh()
            }
            else
                alert("초대 취소에 실패하였습니다.")
        }
    }

    onRemoveGroupMember = async (account_id) => {

        window.openModal("RemoveCommonModal", {
            icon:"fas fa-trash",
            title:"그룹원 삭제",
            subTitle:`해당 그룹원을 이 그룹에서 삭제하시겠습니까?`,
            onDelete: async (group_name) => {
                let resp = await this.props.remove_group_member(this.getGroupId(), account_id)
                if(resp) {
                    alert("그룹원을 해당 그룹에서 삭제했습니다.")
                    await this.onRefresh()
                }
                else {
                    alert("그룹원을 삭제에 실패하였습니다.")
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

        alert("링크가 복사되었습니다.")
    }

    onAllRemoveGroupMembers = async () => {

        window.openModal("RemoveCommonModal", {
            icon:"fas fa-trash",
            title:"그룹원 전체 삭제",
            subTitle:`모든 그룹원들을 삭제하시겠습니까?`,
            onDelete: async (group_name) => {
                let resp = await this.props.remove_group_member_all(this.getGroupId())
                if(resp) {
                    alert("그룹원을 해당 그룹에서 삭제했습니다.")
                    await this.onRefresh()
                }
                else {
                    alert("그룹원을 삭제에 실패하였습니다.")
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
                        생성일 : {moment(this.state.group.added_at).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                    <div className="button-container">
                        <div className="button" onClick={this.onChangeGroupTitle}>그룹명 변경</div>
                        <div className="button delete" onClick={this.onRemoveGroup}>삭제</div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="title">
                    <div className="head">그룹원 관리</div>
                    <div className="desc">해당 그룹에서 그룹 변경 및 삭제 처리하실 수 있습니다</div>
                </div>
                <div className="row">
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">그룹원 리스트</div>
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
                                            <div className="delete" onClick={this.onRemoveGroupMember.bind(this, e.account_id)}>삭제</div>
                                        </div>
                                    </div>
                                })}
                                {this.state.members.length == 0 ? <div className="empty">그룹원이 없습니다.</div> : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="title">
                    <div className="head">그룹원 초대하기</div>
                    <div className="desc">추가하실 그룹원의 정보를 입력하여 추가하세요.<br/>다른 기업의 서브 계정 혹은 개인 계정은 초대할 수 없습니다.</div>
                </div>
                <div className="row">
                    <div className="right-form">
                        <div className="column column-flex-2">
                            <div className="form-head">그룹원 이메일</div>
                            <div className="form-input">
                                <input className="common-textbox" id="email" type="email"
                                    placeholder="이메일을 입력해주세요"
                                    value={this.state.add_email || ""}
                                    onChange={e=>this.setState({add_email:e.target.value})}/>
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-head">&nbsp;</div>
                            <div className="form-input">
                                <div className={"btn-add-user" + ( (this.state.add_email || "").length==0 ? "" : " btn-add-user-active" )} onClick={this.onAddMember}>추가</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">초대한 그룹원 리스트</div>
                            <div className="form-list form-list-600">
                                {this.state.invite_list.map((e, k)=>{
                                    console.log(e)
                                    return <div className="item" key={k}>
                                        <div className="desc">
                                            <div className="email">{e.data_for_inviter.email}</div>
                                        </div>
                                        <div className="long-action">
                                            <div className="copy" onClick={this.onCopyRegisterLink.bind(this, e)}>가입 링크 복사</div>
                                        </div>
                                        <div className="action">
                                            <div className="delete" onClick={this.onRemoveInviteList.bind(this, e.invite_id)}>취소</div>
                                        </div>
                                    </div>
                                })}
                                {this.state.invite_list.length == 0 ? <div className="empty">초대한 그룹원이 없습니다.</div> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
	}
}
