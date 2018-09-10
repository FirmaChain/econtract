import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

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
                <div className="page">
                    <div className="column-200 display-flex">
                        <ul className="left-menu">
                            <li className="item">
                                <i className="fas fa-plus-circle" /> 최근 사용
                            </li>
                            <li className="item">
                                <i className="fas fa-folder" /> 폴더순으로
                            </li>
                            <li className="spacer" />
                            <li className="item selected">
                                <i className="fas fa-file-alt" /> 내 템플릿
                            </li>
                        </ul>
                    </div>
                    <div className="column-600 page-contents">
                        <h1>내 탬플릿</h1>
                        <table className="table" style={{marginTop:"20px"}}>
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