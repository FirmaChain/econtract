import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import Information from "./information.comp"
import Pager from "./pager"
import CheckBox from "./checkbox"
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
    get_contracts,
    get_group_info,
    update_group_public_key,
    create_group,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        folders:state.contract.folders,
        user_info: state.user.info,
        contracts:state.contract.contracts,
        groups: state.group.groups,
	}
}

let mapDispatchToProps = {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
    get_contracts,
    get_group_info,
    update_group_public_key,
    create_group,
}

const LIST_DISPLAY_COUNT = 10

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            contracts_checks : [],
            showGroupMenu: false,
            showOptions: null,
            cur_page:0
        };
	}

	componentDidMount() {
        (async()=>{
            await this.onRefresh();
        })()
	}

    onRefresh = async (nextProps) => {
        let account_type = this.props.user_info.account_type

        if(account_type == 1 || account_type == 2) {
            let groups_info = await this.props.get_group_info(0)
            let group_id = this.props.match.params.group_id || null

            if(groups_info.length == 0) {
                if(account_type == 1) {
                    window.openModal("AddCommonModal", {
                        icon:"fas fa-users",
                        title:"첫 그룹 추가",
                        subTitle:"첫 번째 그룹 추가는 필수입니다.",
                        placeholder:"그룹명을 입력해주세요.",
                        cancelable:false,
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
                } else if(account_type == 2) {
                    alert("할당된 그룹이 없습니다. 관리자에게 그룹 추가를 요청해주세요.")
                    window.logout()
                    location.reload(true)
                }
            } else if(!group_id) {
                if(groups_info) {
                    history.replace(`/home/${groups_info[0].group_id}/recently`)
                }
            }
        }

        await this.setState({
            contracts_checks : [],
            showGroupMenu: false,
            showOptions: null,
            cur_page:0
        })

        await this.loadContracts(0, nextProps)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.user_info === false) {
            history.replace("/login")
        }

        let prevMenu = nextProps.match.params.menu || "recently"
        let menu = this.props.match.params.menu || "recently"

        let prev_group_id = nextProps.match.params.group_id || null
        let group_id = this.props.match.params.group_id || null

        if(prevMenu != menu || prev_group_id != group_id){
            (async()=>{
                await this.onRefresh(nextProps)
            })()
        }
    }

    loadContracts = async (page, props) => {
        props = !!props ? props : this.props

        let menu = props.match.params.menu || "recently"
        let group_id = props.match.params.group_id || -1

        let result
        if(menu == "recently") {
            result = await this.props.get_contracts(0, -1, page, LIST_DISPLAY_COUNT, -1, group_id)
        }
        else if(menu == "lock") {
            result = await this.props.get_contracts(3, -1, page, LIST_DISPLAY_COUNT, -1, group_id)
        }
        else if(menu == "requested") {
            result = await this.props.get_contracts(2, -1, page, LIST_DISPLAY_COUNT, -1, group_id)
        }
        else if(menu == "created") {
            result = await this.props.get_contracts(1, -1, page, LIST_DISPLAY_COUNT, -1, group_id)
        }
        else if(menu == "typing") {
            result = await this.props.get_contracts(0, 0, page, LIST_DISPLAY_COUNT, -1, group_id)
        }
        else if(menu == "beforeMySign") {
            result = await this.props.get_contracts(0, 1, page, LIST_DISPLAY_COUNT, 0, group_id)
        }
        else if(menu == "beforeOtherSign") {
            result = await this.props.get_contracts(0, 1, page, LIST_DISPLAY_COUNT, 1, group_id)
        }
        else if(menu == "completed") {
            result = await this.props.get_contracts(0, 2, page, LIST_DISPLAY_COUNT, -1, group_id)
        }
        else if(menu == "group_view") {
            result = await this.props.get_contracts(0, 3, page, LIST_DISPLAY_COUNT, 0, group_id)
        }
        else if(menu == "my_view") {
            result = await this.props.get_contracts(0, 3, page, LIST_DISPLAY_COUNT, 1, group_id)
        }

        return result
    }

	onClickAddContract() {
        window.openModal("StartContract",{
            onClick:async(type)=>{
                if(type == 1) {
                    history.push("/add-contract")
                } else if(type == 2) {

                }
            }
        })
	}

	getTitle(props) {
        props = !!props ? props : this.props

        let menu = props.match.params.menu || "recently"
		let group_id = props.match.params.group_id || null

        let result = {}

		if(menu == "lock") {
			result = { id:"lock", title : "잠김"}
        }
		else if(menu == "requested") {
			result = { id:"requested", title : "요청받음"}
        }
		else if(menu == "created") {
			result = { id:"created", title : "생성함"}
        }
		else if(menu == "typing") {
			result = { id:"typing", title : "내용 입력중"}
		}
		else if(menu == "beforeMySign") {
			result = { id:"beforeMySign", title : "내 서명 전"}
		}
		else if(menu == "beforeOtherSign") {
			result = { id:"beforeOtherSign", title : "상대방 서명 전"}
		}
		else if(menu == "completed") {
			result = { id:"completed", title : "완료됨"}
		}
        else if(menu == "group_view") {
            result = { id:"group_view", title : "그룹 보기 가능"}
        }
		else if(menu == "my_view") {
			result = { id:"my_view", title : "내 보기 가능"}
		}
		else
            result = { id:"recently", title : "최근 사용"}

        if(!!group_id) {
            let groups = this.props.groups ? this.props.groups : []
            for(let v of groups) {
                if(v.group_id == group_id) {
                    result.groupName = v.title
                }
            }
        }

        return result
	}

    onClickPage = async(page)=>{
    	if(this.state.cur_page == page)
    		return;

        await this.loadContracts(page - 1)
        this.setState({
            cur_page:page - 1,
            contracts_checks:[]
        })
    }

    move(pageName) {
        let group_id = this.props.match.params.group_id || null

        if(!!group_id)
            return history.push(`/home/${group_id}/${pageName}`)

        return history.push(`/home/${pageName}`)
    }

    moveGroup(group_id) {
        history.push(`/home/${group_id}/${this.getTitle().id}`)
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

    onAddFolder = () => {
        window.openModal("AddCommonModal", {
            icon:"fas fa-folder",
            title:"폴더 추가",
            subTitle:"새 폴더명",
            placeholder:"폴더명을 입력해주세요.",
            onConfirm: async (folder_name) => {
                //TODO 폴더 생성 api

                if(!folder_name || folder_name == "") {
                    return alert("폴더명을 입력해주세요")
                }
                let resp = await this.props.new_folder(folder_name)
                console.log(resp)

                if(resp) {
                    //await this.props.folder_list()
                }
            }
        })
    }

    onRemoveFolder = async (folder_id, folder_name) => {
        if( await window.confirm("폴더 삭제", `<b>${folder_name}</b> 를 정말 삭제하시겠습니까?`) ){
            await this.props.remove_folder([folder_id])
            //await this.props.folder_list()
        }
    }

    onClickGroupMenu = () => {
        this.setState({
            showGroupMenu: !this.state.showGroupMenu
        }) 
    }

    isOpenOption(contract_id) {
        return this.state.showOption == contract_id;
    }

    isOpenGroupMenu() {
        return this.state.showGroupMenu
    }

    checkBoard(contract_id) {
        let l = [...this.state.contracts_checks], isCheckAll = false

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
            contracts_checks:l
        })
    }

    checkAll = () => {
        let contracts = this.props.contracts ? this.props.contracts : { list:[] }
        let check_list = contracts.list.map( (e) => e.contract_id )

        if(this.isCheckAll())
            check_list = []

        this.setState({
            contracts_checks:check_list
        })
    }

    isCheckAll = () => {
        let contracts = this.props.contracts ? this.props.contracts : { list:[] }
        return this.state.contracts_checks.length == contracts.list.length 
    }

    render_contract_slot(e,k){
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

        let usernames = e.user_infos.map(ee => ee.username).filter( ee => !!ee)
        usernames = usernames.join(", ")

        return <div key={e.contract_id} className="item" onClick={v=>history.push(`/contract-info/${e.contract_id}`)}>
            <div className="list-body-item list-chkbox">
                <CheckBox2 size={18}
                    on={this.state.contracts_checks.includes(e.contract_id) || false}
                    onClick={this.checkBoard.bind(this, e.contract_id)}/>
            </div>
            <div className="list-body-item list-name">
                {e.name}
                <div className="sub">{usernames}</div>
            </div>
            <div className="list-body-item list-status">
                {status_text(e.status)}
                <div className="sub">{/*새로운 메시지가 도착했습니다.*/}</div>
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
        </div>
    }

	render() {
        // if(!this.props.folders)
        //     return <div />

        let folders = this.props.folders ? this.props.folders : { list: [] }
        let contracts = this.props.contracts ? this.props.contracts : { list:[] }
        let groups = this.props.groups ? this.props.groups : []

        let account_type = this.props.user_info.account_type
        let total_cnt = contracts.total_cnt

		return (<div className="contract-page">
			<div className="contract-group-menu">
				<div className="left-top-button" onClick={this.onClickAddContract}>시작하기</div>
				<div className="menu-list">
                    <div className="list">
                        <div className={"item" + (this.getTitle().id == "lock" ? " selected" : "")} onClick={this.move.bind(this, "lock")}><i className="icon fas fa-lock-alt"></i> <div className="text">잠김</div></div>
                        <div className={"item" + (this.getTitle().id == "my_view" ? " selected" : "")} onClick={this.move.bind(this, "my_view")}><i className="icon far fa-eye"></i> <div className="text">내 보기 가능</div></div>
                    </div>
                    { account_type != 0 ? (<div className="list">
                        <div className="item group-item" onClick={this.onClickGroupMenu}>
                            <div className="text">{this.getTitle().groupName}</div>
                            <i className={"angle far " + (!!this.isOpenGroupMenu() ? "fa-angle-down" : "fa-angle-up")}></i>
                        </div>
                        {groups.map( (e, k) => {
                            return <div className="item" key={e.group_id} onClick={this.moveGroup.bind(this, e.group_id)} style={{display:!!this.isOpenGroupMenu() ? "flex" : "none"}}>
                                <i className="icon fas fa-user-tie"></i>
                                <div className="text">{e.title}</div>
                            </div>
                        })}
                    </div>) : null
                    }
					<div className="list">
						<div className="title">계약</div>
						<div className={"item" + (this.getTitle().id == "recently" ? " selected" : "")} onClick={this.move.bind(this, "recently")}><i className="icon fal fa-clock"></i> <div className="text">최근 사용</div></div>
						<div className={"item" + (this.getTitle().id == "requested" ? " selected" : "")} onClick={this.move.bind(this, "requested")}><i className="icon fas fa-share-square"></i> <div className="text">요청받음</div></div>
						<div className={"item" + (this.getTitle().id == "created" ? " selected" : "")} onClick={this.move.bind(this, "created")}><i className="icon fas fa-handshake-alt"></i> <div className="text">생성함</div></div>
					</div>
					<div className="list">
						<div className="title">모아보기</div>
						<div className={"item" + (this.getTitle().id == "typing" ? " selected" : "")} onClick={this.move.bind(this, "typing")}><i className="icon fal fa-keyboard"></i> <div className="text">내용 입력 중</div></div>
						<div className={"item" + (this.getTitle().id == "beforeMySign" ? " selected" : "")} onClick={this.move.bind(this, "beforeMySign")}><i className="icon far fa-file-import"></i> <div className="text">내 서명 전</div></div>
						<div className={"item" + (this.getTitle().id == "beforeOtherSign" ? " selected" : "")} onClick={this.move.bind(this, "beforeOtherSign")}><i className="icon far fa-file-export"></i> <div className="text">상대방 서명 전</div></div>
						<div className={"item" + (this.getTitle().id == "completed" ? " selected" : "")} onClick={this.move.bind(this, "completed")}><i className="icon fal fa-check-circle"></i> <div className="text">완료됨</div></div>
                        {account_type != 0 ? <div className={"item" + (this.getTitle().id == "group_view" ? " selected" : "")} onClick={this.move.bind(this, "group_view")}><i className="icon fas fa-eye"></i> <div className="text">그룹 보기 가능</div></div> : null}
					</div>
					<div className="list">
						<div className="title">
                            <div className="text">폴더</div>
                            <i className="angle far fa-plus" onClick={this.onAddFolder}></i>
                        </div>
						{folders.list.map((e,k)=>{
                            let subject = e.subject || "분류되지 않은 계약"
                            let folder_id = e.folder_id || 0
                            return <div className="item" key={e+k}>
                                <i className={`fas icon ${folder_id == 0 ? "fa-thumbtack":"fa-folder"}`} />
                                <div className="text">{subject}</div>
                                {folder_id != 0 ? <i className="angle fal fa-trash" onClick={this.onRemoveFolder.bind(this, folder_id, subject)}></i> : null }
                            </div>
                        })}
					</div>
				</div>
			</div>
			<div className="contract-list">
				<div className="title">{this.getTitle().title}</div>
				<div className="list" style={{marginTop:"20px"}}>
                    <div className="head">
                        <div className="list-head-item list-chkbox">
                        	<CheckBox2 size={18}
                        		on={this.isCheckAll()}
                        		onClick={this.checkAll}/>
                        </div>
                        <div className="list-head-item list-name">계약명</div>
                        <div className="list-head-item list-status">상태</div>
                        <div className="list-head-item list-date">마지막 활동 시간</div>
                        <div className="list-head-item list-action"></div>
                    </div>
                    {contracts.list.map((e,k)=>{
                        return this.render_contract_slot(e,k)
                    })}
                    {contracts.list.length == 0 ? <div className="empty-contract">계약서가 없습니다.</div> : null}
                </div>
                
                <Pager max={Math.ceil(total_cnt/LIST_DISPLAY_COUNT)} cur={this.state.cur_page||1} onClick={this.onClickPage} />
			</div>
		</div>)
	}
}







