import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import ContractMenu from "./contract-menu"
import UserStatusBar from "./user-state-bar"
import Pager from "./pager"
import CheckBox from "./checkbox"
import CheckBox2 from "./checkbox2"
import moment from "moment"
import {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        folders:state.contract.folders
	}
}

let mapDispatchToProps = {
    folder_list,
    new_folder,
    remove_folder,
    move_to_folder,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            filter:1,
            deleteMode:false
        };
	}

	componentDidMount(){
        (async()=>{
            await this.props.folder_list()
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

    onClickNewFolder = async()=>{
        window.openModal("AddFolder",{
            onClick:async(name)=>{
                await window.showIndicator()
                await this.props.new_folder(name)
                await this.props.folder_list()
                await window.hideIndicator()
            }
        })
    }

    onClickDelete = async ()=>{
        if( await window.confirm("폴더 삭제", "정말 삭제하시겠습니까?") ){
        }
    }

	render() {
        console.log(this.props.folders)
        if(!this.props.folders)
            return <div />
		return (<div className="default-page contract-list-page">
            <div className="container">
                <h1>내 계약</h1>
                <UserStatusBar />
                <div className="page">
                    <ContractMenu page="folder" />
                    <div className="column-600 page-contents">
                        <h1>내 계약</h1>
                        <table className="table" style={{marginTop:"20px"}}>
                            <tbody>
                                <tr>
                                    {this.state.deleteMode ? <th><CheckBox2 /></th> : null}
                                    <th></th>
                                    <th className="text-left">폴더</th>
                                    <th>계약건</th>
                                    <th>생성일자</th>
                                </tr>
                                {this.props.folders.list.map((e,k)=>{
                                    let subject = e.subject || "분류되지 않은 계약"
                                    let folder_id = e.folder_id || 0
                                    let addedAt = e.addedAt ? moment(e.addedAt).format("YYYY-MM-DD HH:mm:ss") : "-"
                                    return <tr key={k}>
                                        {this.state.deleteMode ? <td><CheckBox2 /></td> : null}
                                        <td style={{width:"20px"}}><i className={`fas ${folder_id == 0 ? "fa-thumbtack":"fa-folder"}`} /></td>
                                        <td className="text-left"><Link to={encodeURI(`/folder/${folder_id}`)}>{subject}</Link></td>
                                        <td className="date-cell">{e.contract_cnt}</td>
                                        <td className="date-cell">{addedAt}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>

                        {this.state.deleteMode ? <div className="right-align">
                            <button onClick={this.onClickNormalMode}>취소</button>
                            <button className="danger" onClick={this.onClickDelete}>폴더 삭제</button>
                        </div> : <div className="right-align">
                            <button onClick={this.onClickDeleteMode}>폴더 삭제</button>
                            <button onClick={this.onClickNewFolder} >폴더 추가</button>
                        </div>}

                        <Pager max={20} cur={this.state.cur_page||1} onClick={(i)=>this.setState({cur_page:i})} />

                    </div>
                </div>
            </div>
		</div>);
	}
}