import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import UserStatusBar from "./user-state-bar"
import Pager from "./pager"
import CheckBox from "./checkbox"
import TransactionBackgroundWork from "./transaction_background_work"
import CheckBox2 from "./checkbox2"
import {
    recently_contracts
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        recently:state.contract.recently
	}
}

let mapDispatchToProps = {
    recently_contracts
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            filter:1,
            moveMode:false
        };
	}

	componentDidMount(){
        (async()=>{
            let params = this.props.match.params;
            if(params.id){
                this.setState({
                    title: params.id,
                })
                await this.props.load__;
            }else{
                await this.props.recently_contracts();
                this.updateData(this.props)
            }
        })()
    }

    componentWillReceiveProps(props){
        this.updateData(props)    
    }

    updateData(props){
        this.setState({
            list: !this.state.title ? this.props.recently : this.props.list
        })
    }
    
    onClickMove = async ()=>{
        await window.openModal("MoveToFolder")
    }

    onClickMoveMode=()=>{
        this.setState({
            moveMode:true
        })
    }
    onClickNormalMode=()=>{
        this.setState({
            moveMode:false
        })
    }

	render() {
        console.log(this.state.list)
		return (<div className="default-page contract-list-page">
            <div className="container">
                <h1>내 계약</h1>
                <UserStatusBar />
                <div className="page">
                    <ContractMenu page={this.state.title ? "folder" : "recent"} />
                    <div className="column-600 page-contents">
                        <h1>{this.state.title || "최근 사용한 계약"}</h1>
                        <div className="filter-checkbox">
                            <CheckBox text="요청받은 계약" on={this.state.filter==1} onClick={(b)=>b ? this.setState({filter:1}): null} />
                            <CheckBox text="요청한 계약" on={this.state.filter==2} onClick={(b)=>b ? this.setState({filter:2}): null} />
                            <CheckBox text="완료된 계약" on={this.state.filter==3} onClick={(b)=>b ? this.setState({filter:3}): null} />
                            <CheckBox text="거절된 계약" on={this.state.filter==4} onClick={(b)=>b ? this.setState({filter:4}): null} />
                        </div>
                        <table className="table" style={{marginTop:"20px"}}>
                            <tbody>
                                <tr>
                                    {this.state.moveMode ? <th><CheckBox2 /></th> : null}
                                    <th>상태</th>
                                    <th>잠금</th>
                                    <th className="text-left">계약명</th>
                                    <th>서명자</th>
                                    <th>일자</th>
                                </tr>
                                <tr>
                                    {this.state.moveMode ? <td><CheckBox2 /></td> : null}
                                    <td style={{width:"40px"}} className="text-center">서명 전</td>
                                    <td style={{width:"20px"}} className="text-center"><i className="fas fa-lock"></i></td>
                                    <td className="text-left">공간 활용 계약</td>
                                    <td style={{width:"60px"}} className="text-center">홍길동 외 2명</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    {this.state.moveMode ? <td><CheckBox2 /></td> : null}
                                    <td style={{width:"40px"}} className="text-center">서명 전</td>
                                    <td style={{width:"20px"}} className="text-center"><i className="fas fa-lock"></i></td>
                                    <td className="text-left">공간 활용 계약</td>
                                    <td style={{width:"60px"}} className="text-center">홍길동 외 2명</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    {this.state.moveMode ? <td><CheckBox2 /></td> : null}
                                    <td style={{width:"40px"}} className="text-center">서명 전</td>
                                    <td style={{width:"20px"}} className="text-center"><i className="fas fa-lock"></i></td>
                                    <td className="text-left">공간 활용 계약</td>
                                    <td style={{width:"60px"}} className="text-center">홍길동 외 2명</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    {this.state.moveMode ? <td><CheckBox2 /></td> : null}
                                    <td style={{width:"40px"}} className="text-center">서명 전</td>
                                    <td style={{width:"20px"}} className="text-center"><i className="fas fa-lock"></i></td>
                                    <td className="text-left">공간 활용 계약</td>
                                    <td style={{width:"60px"}} className="text-center">홍길동 외 2명</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                            </tbody>
                        </table>

                        {this.state.title ?(this.state.moveMode ? <div className="right-align">
                            <button onClick={this.onClickNormalMode}>취소</button>
                            <button className="danger" onClick={this.onClickMove}>선택 이동</button>
                        </div> : <div className="right-align">
                            <button onClick={this.onClickMoveMode}>선택 이동</button>
                        </div>): null}

                        <Pager max={20} cur={this.state.cur_page||1} onClick={(i)=>this.setState({cur_page:i})} />

                    </div>
                </div>
                <TransactionBackgroundWork />
            </div>
		</div>);
	}
}