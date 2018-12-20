import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import UserStatusBar from "./user-state-bar"
import CheckBox2 from "./checkbox2"
import translate from "../../common/translate"
import Pager from "./pager"
import history from '../history';
import {
    remove_template,
    list_template,
    folder_list_template,
    add_folder_template,
    remove_folder_template,
    change_folder_template,
    fetch_user_info,
} from "../../common/actions"
import moment from "moment"

let mapStateToProps = (state)=>{
	return {
        folders:state.template.folders,
        templates:state.template.templates,
        user_info:state.user.info,
	}
}

let mapDispatchToProps = {
    remove_template,
    list_template,
    folder_list_template,
    add_folder_template,
    remove_folder_template,
    change_folder_template,
    fetch_user_info,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            cur_page:1,
            showOptions: null,
            templates_checks:[]
        }
	}

	componentDidMount(){
        (async()=>{
            await window.showIndicator()
            await this.props.folder_list_template()
            this.onRefresh()
            await window.hideIndicator()
        })()
    }

    onRefresh = async (nextProps) => {
        await this.props.list_template(this.getTitle(nextProps).id, this.state.cur_page - 1)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.user_info === false) {
            history.replace("/login")
        }

        let prevMenu = nextProps.match.params.menu || "all"
        let menu = this.props.match.params.menu || "all"
        if(prevMenu != menu){
            this.onRefresh(nextProps)
        }
    }

    onClickDelete = async()=>{
        let selected = Object.keys(this.state.templates_checks).filter(e=>this.state.templates_checks[e].template_id)
        if(selected.length == 0)
            return alert("삭제 할 템플릿을 선택해주세요!")

        if(await window.confirm("템플릿 삭제", `${selected.length}개의 템플릿을 삭제하시겠습니까?`)){
            await window.showIndicator()
            await this.props.remove_template(selected)
            await this.props.list_template(this.getTitle().id, this.state.cur_page - 1)
            await window.hideIndicator()
            
            alert("성공적으로 삭제했습니다.")
        }
    }

    onClickPage = async(page)=>{
        if(this.state.cur_page == page)
            return;

        await this.props.list_template(this.getTitle().id, page - 1);
        this.setState({
            cur_page:page,
            templates_checks:[]
        })
    }
    onClickAddTemplate = () => {
        history.push("/new-template")
    }

    onClickTemplate = (e)=>{
        history.push(`/template-edit/${e.template_id}`)
    }

    onAddFolder = () => {
        window.openModal("AddCommonModal", {
            icon:"fas fa-folder",
            title:"템플릿 폴더 추가",
            subTitle:"새 폴더명",
            placeholder:"폴더명을 입력해주세요.",
            onConfirm: async (folder_name) => {
                if(!folder_name || folder_name == "") {
                    return alert("폴더명을 입력해주세요")
                }
                let resp = await this.props.add_folder_template(folder_name)

                if(resp) {
                    await this.props.folder_list_template()
                }
            }
        })
    }

    move = (pageName) => {
        history.push(`/template/${pageName}`)
    }

    isOpenOption(template_id) {
        return this.state.showOption == template_id;
    }

    onClickOption(template_id, e) {
        e.stopPropagation()

        if(this.state.showOption == template_id) {
            return this.setState({
                showOption:null
            })
        }

        this.setState({
            showOption:template_id
        })
    }

    async onRemoveTemplate(template_id, subject, e) {
        e.stopPropagation()

        if(await window.confirm("템플릿 삭제", `'${subject}' 템플릿을 삭제하시겠습니까?`)) {
            await window.showIndicator()
            await this.props.remove_template([template_id])
            await this.props.list_template(this.getTitle().id, this.state.cur_page - 1)
            await window.hideIndicator()
            alert(`성공적으로 ${subject} 템플릿을 삭제하였습니다.`)
        }
    }

    getTitle(props) {
        props = !!props ? props : this.props

        let menu = props.match.params.menu || "all"
        let folders = props.folders ? props.folders : []

        for(let v of folders) {
            if(menu == v.folder_id+"") {
                return { id:v.folder_id, title:v.subject}
            }
        }
        if(menu == "unclassified") {
            return { id:"unclassified", title : "분류되지 않은 템플릿"}
        }
        return { id:"all", title : "모든 템플릿"}
    } 

    onRemoveFolder = async (folder_id, folder_name) => {
        if( await window.confirm("템플릿 폴더 삭제", `${folder_name} 를 정말 삭제하시겠습니까?`) ){
            await this.props.remove_folder_template([folder_id])
            history.push("/template")
        }
    }

    checkTemplate(template_id) {
        let l = [...this.state.templates_checks], isCheckAll = false

        let push_flag = true
        for(let i in l) {
            if(l[i] == template_id) {
                l.splice(i, 1)
                push_flag = false
                break;
            }
        }

        if(push_flag)
            l.push(template_id)

        this.setState({
            templates_checks:l
        })
    }

    checkAll = () => {
        let templates = this.props.templates ? this.props.templates : { list:[] }
        let check_list = templates.list.map( (e) => e.template_id )

        if(this.isCheckAll())
            check_list = []

        this.setState({
            templates_checks:check_list
        })
    }

    isCheckAll = () => {
        let templates = this.props.templates ? this.props.templates : { list:[] }
        return this.state.templates_checks.length == templates.list.length 
    }

    render_template_slot(e, k) {
        return <div className="item" key={e.template_id} onClick={()=>history.push(`/edit-template/${e.template_id}`)}>
            <div className="list-body-item list-chkbox">
                <CheckBox2 size={18}
                    on={this.state.templates_checks.includes(e.template_id) || false}
                    onClick={this.checkTemplate.bind(this, e.template_id)}/>
            </div>
            <div className="list-body-item list-name">
                {e.subject}
            </div>
            <div className="list-body-item list-date">{moment(e.addedAt).format("YYYY-MM-DD HH:mm:ss")}</div>
            <div className="list-body-item list-action">
                <div className="button-container">
                    <div className="action-button action-blue-but">사용</div>
                    <div className="arrow-button arrow-blue-but" onClick={this.onClickOption.bind(this, e.template_id)} >
                        <i className="fas fa-caret-down"></i>
                    <div className="arrow-dropdown" style={{display:!!this.isOpenOption(e.template_id) ? "initial" : "none"}}>
                            <div className="container">
                                <div className="move" onClick={this.onRemoveTemplate.bind(this, e.template_id, e.subject)}>삭제</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

	render() {
        let folders = this.props.folders ? this.props.folders : []

        let templates = this.props.templates ? this.props.templates : { list:[] }
        let total_cnt = templates.total_cnt
        let page_num = templates.page_num

		return (<div className="template-page">
            <div className="contract-group-menu">
                <div className="left-top-button" onClick={this.onClickAddTemplate}>생성하기</div>
                <div className="menu-list">
                    <div className="list">
                        <div className="title">
                            <div className="text">템플릿</div>
                            <i className="angle far fa-plus" onClick={this.onAddFolder}></i>
                        </div>
                        <div className={"item" + (this.getTitle().id == "all" ? " selected" : "")} onClick={this.move.bind(this, "")}>
                            <i className="icon fal fa-clock"></i>
                            <div className="text">모든 템플릿</div>
                        </div>
                        <div className={"item" + (this.getTitle().id == "unclassified" ? " selected" : "")} onClick={this.move.bind(this, "unclassified")}>
                            <i className="icon fas fa-thumbtack"></i>
                            <div className="text">분류되지 않은 템플릿</div>
                        </div>
                        {folders.map((e,k)=>{
                            let subject = e.subject
                            let folder_id = e.folder_id
                            return <div  key={folder_id} className={"item" + (this.getTitle().id == folder_id ? " selected" : "")} onClick={this.move.bind(this, folder_id)}>
                                <i className="fas icon fa-folder"></i>
                                <div className="text">{subject}</div>
                                <i className="angle fal fa-trash" onClick={this.onRemoveFolder.bind(this, folder_id, subject)}></i>
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
                        <div className="list-head-item list-name">템플릿명</div>
                        <div className="list-head-item list-date">생성 일자</div>
                        <div className="list-head-item list-action"></div>
                    </div>
                    {templates.list.map((e,k)=>{
                        return this.render_template_slot(e,k)
                    })}
                    {templates.list.length == 0 ? <div className="empty-contract">템플릿이 없습니다.</div> : null}
                </div>
                
                <Pager max={Math.ceil(total_cnt/page_num)} cur={this.state.cur_page||1} onClick={this.onClickPage} />
            </div>
        </div>);
	}
}
