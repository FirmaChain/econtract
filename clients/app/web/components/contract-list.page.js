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
                    <ContractMenu />
                    <div className="column-600 page-contents">
                        <h1>최근 사용한 계약</h1>
                        <table className="table" style={{marginTop:"20px"}}>
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