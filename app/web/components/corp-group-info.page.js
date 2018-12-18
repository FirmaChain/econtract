import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import Information from "./information.comp"
import moment from "moment"

import {
    add_member_group,
    remove_invite_group,
    remove_group,
    fetch_user_info,
    get_group_info,
    remove_member_group,
    change_group_title,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    add_member_group,
    remove_invite_group,
    remove_group,
    fetch_user_info,
    get_group_info,
    remove_member_group,
    change_group_title,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

    constructor() {
        super()
        this.state = {
            add_email:"",
            info:null,
            invited_list:[{
                invite_id:0,
                email:"pbes0707@gmail.com"
            },{
                invite_id:1,
                email:"daeun@gmail.com"
            }],
            group_members:[{
                account_id:1,
                username:"윤대현",
                email:"daehyun@gmail.com",
                job:"선임연구원"
            },{
                account_id:2,
                username:"윤대현",
                email:"daehyun@gmail.com",
                job:"선임연구원"
            }]
        }
    }

    componentDidMount() {
        if(this.getGroupId() == null) {
            alert("잘못된 경로로 들어왔습니다.")
            return history.goBack()
        } else if(!this.props.user_info){
            (async()=>{
                await window.showIndicator()
                await this.props.fetch_user_info()
                let info = await this.props.get_group_info(this.getGroupId())
                await this.setState({info})
                await window.hideIndicator()
            })()
        }
    }

    componentWillReceiveProps(props) {
        if(props.user_info === false) {
            history.replace("/login")
        }
    }

    onRefresh = async () => {
        let info = await this.props.get_group_info(this.getGroupId())
        await this.setState({info})
    }

    getGroupId() {
        let group_id = this.props.match.params.group_id || null
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
            subTitle:"인사팀 그룹을 삭제합니다.<br/>삭제하시겠습니까?",
            onDelete: async (group_name) => {
                let resp = this.props.remove_group(this.getGroupId())
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

        let resp = await this.props.add_member_group(this.getGroupId(), this.state.add_email, {});
        return alert(JSON.stringify(resp));
    }

    onRemoveInviteList = async (invite_id) => {
        let resp = await this.props.remove_invite_group(this.getGroupId(), invite_id)
        if(resp) {
            alert("초대를 취소하였습니다.")
            await this.onRefresh()
        }
        else
            alert("초대 취소에 실패하였습니다.")
    }

    onRemoveGroupMember = async (account_id) => {
        let resp = await this.props.remove_member_group(this.getGroupId(), account_id)
        if(resp) {
            alert("멤버를 해당 그룹에서 삭제했습니다.")
            await this.onRefresh()
        }
        else
            alert("멤버 삭제에 실패하였습니다.")
    }

	render() {
		return (<div className="upsert-contract-group-page header-page">
            <div className="header">
                <div className="left-logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/home")}/>
                </div>
                { !!this.props.user_info ? <Information /> : null }
            </div>
            <div className="head group-head">
                <span className="back" onClick={()=> history.goBack()}>
                    <i className="fal fa-chevron-left"></i> <span>뒤로가기</span>
                </span>
                <div className="info">
                    <div className="title">
                        <i className="fal fa-building"></i>
                        <span>인사팀</span>
                    </div>
                    <div className="date">
                        {moment().toString()}
                    </div>
                    <div className="button-container">
                        <div className="button" onClick={this.onChangeGroupTitle}>그룹명 변경</div>
                        <div className="button delete" onClick={this.onRemoveGroup}>삭제</div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">그룹원 초대하기</div>
                        <div className="desc-content">추가하실 그룹원의 정보를 입력하여 추가하세요</div>
                    </div>
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
                    <div className="left-desc">
                        <div className="desc-head"></div>
                        <div className="desc-content"></div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">초대한 그룹원 리스트</div>
                            <div className="form-list form-list-400">
                                {this.state.invited_list.map((e, k)=>{
                                    return <div className="item" key={k}>
                                        <div className="desc">
                                            <div className="email">{e.email}</div>
                                        </div>
                                        <div className="action">
                                            <div className="delete" onClick={this.onRemoveInviteList.bind(this, e.invite_id)}>취소</div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">그룹원 관리</div>
                        <div className="desc-content">해당 그룹에서 그룹 변경 및 삭제 처리하실 수 있습니다</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">그룹원 리스트</div>
                            <div className="form-list">
                                {this.state.group_members.map((e, k)=>{
                                    return <div className="item" key={k}>
                                        <div className="icon">
                                            <i className="fas fa-user-tie"></i>
                                        </div>
                                        <div className="desc">
                                                <div className="username">{e.username}</div>
                                                <div className="email">{e.email}</div>
                                        </div>
                                        <div className="privilege">
                                            {e.job}
                                        </div>
                                        <div className="action">
                                            <div className="delete" onClick={this.onRemoveGroupMember.bind(this, e.account_id)}>삭제</div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
	}
}
