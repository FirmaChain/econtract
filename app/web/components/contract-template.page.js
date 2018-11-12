import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import UserStatusBar from "./user-state-bar"
import CheckBox2 from "./checkbox2"
import history from '../history';
import {
    list_template,
    add_template,
    get_template,
    update_template,
    fetch_user_info,
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
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            deleteMode:false,
            template:[]
        };
	}

	componentDidMount(){
        (async()=>{
            let list = await this.props.list_template()
            this.setState({
                template:list
            })
        })()
    }
    
    onClickDeleteMode = ()=>{
        this.setState({
            deleteMode:true
        })
    }

    onClickNormalMode = ()=>{
        this.setState({
            deleteMode:false
        })
    }

    onClickDelete = async()=>{
        await window.confirm("템플릿 삭제", "삭제하시겠습니까?");
    }

    onClickTemplate = async(e)=>{
        history.push(`/template-edit/${e.template_id}`)
    }

	render() {
		return (<div className="default-page contract-list-page">
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
                                    return <tr key={e.template_id} className="clickable" onClick={this.onClickTemplate.bind(this, e)}>
                                        {this.state.deleteMode ? <td><CheckBox2 /></td> : null}
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
		</div>);
	}
}