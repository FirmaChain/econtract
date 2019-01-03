import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Information from "./information.comp"
import Pager from "./pager"
import TransactionBackgroundWork from "./transaction_background_work"
import CheckBox2 from "./checkbox2"
import history from '../history'
import Route from "./custom_route"
import moment from "moment"


import {
    get256bitDerivedPublicKey,
    aes_encrypt,
    hmac_sha256,
    bip32_from_512bit,
} from "../../common/crypto_test"

import {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
    openGroup,
    closeGroup,
    get_group_info,
    create_group,
    get_corp_member_info_all,
    get_corp_member_info,
    update_group_public_key,
    fetch_user_info,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        folders:state.contract.folders,
        user_info: state.user.info,
        board:state.contract.board,
        isOpenGroupList: state.group.isOpenGroupList,
        groups: state.group.groups,
        members: state.group.members,
	}
}

let mapDispatchToProps = {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
    openGroup,
    closeGroup,
    get_group_info,
    create_group,
    get_corp_member_info_all,
    get_corp_member_info,
    update_group_public_key,
    fetch_user_info,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            board_checks : [],
        };
	}

	componentDidMount() {
        (async()=>{
            await this.props.get_group_info(0)
            //let dodo = await this.props.get_corp_member_info(128, this.props.user_info.corp_key)
            await this.props.get_corp_member_info_all(this.props.user_info.corp_key)
            let account_id = this.props.match.params.account_id || null
            if(account_id) {
                let member = await this.props.get_corp_member_info(account_id, this.props.user_info.corp_key)
                this.props.openGroup(member.group_id)
                this.setState({
                    member
                })
            }

        })()
	}

    componentWillReceiveProps(props){
        if(props.user_info === false) {
            history.replace("/login")
        }

        let prevMenu = this.props.match.params.menu || "all"
        let menu = props.match.params.menu || "all"

        let prev_account_id = this.props.match.params.account_id || null
        let account_id = props.match.params.account_id || null

        if(prevMenu != menu || prev_account_id != account_id){
            this.componentDidMount()
        }
    }

	onClickAddGroup = () => {
        window.openModal("AddCommonModal", {
            icon:"fas fa-users",
            title:"그룹 추가",
            subTitle:"새 그룹명",
            placeholder:"그룹명을 입력해주세요.",
            onConfirm: async (group_name) => {
                let resp = await this.props.create_group(group_name);
                await this.props.update_group_public_key(resp.group_id, this.props.user_info.corp_master_key);

                if(resp) {
                    await this.props.get_group_info(0)
                    await this.props.fetch_user_info()
                    alert("성공적으로 그룹이 추가되었습니다.")
                }
            }
        })
	}

	getTitle() {
        let menu = this.props.match.params.menu || "all"
		let account_id = this.props.match.params.account_id || null
        let groups = this.props.groups ? this.props.groups : []

        for(let v of groups) {
            if(menu == v.group_id) {
                if(!!account_id) {
                    let username = ""
                    if(!!this.state.member)
                        username = this.state.member.data.username
                    return { id:v.group_id, account_id:account_id, title:"#" + v.title + " " + username}
                }
                else {
                    return { id:v.group_id, title:"#" + v.title}
                }
            }
        }

		if(menu == "unclassified") {
            if(!!account_id) {
                let username = ""
                if(!!this.state.member)
                    username = this.state.member.data.username
                return { id:"unclassified", account_id:account_id, title : "분류되지 않은 그룹원 #" + username}
            }
            else {
                return { id:"unclassified", title : "분류되지 않은 그룹원"}
            }
        }
		else if(menu == "withdraw") {
			return { id:"withdraw", title : "탈퇴한 그룹원"}
        }
		return { id:"all", title : "모든 계약"}
	} 

    onClickPage = async(page)=>{
    	if(this.state.cur_page == page)
    		return;

        await this.props.recently_contracts(page - 1);
        this.setState({
            cur_page:page,
            board_checks:[]
        })
    }

    move(pageName) {
        history.push(`/group/${pageName}`)
    }

    moveGroup(group_id) {
        history.push(`/group/${group_id}`)
        this.props.openGroup(group_id)
    }

    moveGroupMember(group_id, account_id) {
        history.push(`/group/${group_id}/${account_id}`)
        this.props.openGroup(group_id)
    }

    openGroupInfo(group_id, e) {
        e.stopPropagation()
        history.push(`/group-info/${group_id}`)
    }

    openCloseGroup(group_id, e) {
        e.stopPropagation()
        let list = [...this.props.isOpenGroupList]

        for(let v of list) {
            if(v == group_id) {
                this.props.closeGroup(group_id)
                return;
            }
        }
        this.props.openGroup(group_id)
    }

    isOpenGroup(group_id) {

        for(let v of this.props.isOpenGroupList)
            if(v == group_id)
                return true;
        return false;
    }


    isOpenOption(contract_id) {
        return this.state.showOption == contract_id;
    }
    
    onClickOption(contract_id) {
        if(this.state.showOption == contract_id) {
            return this.setState({
                showOption:null
            })
        }

        this.setState({
            showOption:contract_id
        })
    }

    checkBoard(contract_id) {
        let l = [...this.state.board_checks], isCheckAll = false

        let push_flag = true
        for(let i in l) {
            if(l[i] == contract_id) {
                l.splice(i, 1)
                push_flag = false
                break;
            }
        }

        if(push_flag)
            l.push(contract_id)

        this.setState({
            board_checks:l
        })
    }

    render_board_slot(e,k){
        let status_text = (status)=>{
            if(status == 0) {
                return "내용 입력 중"
            } else if(status == 1) {
                return "서명 전"
            } else if(status == 2) {
                return "계약 완료"
            } else if(status == 3) {
                return "보기 가능"
            }
        }
        return (<div key={e.contract_id} className="item">
            <div className="list-body-item list-chkbox">
                <CheckBox2 size={18}
                    on={this.state.board_checks.includes(e.contract_id) || false}
                    onClick={this.checkBoard.bind(this, e.contract_id)}/>
            </div>
            <div className="list-body-item list-name">
                {e.name}
                <div className="sub">서명 : 홍길동(생성자), 누구누구 외 2명</div>
            </div>
            <div className="list-body-item list-status">
                {status_text(e.status)}
                <div className="sub">새로운 메시지가 도착했습니다.</div>
            </div>
            <div className="list-body-item list-date">{moment(e.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</div>
            <div className="list-body-item list-action">
                <div className="button-container">
                    <div className="action-button action-blue-but">서명</div>
                    <div className="arrow-button arrow-blue-but" onClick={this.onClickOption.bind(this, e.contract_id)} >
                        <i className="fas fa-caret-down"></i>
                        <div className="arrow-dropdown" style={{display:!!this.isOpenOption(e.contract_id) ? "initial" : "none"}}>
                            <div className="container">
                                <div className="detail">상세 정보</div>
                                <div className="move">이동</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

	render() {
        let folders = this.props.folders ? this.props.folders : { list: [] }
        let groups = this.props.groups ? this.props.groups : []
        let members = this.props.members ? this.props.members : []

        let board = this.props.board ? this.props.board : { list:[] }
        let total_cnt = board.total_cnt
        let page_num = board.page_num

		return (<div className="group-page">
			<div className="contract-group-menu">
				<div className="left-top-button" onClick={this.onClickAddGroup}>그룹 추가하기</div>
				<div className="menu-list">
                    <div className="list">
                        <div className={"item" + (this.getTitle().id == "all" ? " selected" : "")} onClick={this.moveGroup.bind(this, "")}>
                            <i className="icon fal fa-clock"></i>
                            <div className="text">모든 계약</div>
                        </div>
                    </div>
					<div className="list">
						<div className="title">그룹</div>
                        {groups.map((e,k)=>{
                            let memberList = []
                            for(let v of members) {
                                if(v.group_ids && v.group_ids.includes(e.group_id)) {
                                    memberList.push(<div key={e.group_id+" "+v.account_id} className={"item sub" + (this.isOpenGroup(e.group_id) ? "" : " hide")} onClick={this.moveGroupMember.bind(this, e.group_id, v.account_id)}>
                                        <i className="icon fas fa-user"></i>
                                        <div className="text">{v.data.username}</div>
                                        <i className="setting far fa-ellipsis-h"></i>
                                    </div>)
                                }
                            }
                            return [<div key={e.group_id} className={"item" + (this.getTitle().id == e.group_id ? " selected" : "")}
                                onClick={this.moveGroup.bind(this, e.group_id)}>
                                <div className="text">#{e.title}</div>
                                <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, e.group_id)}></i>
                                <i className={"angle far " + ( this.isOpenGroup(e.group_id) ? "fa-angle-down" : "fa-angle-up" )} onClick={this.openCloseGroup.bind(this, e.group_id)}></i>
                            </div>, ...memberList]
                        })}


						<div className={"item" + (this.getTitle().id == "unclassified" ? " selected" : "")} onClick={this.moveGroup.bind(this, "unclassified")}>
                            <i className="icon fas fa-share-square"></i> 
                            <div className="text">분류되지 않은 그룹원</div>
                            <i className={"angle far "  + ( this.isOpenGroup("unclassified") ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, "unclassified")}></i>
                        </div>
                        {members.map((e,k)=>{
                            if(e.group_ids == null) {
                                return <div key={"unclassified "+e.account_id} className={"item sub" + (this.isOpenGroup("unclassified") ? "" : " hide")} onClick={this.moveGroupMember.bind(this, "unclassified", e.account_id)}>
                                    <i className="icon fas fa-user"></i>
                                    <div className="text">{e.data.username}</div>
                                    <i className="setting far fa-ellipsis-h"></i>
                                </div>
                            }
                        })}

						<div className={"item" + (this.getTitle().id == "withdraw" ? " selected" : "")} onClick={this.moveGroup.bind(this, "withdraw")}>
                            <i className="icon fas fa-handshake-alt"></i>
                            <div className="text">탈퇴한 그룹원</div>
                            <i className={"angle far "  + ( this.isOpenGroup("withdraw") ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, "withdraw")}></i>
                        </div>
					</div>
				</div>
			</div>
            <div className="contract-list">
                <div className="title">{this.getTitle().title}</div>
                <div className="list" style={{marginTop:"20px"}}>
                    <div className="head">
                        <div className="list-head-item list-chkbox">
                            <CheckBox2 size={18}
                                on={this.state.target_me}
                                onClick={()=>this.setState({target_me:!this.state.target_me})}/>
                        </div>
                        <div className="list-head-item list-name">계약명</div>
                        <div className="list-head-item list-status">상태</div>
                        <div className="list-head-item list-date">마지막 활동 시간</div>
                        <div className="list-head-item list-action"></div>
                    </div>
                    {board.list.map((e,k)=>{
                        return this.render_board_slot(e,k)
                    })}
                    {board.list.length == 0 ? <div className="empty-contract">계약서가 없습니다.</div> : null}
                </div>
                
                <Pager max={Math.ceil(total_cnt/page_num)} cur={this.state.cur_page||1} onClick={this.onClickPage} />
            </div>
		</div>)
	}
}







