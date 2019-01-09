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
import CorpGroupInfoPage from "./corp-group-info.page"
import queryString from "query-string"
import md5 from 'md5'


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
    get_contracts,
    fetch_user_info,
    exist_group_member,
    add_member_group,
    add_member_group_exist,
    all_invite_list,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        folders:state.contract.folders,
        user_info: state.user.info,
        contracts:state.contract.contracts,
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
    get_contracts,
    fetch_user_info,
    exist_group_member,
    add_member_group,
    add_member_group_exist,
    all_invite_list,
}

const LIST_DISPLAY_COUNT = 6

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            contracts_checks : [],
            cur_page:0,
        };
	}

	componentDidMount() {
        (async()=>{
            await this.onRefresh()
        })()
	}

    onRefresh = async (nextProps) => {
        nextProps = !!nextProps ? nextProps : this.props

        await this.props.get_group_info(0)
        //let dodo = await this.props.get_corp_member_info(128, this.props.user_info.corp_key)
        await this.props.get_corp_member_info_all(this.props.user_info.corp_key, 1)
        let menu = nextProps.match.params.menu || "all"
        let account_id = nextProps.match.params.account_id || null
        let params = queryString.parse(nextProps.location.search)

        let _ = {
            _group_id:menu,
            _account_id:account_id,
        }

        if(account_id) {
            let member = await this.props.get_corp_member_info(account_id, this.props.user_info.corp_key)
            _.member = member
        }
        await this.props.openGroup(menu)

        await this.setState({
            ..._,
            contracts_checks : [],
            cur_page:Number(params.page) || 0,
            search_text: params.search_text || "",
        })

        await this.loadContracts(Number(params.page) || 0, params.search_text || null, nextProps)

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user_info === false) {
            return history.replace("/login")
        }

        let prevMenu = this.props.match.params.menu || "all"
        let menu = nextProps.match.params.menu || "all"

        let prev_account_id = this.props.match.params.account_id || null
        let account_id = nextProps.match.params.account_id || null

        let prev_page = queryString.parse(this.props.location.search).page || 0
        let page = queryString.parse(nextProps.location.search).page || 0 

        let prev_search_text = queryString.parse(this.props.location.search).search_text || ""
        let search_text = queryString.parse(nextProps.location.search).search_text || ""

        if(prevMenu != menu || prev_account_id != account_id 
            || prev_page != page || prev_search_text != search_text) {
            (async()=>{
                await this.onRefresh(nextProps)
            })();
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

    onClickAddGroupMember = async () => {
        let groups = await this.props.get_group_info(0)
        window.openModal("AddGroupMember", {
            list: groups.map(e=>{return {...e, value:e.group_id, label:e.title}}),
            onConfirm: async (email, group) => {

                if(email == ""){
                    alert("초대하려는 그룹원의 이메일을 입력해주세요.")
                    return false
                }

                group = groups.find(e=>e.group_id == group.value)

                email = email.trim()

                if(!window.email_regex.test(email)) {
                    alert("이메일이 형식에 맞지 않습니다.")
                    return false
                }

                let exist = await this.props.exist_group_member(group.group_id, email)

                let group_key = get256bitDerivedPublicKey(Buffer.from(this.props.user_info.corp_master_key, 'hex'), "m/0'/"+group.group_id+"'").toString('hex');

                let data = {
                    company_name: this.props.user_info.company_name,
                    duns_number: this.props.user_info.duns_number,
                    company_ceo: this.props.user_info.company_ceo,
                    company_address: this.props.user_info.company_address,
                    corp_key:this.props.user_info.corp_key,
                    corp_id:this.props.user_info.corp_id,
                    group_id:group.group_id,
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
                            if(v.group_id == group.group_id) {
                                alert("이미 해당 그룹에 초대중인 사용자입니다.")
                                return false 
                            }
                            else {
                                alert("이미 다른 그룹에서 초대중인 사용자입니다.")
                                return false
                            }
                        }
                    }

                    let resp = await this.props.add_member_group(group.group_id, email, this.props.user_info.corp_key, data, data_for_inviter);
                    if(resp) {
                        if(resp.code == 1) {
                            this.setState({
                                add_email:""
                            })
                            alert("성공적으로 그룹에 초대하였습니다.")
                            return true;
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
                        return false;
                    }
                } else if(exist.code == 1) {
                    let data = {
                        group_id:group.group_id,
                        group_key,
                    }
                    let resp = await this.props.add_member_group_exist(exist.payload.account_id, group.group_id, email, data)

                    if(resp.code == 1) {
                        this.setState({
                            add_email:""
                        })
                        await this.onRefresh()
                        alert("성공적으로 그룹에 초대하였습니다.")
                        return true
                    } else if(resp.code == -7) {
                        alert("해당 이메일로 가입한 계정이 없습니다.")
                    } else if(resp.code == -8) {
                        alert("이미 개인 계정으로 가입되어 있습니다.")
                    } else if(resp.code == -9) {
                        alert("이미 기업 계정으로 가입되어 있습니다.")
                    }
                    return false

                } else if(exist.code == -6) {
                    alert("이미 해당 그룹에 속해있는 사용자 입니다.")
                    return false
                }

                return false;
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
                return { id:"unclassified", account_id:account_id, title : "#분류되지 않은 그룹원 " + username}
            }
            else {
                return { id:"unclassified", title : "분류되지 않은 그룹원"}
            }
        }
		else if(menu == "withdraw") {
            if(!!account_id) {
                let username = ""
                if(!!this.state.member)
                    username = this.state.member.data.username
                return { id:"withdraw", account_id:account_id, title : "#탈퇴한 그룹원 " + username}
            }
            else {
                return { id:"withdraw", title : "탈퇴한 그룹원"}
            }
        }
		return { id:"all", title : "모든 계약"}
	} 

    move(pageName) {
        history.push(`/group/${pageName}`)
    }

    async moveGroup(group_id) {
        await this.props.openGroup(group_id)
        history.push(`/group/${group_id}`)
    }

    async moveGroupMember(group_id, account_id) {
        await this.props.openGroup(group_id)
        history.push(`/group/${group_id}/${account_id}`)
    }

    /*openGroupInfo(group_id, e) {
        e.stopPropagation()
        history.push(`/group-info/${group_id}`)
    }*/

    async openCloseGroup(group_id, e) {
        e.stopPropagation()
        let list = [...this.props.isOpenGroupList]

        for(let v of list) {
            if(v == group_id) {
                await this.props.closeGroup(group_id)
                return;
            }
        }
        await this.props.openGroup(group_id)
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


    loadContracts = async (page, search_text, props) => {
        props = !!props ? props : this.props

        let group_id = this.props.match.params.menu || "all"
        let account_id = this.props.match.params.account_id || null

        let groups = await this.props.get_group_info(0)

        await window.showIndicator()
        
        let result
        if(group_id == "all") {
            result = await this.props.get_contracts(5, -1, page, LIST_DISPLAY_COUNT, -1, -1, this.props.user_info, groups, search_text)
        } else if( group_id == "withdraw" && account_id != null ) {
            result = await this.props.get_contracts(5, -1, page, LIST_DISPLAY_COUNT, account_id, -1, this.props.user_info, groups, search_text)
        } else if( !isNaN(group_id) && account_id != null ) {
            result = await this.props.get_contracts(5, -1, page, LIST_DISPLAY_COUNT, account_id, group_id, this.props.user_info, groups, search_text)
        }

        await window.hideIndicator()

        return result
    }

    onClickPage = async (page) => {
        if(this.state.cur_page == page - 1)
            return;

        let params = queryString.parse(this.props.location.search)
        params.page = page - 1

        history.push({pathname:this.props.match.url, search:`?${queryString.stringify(params)}`})
    }

    onClickSearch = async () => {
        if(!!this.state.search_text && this.state.search_text != "" && this.state.search_text.length < 2) {
            return alert("검색어는 2글자 이상 입력해주세요.")
        }

        if(!!this.state.search_text && this.state.search_text == "") {
            return history.push(this.props.match.url)
        }

        let params = queryString.parse(this.props.location.search)
        delete params.page
        params.search_text = this.state.search_text

        history.push({pathname:this.props.match.url, search:`?${queryString.stringify(params)}`})
    }

    onKeyPress = async (type, e) => {
        if(e.keyCode == 13){
            switch(type) {
                case "search":
                    await this.onClickSearch()
                    break;
            }
        }
    }

    onClickOpenContract = async (contract, type = 0, e) => {
        await this.openContract(contract, type, 0, e)
    }

    openContract = async (contract, type, select_tab = 0, e) => {
        e.stopPropagation()
        select_tab = select_tab ? select_tab : 0
        let move_info = {
            pathname:type==0 ? `/contract-info/${contract.contract_id}` : `/edit-contract/${contract.contract_id}`,
            state:{ select_tab }
        }
        history.push(move_info)
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
                let sign_user = e.is_signature.split(",").map( (v, k) => {
                    return {
                        corp_id : e.corps_id.split(",")[k],
                        entity_id : e.entities_id.split(",")[k],
                        signature : v,
                    }
                }).find(v => {
                    return v.corp_id == 0 && v.entity_id == this.props.user_info.account_id
                })
                if(sign_user && sign_user.signature == "true") {
                    return "상대방 서명 전"
                }
                return "내 서명 전"
            } else if(status == 2) {
                return "계약 완료"
            } 
        }

        let usernames = ""
        if(typeof(e.user_infos) == "object") {
            usernames = e.user_infos.map(ee => ee.username).filter( ee => !!ee)
            usernames = usernames.join(", ")
        }

        return <div key={e.contract_id} className="item" onClick={this.onClickOpenContract.bind(this, e, 0)}>
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
                    <div className={"action-button " + (e.status == 2 ? "action-transparent-but" : "action-blue-but")} onClick={this.onClickOpenContract.bind(this, e, 1)}>
                        {e.status == 2 ? "이동" : "서명"}
                    </div>
                    <div className={"arrow-button " + (e.status == 2 ? "arrow-transparent-but" : "arrow-blue-but")} onClick={this.onClickOption.bind(this, e.contract_id)} >
                        <i className="fas fa-caret-down"></i>
                        <div className="arrow-dropdown" style={{display:!!this.isOpenOption(e.contract_id) ? "initial" : "none"}}>
                            <div className="container">
                                <div className="detail" onClick={this.openContract.bind(this, e, 0, 1)}>상세 정보</div>
                                {/*<div className="move" onClick={this.onMoveContract.bind(this, [e.contract_id])}>폴더 이동</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

	render() {
        let folders = this.props.folders ? this.props.folders : { list: [] }
        let groups = this.props.groups ? this.props.groups : []
        let members = this.props.members ? this.props.members : []
        let contracts = this.props.contracts ? this.props.contracts : { list:[] }

        let total_cnt = contracts.total_cnt
        let page_num = contracts.page_num

        let group_id = this.state._group_id || "all"
        let account_id = this.state._account_id || null

		return (<div className="group-page">
			<div className="contract-group-menu">
				<div className="left-top-button" onClick={this.onClickAddGroupMember}>그룹원 계정 추가하기</div>
				<div className="menu-list">
                    <div className="list">
                        <div className={"item" + (this.getTitle().id == "all" ? " selected" : "")} onClick={this.moveGroup.bind(this, "")}>
                            <i className="icon fal fa-clock"></i>
                            <div className="text">모든 계약</div>
                        </div>
                    </div>
					<div className="list">
						<div className="title">
                            <div className="text">그룹</div>
                            <i className="angle far fa-plus" onClick={this.onClickAddGroup}></i>
                        </div>
                        {groups.map((e,k)=>{
                            let memberList = []
                            for(let v of members) {
                                if(v.group_ids && v.group_ids.includes(e.group_id)) {
                                    memberList.push(<div key={e.group_id+" "+v.account_id} className={"item sub" + (this.isOpenGroup(e.group_id) ? "" : " hide") + ( (this.getTitle().id == e.group_id && this.getTitle().account_id != null && this.getTitle().account_id == account_id) ? " selected" : "")} onClick={this.moveGroupMember.bind(this, e.group_id, v.account_id)}>
                                        <i className="icon fas fa-user"></i>
                                        <div className="text">{v.data.username}</div>
                                        {/*<i className="setting far fa-ellipsis-h"></i>*/}
                                    </div>)
                                }
                            }
                            if(memberList.length == 0) {
                                memberList.push(<div key={"nothing"} className={"empty-person" + (this.isOpenGroup(e.group_id) ? "" : " hide")}>그룹원이 없습니다</div>)
                            }
                            return [<div key={e.group_id} className={"item" + ( ( this.getTitle().id == e.group_id && !this.getTitle().account_id ) ? " selected" : "")}
                                onClick={this.moveGroup.bind(this, e.group_id)}>
                                <div className="text">#{e.title}</div>
                                {/*<i className="setting fas fa-cog" onClick={this.openGroupInfo.bind(this, e.group_id)}></i>*/}
                                <i className={"angle far " + ( this.isOpenGroup(e.group_id) ? "fa-angle-down" : "fa-angle-up" )} onClick={this.openCloseGroup.bind(this, e.group_id)}></i>
                            </div>, ...memberList]
                        })}


						<div className={"item" + (this.getTitle().id == "unclassified" ? " selected" : "")} onClick={async () => {await this.props.openGroup("unclassified")}}>
                            <i className="icon fas fa-share-square"></i> 
                            <div className="text">분류되지 않은 그룹원</div>
                            <i className={"angle far "  + ( this.isOpenGroup("unclassified") ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, "unclassified")}></i>
                        </div>
                        {members.filter(e=>e.group_ids == null && e.is_enable == 1).map((e,k)=>{
                            return <div key={"unclassified "+e.account_id} className={"item sub" + (this.isOpenGroup("unclassified") ? "" : " hide")} onClick={this.moveGroupMember.bind(this, "unclassified", e.account_id)}>
                                <i className="icon fas fa-user"></i>
                                <div className="text">{e.data.username}</div>
                            </div>
                        })}
                        {members.filter(e=>e.group_ids == null && e.is_enable == 1).length == 0 ? <div className={"empty-person" + (this.isOpenGroup("unclassified") ? "" : " hide")}>그룹원이 없습니다</div> : null}



						<div className={"item" + (this.getTitle().id == "withdraw" ? " selected" : "")} onClick={async () => {await this.props.openGroup("withdraw")}}>
                            <i className="icon fas fa-handshake-alt"></i>
                            <div className="text">탈퇴한 그룹원</div>
                            <i className={"angle far "  + ( this.isOpenGroup("withdraw") ? "fa-angle-down" : "fa-angle-up")} onClick={this.openCloseGroup.bind(this, "withdraw")}></i>
                        </div>
                        {members.filter(e=>e.is_enable == 0).map((e,k)=>{
                            return <div key={"withdraw "+e.account_id} className={"item sub" + (this.isOpenGroup("withdraw") ? "" : " hide")} onClick={this.moveGroupMember.bind(this, "withdraw", e.account_id)}>
                                <i className="icon fas fa-user"></i>
                                <div className="text">{e.data.username}</div>
                            </div>
                        })}
                        {members.filter(e=>e.is_enable == 0).length == 0 ? <div className={"empty-person" + (this.isOpenGroup("withdraw") ? "" : " hide")}>그룹원이 없습니다</div> : null}
					</div>
				</div>
			</div>
            { ( !isNaN(group_id) && account_id == null ) ? 
            <CorpGroupInfoPage {...this.props} group_id={group_id} onRefresh={this.onRefresh}/> :
            <div className="contract-list">
                <div className="title">{this.getTitle().title}</div>
                <div className="search">
                    <input className="common-textbox" type="text"
                        placeholder="검색어를 2자 이상 입력해주세요."
                        onKeyDown={this.onKeyPress.bind(this, "search")}
                        value={this.state.search_text || ""}
                        onChange={e=>this.setState({search_text:e.target.value})}/>
                    <div className="blue-but" onClick={this.onClickSearch}>검색</div>
                </div>
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
                
                <Pager max={Math.ceil(total_cnt/LIST_DISPLAY_COUNT)} cur={this.state.cur_page + 1 ||1} onClick={this.onClickPage} />
            </div>}
            
		</div>)
	}
}







