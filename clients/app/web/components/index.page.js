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
		return (<div className="index-page">
			<div className="header-section">
				<div className="content">
					<div className="top">
						<div className="left-logo"></div>
						<div className="right-btns">
							<div className="language"> KOR </div>
							<div className="buttons">
								<div className="whatis">FirmaChain 이란</div>
								<div className="login-btn">로그인 / 회원가입</div>
							</div>
						</div>
					</div>
					<div className="desc">
						<div className="left">
							<div>
								<div>위 변조 없는 <b>전자문서</b></div>
								<div>이제는 <b>E-CONTRACT</b>로</div>
								<div><b>전자서명</b>하세요</div>
								<span>* PC, Android, iOS 언제 어디서나 사용 가능합니다.</span>
							</div>
						</div>
						<div className="right">
							<div className="screenshot-img"></div>
						</div>
					</div>
				</div>
			</div>

			<div className="desc-section">
				<div className="title"> 왜 <b>블록체인</b>을 써야할까? </div>
			</div>
			<div className="desc-section">
				<div className="title"> 왜 <b>블록체인</b>을 써야할까? </div>
			</div>
		</div>);
	}
}