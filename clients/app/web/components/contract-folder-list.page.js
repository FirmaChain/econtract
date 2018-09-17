import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import UserStatusBar from "./user-state-bar"
import Pager from "./pager"
import CheckBox from "./checkbox"

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
            filter:1
        };
	}

	componentDidMount(){
	}

	render() {
		return (<div className="default-page contract-list-page">
            <div className="container">
                <h1>내 계약</h1>
                <UserStatusBar />
                <div className="page">
                    <ContractMenu page="recent" />
                    <div className="column-600 page-contents">
                        <h1>최근 사용한 계약</h1>
                        <div className="filter-checkbox">
                            <CheckBox text="요청받은 계약" on={this.state.filter==1} onClick={(b)=>b ? this.setState({filter:1}): null} />
                            <CheckBox text="요청한 계약" on={this.state.filter==2} onClick={(b)=>b ? this.setState({filter:2}): null} />
                            <CheckBox text="완료된 계약" on={this.state.filter==3} onClick={(b)=>b ? this.setState({filter:3}): null} />
                            <CheckBox text="거절된 계약" on={this.state.filter==4} onClick={(b)=>b ? this.setState({filter:4}): null} />
                        </div>
                        <table className="table" style={{marginTop:"20px"}}>
                            <tbody>
                                <tr>
                                    <th>상태</th>
                                    <th>잠금</th>
                                    <th>계약명</th>
                                    <th>서명자</th>
                                    <th>일자</th>
                                </tr>
                                <tr>
                                    <td className="text-center">서명 전</td>
                                    <td className="text-center"><i class="fas fa-lock"></i></td>
                                    <td className="text-center">공간 활용 계약</td>
                                    <td className="text-center">홍길동 외 2명</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    <td className="text-center">서명 전</td>
                                    <td className="text-center"><i class="fas fa-lock"></i></td>
                                    <td className="text-center">공간 활용 계약</td>
                                    <td className="text-center">홍길동 외 2명</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    <td className="text-center">서명 전</td>
                                    <td className="text-center"><i class="fas fa-lock"></i></td>
                                    <td className="text-center">공간 활용 계약</td>
                                    <td className="text-center">홍길동 외 2명</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                                <tr>
                                    <td className="text-center">서명 전</td>
                                    <td className="text-center"><i class="fas fa-lock"></i></td>
                                    <td className="text-center">공간 활용 계약</td>
                                    <td className="text-center">홍길동 외 2명</td>
                                    <td className="date-cell">2018.09.02 02:16:00</td>
                                </tr>
                            </tbody>
                        </table>

                        <Pager max={20} cur={this.state.cur_page||1} onClick={(i)=>this.setState({cur_page:i})} />

                    </div>
                </div>
            </div>
		</div>);
	}
}