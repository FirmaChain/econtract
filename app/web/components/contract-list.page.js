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
    get_my_groups_info,
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
    get_my_groups_info,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            board_checks : [],
            showOptions: null
        };
	}

	componentDidMount() {
        (async()=>{
            await this.props.folder_list()

            if(this.props.user_info.account_type == 1 || this.props.user_info.account_type == 2)
                await this.props.get_my_groups_info()

            if(this.getTitle().id == "recently")
                await this.props.recently_contracts()
            
        })()
	}

    componentWillReceiveProps(props){
        if(props.user_info === false) {
            history.replace("/login")
        }
    }

	onClickAddContract(){
        window.openModal("StartContract",{
            onClick:async(type)=>{
                if(type == 1) {
                    history.push("/add-contract")
                } else if(type == 2) {

                }
            }
        })
	}

	getTitle() {
		let menu = this.props.match.params.menu || "recently"

		if(menu == "lock") {
			return { id:"lock", title : "잠김"}
        }
		else if(menu == "requested") {
			return { id:"requested", title : "요청받음"}
        }
		else if(menu == "created") {
			return { id:"created", title : "생성함"}
        }
		else if(menu == "typing") {
			return { id:"typing", title : "내용 입력중"}
		}
		else if(menu == "beforeMySign") {
			return { id:"beforeMySign", title : "내 서명 전"}
		}
		else if(menu == "beforeOtherSign") {
			return { id:"beforeOtherSign", title : "상대방 서명 전"}
		}
		else if(menu == "view") {
			return { id:"view", title : "보기 가능"}
		}
		else if(menu == "completed") {
			return { id:"completed", title : "완료됨"}
		}
		else if(menu == "deleted") {
			return { id:"deleted", title : "삭제됨"}
		}
		return { id:"recently", title : "최근 사용"}
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
        history.push(`/home/${pageName}`)
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

    isOpenOption(contract_id) {
        return this.state.showOption == contract_id;
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
        // if(!this.props.folders)
        //     return <div />

        let folders = this.props.folders ? this.props.folders : { list: [] }
        let board = this.props.board ? this.props.board : { list:[] }
        let total_cnt = board.total_cnt
        let page_num = board.page_num

		return (<div className="contract-page">
			<div className="contract-group-menu">
				<div className="left-top-button" onClick={this.onClickAddContract}>시작하기</div>
				<div className="menu-list">
                    <div className="list">
                        <div className={"item" + (this.getTitle().id == "lock" ? " selected" : "")} onClick={this.move.bind(this, "lock")}><i className="icon fas fa-lock-alt"></i> <div className="text">잠김</div></div>
                    </div>
					<div className="list">
						<div className="title">계약</div>
						<div className={"item" + (this.getTitle().id == "recently" ? " selected" : "")} onClick={this.move.bind(this, "")}><i className="icon fal fa-clock"></i> <div className="text">최근 사용</div></div>
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
						<div className="title">폴더</div>
						{folders.list.map((e,k)=>{
                            let subject = e.subject || "분류되지 않은 계약"
                            let folder_id = e.folder_id || 0
                            return <div className="item" key={e+k}>
                                <i className={`fas icon ${folder_id == 0 ? "fa-thumbtack":"fa-folder"}`} /> {subject}
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
                    <div className="item">
                        <div className="list-body-item list-chkbox">
                            <CheckBox2 size={18}
                                on={false}
                                onClick={()=> {}}/>
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
                                on={false}
                                onClick={()=> {}}/>
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
                                on={false}
                                onClick={()=> {}}/>
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
                                on={false}
                                onClick={()=> {}}/>
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
                    {/*board.list.length == 0 ? <div className="empty-contract" >최근 계약서가 없습니다.</div> : null*/}
                </div>
                
                <Pager max={Math.ceil(total_cnt/page_num)} cur={this.state.cur_page||1} onClick={this.onClickPage} />
			</div>
		</div>)
	}
}







