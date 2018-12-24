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
    recently_contracts,
    get_group_info,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        folders:state.contract.folders,
        user_info: state.user.info,
        board:state.contract.board,
        groups: state.group.groups,
	}
}

let mapDispatchToProps = {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
    recently_contracts,
    get_group_info,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            board_checks : [],
            showGroupMenu: false,
            showOptions: null,
            cur_page:1
        };
	}

	componentDidMount() {
        (async()=>{
            await this.onRefresh();
        })()
	}

    onRefresh = async (nextProps) => {
        await this.props.folder_list()

        if(this.props.user_info.account_type == 1 || this.props.user_info.account_type == 2) {
            let groups_info = await this.props.get_group_info(0)

            let group_id = this.props.match.params.group_id || null
            if(!group_id) {
                history.replace(`/home/${groups_info[0].group_id}/recently`)
            }
        }

        if(this.getTitle(nextProps).id == "recently")
            await this.props.recently_contracts()
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.user_info === false) {
            history.replace("/login")
        }

        let prevMenu = nextProps.match.params.menu || "recently"
        let menu = this.props.match.params.menu || "recently"
        if(prevMenu != menu){
            this.onRefresh(nextProps)
        }
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
		else if(menu == "view") {
			result = { id:"view", title : "보기 가능"}
		}
		else if(menu == "completed") {
			result = { id:"completed", title : "완료됨"}
		}
		else if(menu == "deleted") {
			result = { id:"deleted", title : "삭제됨"}
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

        await this.props.recently_contracts(page - 1);
        this.setState({
            cur_page:page,
            board_checks:[]
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
                    await this.props.folder_list()
                }
            }
        })
    }

    onRemoveFolder = async (folder_id, folder_name) => {
        if( await window.confirm("폴더 삭제", `<b>${folder_name}</b> 를 정말 삭제하시겠습니까?`) ){
            await this.props.remove_folder([folder_id])
            await this.props.folder_list()
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

    checkAll = () => {
        let board = this.props.board ? this.props.board : { list:[ {contract_id:0}, {contract_id:1}, {contract_id:2}, {contract_id:3}] }
        board = { list:[ {contract_id:0}, {contract_id:1}, {contract_id:2}, {contract_id:3}] }
        let check_list = board.list.map( (e) => e.contract_id )

        if(this.isCheckAll())
            check_list = []

        this.setState({
            board_checks:check_list
        })
    }

    isCheckAll = () => {
        let board = this.props.board ? this.props.board : { list:[ {contract_id:0}, {contract_id:1}, {contract_id:2}, {contract_id:3}] }
        board = { list:[ {contract_id:0}, {contract_id:1}, {contract_id:2}, {contract_id:3}] }
        return this.state.board_checks.length == board.list.length 
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
        // if(!this.props.folders)
        //     return <div />

        let folders = this.props.folders ? this.props.folders : { list: [] }
        let board = this.props.board ? this.props.board : { list:[] }
        let groups = this.props.groups ? this.props.groups : []

        let account_type = this.props.user_info.account_type
        let total_cnt = board.total_cnt
        let page_num = board.page_num

        console.log(this.getTitle())

		return (<div className="contract-page">
			<div className="contract-group-menu">
				<div className="left-top-button" onClick={this.onClickAddContract}>시작하기</div>
				<div className="menu-list">
                    <div className="list">
                        <div className={"item" + (this.getTitle().id == "lock" ? " selected" : "")} onClick={this.move.bind(this, "lock")}><i className="icon fas fa-lock-alt"></i> <div className="text">잠김</div></div>
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
						<div className={"item" + (this.getTitle().id == "view" ? " selected" : "")} onClick={this.move.bind(this, "view")}><i className="icon fas fa-eye"></i> <div className="text">보기 가능</div></div>
						<div className={"item" + (this.getTitle().id == "completed" ? " selected" : "")} onClick={this.move.bind(this, "completed")}><i className="icon fal fa-check-circle"></i> <div className="text">완료됨</div></div>
						<div className={"item" + (this.getTitle().id == "deleted" ? " selected" : "")} onClick={this.move.bind(this, "deleted")}><i className="icon fal fa-trash-alt"></i> <div className="text">삭제됨</div></div>
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
                    {board.list.map((e,k)=>{
                        return this.render_board_slot(e,k)
                    })}
                    {board.list.length == 0 ? <div className="empty-contract">계약서가 없습니다.</div> : null}
                    <div className="item">
                        <div className="list-body-item list-chkbox">
                            <CheckBox2 size={18}
                                on={this.state.board_checks.includes(0) || false}
                                onClick={this.checkBoard.bind(this, 0)}/>
                        </div>
                        <div className="list-body-item list-name">
                            계약서 테스트 11111
                            <div className="sub">서명자 : 홍길동(생성자), 누구누구 외 2명</div>
                        </div>
                        <div className="list-body-item list-status">
                            내 서명 전
                            <div className="sub">새로운 메시지가 도착했습니다.</div>
                        </div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                        <div className="list-body-item list-action">
                            <div className="button-container">
                                <div className="action-button action-blue-but">서명</div>
                                <div className="arrow-button arrow-blue-but" onClick={this.onClickOption.bind(this, 0/*contract_id*/)} >
                                    <i className="fas fa-caret-down"></i>
                                    <div className="arrow-dropdown" style={{display:!!this.isOpenOption(0/*contract_id*/) ? "initial" : "none"}}>
                                        <div className="container">
                                            <div className="detail">상세 정보</div>
                                            <div className="move">이동</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="list-body-item list-chkbox">
                            <CheckBox2 size={18}
                                on={this.state.board_checks.includes(1) || false}
                                onClick={this.checkBoard.bind(this, 1)}/>
                        </div>
                        <div className="list-body-item list-name">
                            계약서 테스트 11111
                            <div className="sub">서명자 : 홍길동(생성자), 누구누구 외 2명</div>
                        </div>
                        <div className="list-body-item list-status">
                            내 서명 전
                            <div className="sub">새로운 메시지가 도착했습니다.</div>
                        </div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                        <div className="list-body-item list-action">
                            <div className="button-container">
                                <div className="action-button action-blue-but">서명</div>
                                <div className="arrow-button arrow-blue-but" onClick={this.onClickOption.bind(this, 1/*contract_id*/)} >
                                    <i className="fas fa-caret-down"></i>
                                    <div className="arrow-dropdown" style={{display:!!this.isOpenOption(1/*contract_id*/) ? "initial" : "none"}}>
                                        <div className="container">
                                            <div className="detail">상세 정보</div>
                                            <div className="move">이동</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="list-body-item list-chkbox">
                            <CheckBox2 size={18}
                                on={this.state.board_checks.includes(2) || false}
                                onClick={this.checkBoard.bind(this, 2)}/>
                        </div>
                        <div className="list-body-item list-name">
                            계약서 테스트 11111
                            <div className="sub">서명자 : 홍길동(생성자), 누구누구 외 2명</div>
                        </div>
                        <div className="list-body-item list-status">
                            내 서명 전
                            <div className="sub">새로운 메시지가 도착했습니다.</div>
                        </div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                        <div className="list-body-item list-action">
                            <div className="button-container">
                                <div className="action-button action-blue-but">서명</div>
                                <div className="arrow-button arrow-blue-but" onClick={this.onClickOption.bind(this, 2/*contract_id*/)} >
                                    <i className="fas fa-caret-down"></i>
                                    <div className="arrow-dropdown" style={{display:!!this.isOpenOption(2/*contract_id*/) ? "initial" : "none"}}>
                                        <div className="container">
                                            <div className="detail">상세 정보</div>
                                            <div className="move">이동</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="list-body-item list-chkbox">
                            <CheckBox2 size={18}
                                on={this.state.board_checks.includes(3) || false}
                                onClick={this.checkBoard.bind(this, 3)}/>
                        </div>
                        <div className="list-body-item list-name">
                            계약서 테스트 11111
                            <div className="sub">서명자 : 홍길동(생성자), 누구누구 외 2명</div>
                        </div>
                        <div className="list-body-item list-status">
                            내 서명 전
                            <div className="sub">새로운 메시지가 도착했습니다.</div>
                        </div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                        <div className="list-body-item list-action">
                            <div className="button-container">
                                <div className="action-button action-blue-but">서명</div>
                                <div className="arrow-button arrow-blue-but" onClick={this.onClickOption.bind(this, 3/*contract_id*/)} >
                                    <i className="fas fa-caret-down"></i>
                                    <div className="arrow-dropdown" style={{display:!!this.isOpenOption(3/*contract_id*/) ? "initial" : "none"}}>
                                        <div className="container">
                                            <div className="detail">상세 정보</div>
                                            <div className="move">이동</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Pager max={Math.ceil(total_cnt/page_num)} cur={this.state.cur_page||1} onClick={this.onClickPage} />
			</div>
		</div>)
	}
}







