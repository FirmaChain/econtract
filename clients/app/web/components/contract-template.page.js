import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import UserStatusBar from "./user-state-bar"

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
		this.state={};
	}

	componentDidMount(){
	}

	render() {
		return (<div className="default-page contract-list-page">
            <div className="container">
                <h1>내 계약</h1>
                <UserStatusBar />
                <div className="page">
                    <ContractMenu page="template" />
                    <div className="column-600 page-contents">
                        <h1>내 탬플릿</h1>
                        <table className="table" style={{marginTop:"20px"}}>
                            <tbody>
                                <tr>
                                    <th className="text-left">템플릿 명</th>
                                    <th>생성일자</th>
                                    <th>수정시간</th>
                                </tr>
                                <tr>
                                    <td>표준근로계약서</td>
                                    <td className="date-cell">2017-00-00 00:00:00</td>
                                    <td className="date-cell">2017-00-00 00:00:00</td>
                                </tr>
                                <tr>
                                    <td>표준근로계약서</td>
                                    <td className="date-cell">2017-00-00 00:00:00</td>
                                    <td className="date-cell">2017-00-00 00:00:00</td>
                                </tr>
                                <tr>
                                    <td>표준근로계약서</td>
                                    <td className="date-cell">2017-00-00 00:00:00</td>
                                    <td className="date-cell">2017-00-00 00:00:00</td>
                                </tr>
                                <tr>
                                    <td>표준근로계약서</td>
                                    <td className="date-cell">2017-00-00 00:00:00</td>
                                    <td className="date-cell">2017-00-00 00:00:00</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="right-align">
                            <button>템플릿 삭제</button>
                            <button>템플릿 추가</button>
                        </div>
                    </div>
                </div>
            </div>
		</div>);
	}
}