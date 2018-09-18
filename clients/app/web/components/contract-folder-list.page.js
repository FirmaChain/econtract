import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import ContractMenu from "./contract-menu"
import UserStatusBar from "./user-state-bar"
import Pager from "./pager"
import CheckBox from "./checkbox"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
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

    onClickDelete = async ()=>{
        if( await window.confirm("폴더 삭제", "정말 삭제하시겠습니까?") ){
        }
    }

	render() {
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
                                    <th>계약 (미완료)</th>
                                    <th>생성일자</th>
                                </tr>
                                <tr>
                                    {this.state.deleteMode ? <td><CheckBox2 /></td> : null}
                                    <td style={{width:"20px"}}><i className="fas fa-thumbtack" /></td>
                                    <td className="text-left"><Link to={encodeURI("/folder/분류되지 않은 계약")}>분류되지 않은 계약</Link></td>
                                    <td className="date-cell">3건 (1건)</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    {this.state.deleteMode ? <td><CheckBox2 /></td> : null}
                                    <td style={{width:"20px"}}><i className="fas fa-folder"></i></td>
                                    <td className="text-left"><Link to={encodeURI("/folder/계약 폴더1")}>계약 폴더1</Link></td>
                                    <td className="date-cell">3건 (1건)</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    {this.state.deleteMode ? <td><CheckBox2 on={true} /></td> : null}
                                    <td style={{width:"20px"}}><i className="fas fa-folder"></i></td>
                                    <td className="text-left"><Link to={encodeURI("/folder/계약 폴더2")}>계약 폴더2</Link></td>
                                    <td className="date-cell">3건 (1건)</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    {this.state.deleteMode ? <td><CheckBox2 /></td> : null}
                                    <td style={{width:"20px"}}><i className="fas fa-folder"></i></td>
                                    <td className="text-left"><Link to={encodeURI("/folder/계약 폴더3")}>계약 폴더3</Link></td>
                                    <td className="date-cell">3건 (1건)</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                            </tbody>
                        </table>

                        {this.state.deleteMode ? <div className="right-align">
                            <button onClick={this.onClickNormalMode}>취소</button>
                            <button className="danger" onClick={this.onClickDelete}>폴더 삭제</button>
                        </div> : <div className="right-align">
                            <button onClick={this.onClickDeleteMode}>폴더 삭제</button>
                            <button onClick={()=>window.openModal("AddFolder")} >폴더 추가</button>
                        </div>}

                        <Pager max={20} cur={this.state.cur_page||1} onClick={(i)=>this.setState({cur_page:i})} />

                    </div>
                </div>
            </div>
		</div>);
	}
}