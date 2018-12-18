import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import Information from "./information.comp"
import Pager from "./pager"
import TransactionBackgroundWork from "./transaction_background_work"
import CheckBox2 from "./checkbox2"
import history from '../history'
import Route from "./custom_route"
import moment from "moment"

import {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
    openGroup,
    closeGroup,
    get_my_group,
    get_my_groups_info,
    get_group_info,
    get_group_members,
    create_group,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        folders:state.contract.folders,
        user_info: state.user.info,
        board:state.contract.board,
        isOpenGroupList: state.group.isOpenGroupList,
        groups: state.group.groups,
	}
}

let mapDispatchToProps = {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
    openGroup,
    closeGroup,
    get_my_group,
    get_my_groups_info,
    get_group_info,
    get_group_members,
    create_group,
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
            let info = await this.props.get_my_groups_info()
            if(info.code == -2)
                alert("그룹 에러")
        })()
	}

	onClickAddGroup = () => {
        window.openModal("AddCommonModal", {
            icon:"fas fa-users",
            title:"그룹 추가",
            subTitle:"새 그룹명",
            placeholder:"그룹명을 입력해주세요.",
            onConfirm: async (group_name) => {
                //TODO 그룹 생성 api
                let resp = await this.props.create_group(group_name);
            }
        })
	}

	getTitle() {
        let menu = this.props.match.params.menu || "all"
		let account_id = this.props.match.params.account_id || null

        for(let i = 0 ; i < 10 ; i++) {
            if(menu == i+"") {
                if(!!account_id)
                    return { id:i.toString(), account_id:account_id, title:"그룹 " + i + "_" + account_id}
                else
                    return { id:i.toString(), title:"그룹 " + i}
            }
        }

		if(menu == "unclassified") {
			return { id:"unclassified", title : "분류되지 않은 그룹원"}
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

    moveGroup(group) {
        history.push(`/group/${group}`)
        this.props.openGroup(group)
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

    render_board_slot(e,k){
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
            } else if(status == 3) {
            	return "보기 가능"
            }
        }
        return (<div key={e.contract_id} className="item">
            <div className="list-body-item list-chkbox">
                <CheckBox2 size={18}
                    on={this.state.board_checks[e.contract_id] || false}
                    onClick={()=> {
                        let l = [...this.state.board_checks]
                        l[e.contract_id] = !l[e.contract_id]
                        this.setState({board_checks:l})
                    }}/>
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
                <div className="action-button blue-but">서명</div>
                <div className="arrow-button blue-but"><i className="fas fa-caret-down"></i></div>
            </div>
        </div>)
    }

	render() {
        let folders = this.props.folders ? this.props.folders : { list: [] }
        let groups = this.props.groups ? this.props.groups : []
        console.log(groups)
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
                            return <div key={e.group_id} className={"item" + (this.getTitle().id == e.group_id ? " selected" : "")}
                                onClick={this.moveGroup.bind(this, e.group_id)}>
                                <div className="text">#{e.title}</div>
                                <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, e.group_id)}></i>
                                <i className={"angle far " + ( this.isOpenGroup(e.group_id) ? "fa-angle-down" : "fa-angle-up" )} onClick={this.openCloseGroup.bind(this, e.group_id)}></i>
                            </div>
                        })}

						<div className={"item" + (this.getTitle().id == "0" ? " selected" : "")} onClick={this.moveGroup.bind(this, "0")}>
                            <div className="text">#인사팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 0)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(0) ? "fa-angle-down" : "fa-angle-up" )} onClick={this.openCloseGroup.bind(this, 0)}></i>
                        </div>
                        <div className={"item sub" + (this.isOpenGroup(0) ? "" : " hide") + ( (this.getTitle().id == "0" && (this.getTitle().account_id || null) == "1") ? " selected" : "")} onClick={this.move.bind(this, "0/1")}>
                            <i className="icon fas fa-user"></i>
                            <div className="text">김상렬</div>
                            <i className="setting far fa-ellipsis-h"></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "1" ? " selected" : "")} onClick={this.moveGroup.bind(this, "1")}>
                            <div className="text">#재무팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 1)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(1) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 1)}></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "2" ? " selected" : "")} onClick={this.moveGroup.bind(this, "2")}>
                            <div className="text">#사업1팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 2)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(2) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 2)}></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "3" ? " selected" : "")} onClick={this.moveGroup.bind(this, "3")}>
                            <div className="text">#사업2팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 3)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(3) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 3)}></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "4" ? " selected" : "")} onClick={this.moveGroup.bind(this, "4")}>
                            <div className="text">#개발1팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 4)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(4) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 4)}></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "5" ? " selected" : "")} onClick={this.moveGroup.bind(this, "5")}>
                            <div className="text">#개발2팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 5)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(5) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 5)}></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "6" ? " selected" : "")} onClick={this.moveGroup.bind(this, "6")}>
                            <div className="text">#인사2팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 6)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(6) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 6)}></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "7" ? " selected" : "")} onClick={this.moveGroup.bind(this, "7")}>
                            <div className="text">#디자인1팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 7)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(7) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 7)}></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "8" ? " selected" : "")} onClick={this.moveGroup.bind(this, "8")}>
                            <div className="text">#디자인2팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 8)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(8) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 8)}></i>
                        </div>
						<div className={"item" + (this.getTitle().id == "9" ? " selected" : "")} onClick={this.moveGroup.bind(this, "9")}>
                            <div className="text">#법무팀</div>
                            <i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, 9)}></i>
                            <i className={"angle far " + ( this.isOpenGroup(9) ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, 9)}></i>
                        </div>


						<div className={"item" + (this.getTitle().id == "unclassified" ? " selected" : "")} onClick={this.moveGroup.bind(this, "unclassified")}>
                            <i className="icon fas fa-share-square"></i> 
                            <div className="text">분류되지 않은 그룹원</div>
                            <i className={"angle far "  + ( this.isOpenGroup("unclassified") ? "fa-angle-down" : "fa-angle-up")}></i>
                        </div>
						<div className={"item" + (this.getTitle().id == "withdraw" ? " selected" : "")} onClick={this.moveGroup.bind(this, "withdraw")}>
                            <i className="icon fas fa-handshake-alt"></i>
                            <div className="text">탈퇴한 그룹원</div>
                            <i className={"angle far "  + ( this.isOpenGroup("withdraw") ? "fa-angle-down" : "fa-angle-up")}></i>
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
                    {/*board.list.length == 0 ? <div className="empty-contract" >최근 계약서가 없습니다.</div> : null*/}
                </div>
                
                <Pager max={Math.ceil(total_cnt/page_num)} cur={this.state.cur_page||1} onClick={this.onClickPage} />
            </div>
		</div>)
	}
}







