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
    decryptPIN,
    aes_encrypt,
} from "../../common/crypto_test"

import {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
    get_contracts,
    get_contract,
    get_group_info,
    update_group_public_key,
    create_group,
    add_counterparties,
    update_epin_group,
    update_epin_account,
    update_contract_user_info,
    is_correct_pin,
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
    get_contract,
    get_group_info,
    update_group_public_key,
    create_group,
    add_counterparties,
    update_epin_group,
    update_epin_account,
    update_contract_user_info,
    is_correct_pin,
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

        if(account_type != 0) {
            let groups = await this.props.get_group_info(0)
            let group_id = this.props.match.params.group_id || null

            if(groups.length == 0) {
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
                if(groups) {
                    history.replace(`/home/${groups[0].group_id}/recently`)
                }
            }
            await this.setState({groups})
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
        
        let groups = []

        if(group_id != -1)
            groups = await this.props.get_group_info(0)

        await window.showIndicator()
        let result
        if(menu == "recently") {
            result = await this.props.get_contracts(0, -1, page, LIST_DISPLAY_COUNT, -1, group_id, this.props.user_info, groups)
        }
        else if(menu == "lock") {
            result = await this.props.get_contracts(3, -1, page, LIST_DISPLAY_COUNT, -1, group_id, this.props.user_info, groups)
        }
        else if(menu == "requested") {
            result = await this.props.get_contracts(2, -1, page, LIST_DISPLAY_COUNT, -1, group_id, this.props.user_info, groups)
        }
        else if(menu == "created") {
            result = await this.props.get_contracts(1, -1, page, LIST_DISPLAY_COUNT, -1, group_id, this.props.user_info, groups)
        }
        else if(menu == "typing") {
            result = await this.props.get_contracts(0, 0, page, LIST_DISPLAY_COUNT, -1, group_id, this.props.user_info, groups)
        }
        else if(menu == "beforeMySign") {
            result = await this.props.get_contracts(0, 1, page, LIST_DISPLAY_COUNT, 0, group_id, this.props.user_info, groups)
        }
        /*else if(menu == "beforeOtherSign") {
            result = await this.props.get_contracts(0, 1, page, LIST_DISPLAY_COUNT, 1, group_id, this.props.user_info, groups)
        }*/
        else if(menu == "completed") {
            result = await this.props.get_contracts(0, 2, page, LIST_DISPLAY_COUNT, -1, group_id, this.props.user_info, groups)
        }
        else if(menu == "group_view") {
            result = await this.props.get_contracts(0, 3, page, LIST_DISPLAY_COUNT, 0, group_id, this.props.user_info, groups)
        }
        else if(menu == "my_view") {
            result = await this.props.get_contracts(0, 3, page, LIST_DISPLAY_COUNT, 1, group_id, this.props.user_info, groups)
        }
        await window.hideIndicator()

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
			result = { id:"beforeMySign", title : "서명 전"}
		}
		/*else if(menu == "beforeOtherSign") {
			result = { id:"beforeOtherSign", title : "상대방 서명 전"}
		}*/
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
    	if(this.state.cur_page == page - 1)
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

    onClickOption(contract_id, e) {
        e.stopPropagation();
        if(this.state.showOption == contract_id) {
            return this.setState({
                showOption:null
            })
        }

        this.setState({
            showOption:contract_id
        })
    }

    onClickSign(contract_id, e) {
        e.stopPropagation();
        history.push(`/edit-contract/${contract_id}`)
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

    openContract = async (contract, type = 0) => {

        if(this.props.user_info.account_type == 0 ) {
            if(contract.is_pin_used == 1 && contract.is_pin_null == 1) {
                let result = await new Promise(r=>window.openModal("TypingPin",{
                    onFinish:(pin)=>{
                        r(pin)
                    },
                }))
                if(!result) return;

                // pin 제대로 된지 확인
                let infos = [{
                    entity_id:contract.entity_id,
                    corp_id:contract.corp_id,
                    epin:contract.epin,
                    eckai:contract.eckai,
                }]
                let correct_pin = await this.props.is_correct_pin(contract, result, infos, this.props.user_info)
                if( correct_pin ) {
                    await this.props.update_epin_account(contract.contract_id, result);
                } else {
                    return alert("잘못된 핀 번호를 입력했습니다.")
                }


                history.push(type==0?`/contract-info/${contract.contract_id}`:`/edit-contract/${contract.contract_id}`)
            } else if(contract.is_pin_used == 0 || (contract.is_pin_used == 1 && contract.is_pin_null == 0)) {
                history.push(type==0?`/contract-info/${contract.contract_id}`:`/edit-contract/${contract.contract_id}`)
            } 
        } else {
            let corps_id = contract.corps_id.split(",")
            let entities_id = contract.entities_id.split(",")

            let list = corps_id.map( (e, k) => {
                return {
                    corp_id:Number(e),
                    entity_id: Number(entities_id[k])
                }
            })

            let isGroup = false
            for(let v of list) {
                if(v.corp_id == this.props.user_info.corp_id) {
                    isGroup = v.entity_id
                    break
                }
            }

            let correct_pin, pin
            if(contract.is_pin_used == 1 && contract.is_pin_null == 1) {
                pin = await new Promise(r=>window.openModal("TypingPin",{
                    onFinish:(pin)=>{
                        r(pin)
                    },
                }))
                if(!pin) return

                let infos = [{
                    entity_id:contract.entity_id,
                    corp_id:contract.corp_id,
                    epin:contract.epin,
                    eckai:contract.eckai,
                }]
                correct_pin = await this.props.is_correct_pin(contract, pin, infos, this.props.user_info, this.state.groups)
                if( !correct_pin ) {
                    return alert("잘못된 핀 번호를 입력했습니다.")
                    /*let user_info = {
                        user_type:1,
                        account_id: user.account_id,
                        username:user.username,
                        email:user.email,
                        public_key:user.publickey_contract,
                        company_name:user.company_name,
                    }
                    await this.props.update_contract_user_info(contract.contract_id, this.props.user_info.account_id, this.props.user_info.corp_id, user_info, this.props.user_info, true, correct_pin)*/
                }


                if(isGroup) {
                    await this.props.update_epin_group(this.props.user_info.corp_id, isGroup, contract.contract_id, this.props.user_info, pin)
                    await this.props.update_epin_account(contract.contract_id, pin);
                }
            }

            if(!isGroup) {
                let groups = await this.props.get_group_info(0)
                let data = groups.map((e) => {
                    return {
                        user_type:2,
                        corp_id: e.corp_id,
                        group_id : e.group_id,
                        title : e.title,
                        public_key : Buffer.from(e.group_public_key).toString("hex"),
                        company_name:this.props.user_info.company_name,
                        role:2,
                    }
                })
                let result = await new Promise(r=>window.openModal("OneAddModal", {
                    icon:"fal fa-users",
                    title:"계약에 그룹 추가하기",
                    subTitle:"그룹 선택",
                    desc:`해당 계약이 선택하신 그룹에 추가됩니다.`,
                    data,
                    onConfirm:async (group)=>{
                        // add_contract_info group
                        //let detail_contract = await this.props.get_contract(contract.contract_id, this.props.user_info, groups)
                        let result = await this.props.add_counterparties(contract.contract_id, [group], groups, this.props.user_info, [contract], contract.is_pin_used, pin)
                        await this.props.update_epin_account(contract.contract_id, pin);
                        await this.props.update_epin_group(group.corp_id, group.group_id, contract.contract_id, this.props.user_info, pin)
                        r(group)
                    }
                }))
            }
            history.push(type==0?`/contract-info/${contract.contract_id}`:`/edit-contract/${contract.contract_id}`)

        }

    }

    render_contract_slot(e,k){
        let status_text = (status)=>{
            if(status == 0) {
                return "내용 입력 중"
            } else if(status == 1) {
            	return "서명 전"
            } else if(status == 2) {
                return "계약 완료"
            } 
        }

        let usernames = e.user_infos.map(ee => ee.username).filter( ee => !!ee)
        usernames = usernames.join(", ")

        return <div key={e.contract_id} className="item" onClick={this.openContract.bind(this, e, 0)}>
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
                    <div className="action-button action-blue-but" onClick={this.openContract.bind(this, e, 1)}>서명</div>
                    <div className="arrow-button arrow-blue-but" onClick={this.onClickOption.bind(this, e.contract_id)} >
                        <i className="fas fa-caret-down"></i>
                        <div className="arrow-dropdown" style={{display:!!this.isOpenOption(e.contract_id) ? "initial" : "none"}}>
                            <div className="container">
                                <div className="detail" onClick={this.openContract.bind(this, e, 0)}>상세 정보</div>
                                <div className="move" onClick={this.openContract.bind(this, e, 1)}>이동</div>
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
				<div className="left-top-button" onClick={this.onClickAddContract}>계약 만들기</div>
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
						<div className={"item" + (this.getTitle().id == "beforeMySign" ? " selected" : "")} onClick={this.move.bind(this, "beforeMySign")}><i className="icon far fa-file-import"></i> <div className="text">서명 전</div></div>
						{/*<div className={"item" + (this.getTitle().id == "beforeOtherSign" ? " selected" : "")} onClick={this.move.bind(this, "beforeOtherSign")}><i className="icon far fa-file-export"></i> <div className="text">상대방 서명 전</div></div>*/}
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
                
                <Pager max={Math.ceil(total_cnt/LIST_DISPLAY_COUNT)} cur={this.state.cur_page+1||1} onClick={this.onClickPage} />
			</div>
		</div>)
	}
}







