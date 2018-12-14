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
    list_template,
    add_template,
    get_template,
    update_template,
    fetch_user_info,
    remove_template,
} from "../../common/actions"
import moment from "moment"

let mapStateToProps = (state)=>{
	return {

	}
}

let mapDispatchToProps = {
    list_template,
    add_template,
    get_template,
    update_template,
    fetch_user_info,
    remove_template,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            template:[],
            folders:[]
        };
	}

	componentDidMount(){
        (async()=>{
            let list = (await this.props.list_template()) || []
            this.setState({
                template:list
            })
        })()
    }

    onClickDelete = async()=>{
        let del_sel = this.state.del_sel
        let selected = Object.keys(del_sel).filter(e=>del_sel[e])
        if(selected.length == 0)
            return alert("삭제 할 템플릿을 선택해주세요!")

        if(await window.confirm("템플릿 삭제", `${selected.length}개의 템플릿을 삭제하시겠습니까?`)){
            await this.props.remove_template(selected)

            let list = await this.props.list_template()
            this.setState({
                template:list,
            })
            
            alert("성공적으로 삭제했습니다.")
        }
    }

    onClickTemplate = async(e)=>{
        history.push(`/template-edit/${e.template_id}`)
    }

    move(pageName) {
        history.push(`/template/${pageName}`)
    }

    getTitle() {
        let menu = this.props.match.params.menu || "all"

        for(let i = 0 ; i < 10 ; i++) {
            if(menu == i+"") {
                return { id:i.toString(), title:"폴더 " + i}
            }
        }
        return { id:"all", title : "모든 템플릿"}
    } 

    render_template_slot(e, k) {

    }

	render() {
        let folders = this.props.folders ? this.props.folders : { list: [] }

        let template = this.props.template ? this.props.template : { list:[] }
        let total_cnt = template.total_cnt
        let page_num = template.page_num

		return (<div className="template-page">
            <div className="contract-group-menu">
                <div className="left-top-button" onClick={this.onClickAddContract}>생성하기</div>
                <div className="menu-list">
                    <div className="list">
                        <div className="title">템플릿</div>
                        <div className={"item" + (this.getTitle().id == "all" ? " selected" : "")} onClick={this.move.bind(this, "")}>
                            <i className="icon fal fa-clock"></i>
                            <div className="text">모든 템플릿</div>
                        </div>
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
                        <div className="list-head-item list-name">템플릿명</div>
                        <div className="list-head-item list-date">생성 일자</div>
                        <div className="list-head-item list-action"></div>
                    </div>
                    {template.list.map((e,k)=>{
                        return this.render_template_slot(e,k)
                    })}
                    {/*template.list.length == 0 ? <div className="empty-contract" >최근 계약서가 없습니다.</div> : null*/}
                </div>
                
                <Pager max={Math.ceil(total_cnt/page_num)} cur={this.state.cur_page||1} onClick={this.onClickPage} />
            </div>
        </div>);
	}
}

/*
<div className="default-page contract-list-page">
            <div className="logo">
                <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
            </div>
            <div className="container">
                <h1>내 계약</h1>
                <UserStatusBar />
                <div className="page">
                    <ContractMenu page="template" />
                    <div className="column-800 page-contents">
                        <h1>내 탬플릿</h1>
                        <table className="table" style={{marginTop:"20px"}}>
                            <tbody>
                                <tr>
                                    {this.state.deleteMode ? <th><CheckBox2 /></th> : null}
                                    <th className="text-left">템플릿 명</th>
                                    <th>생성일자</th>
                                    <th>수정시간</th>
                                </tr>
                                {this.state.template.map(e=>{
                                    return <tr key={e.template_id} className={`clickable`} onClick={this.state.deleteMode ? this.onClickDelCell.bind(this, e) : this.onClickTemplate.bind(this, e)}>
                                        {this.state.deleteMode ? <td><CheckBox2 on={this.state.del_sel[e.template_id]} /></td> : null}
                                        <td>{e.subject}</td>
                                        <td className="date-cell">{moment(e.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                                        <td className="date-cell">{moment(e.addedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>

                        {this.state.deleteMode ? <div className="right-align">
                            <button onClick={this.onClickNormalMode}>취소</button>
                            <button className="danger" onClick={this.onClickDelete}>선택 삭제</button>
                        </div> : <div className="right-align">
                            <button onClick={this.onClickDeleteMode}>템플릿 삭제</button>
                            <button onClick={()=>history.push("add-template")} >템플릿 추가</button>
                        </div>}

                    </div>
                </div>
            </div>
        </div>
*/
