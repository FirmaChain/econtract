import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import history from '../history'
import {
	fetch_user_info
} from "../../common/actions"

// async function a(){
// 	for(let i=0;i<10;i++){
// 		console.log("a")
// 		await new Promise(r=>setTimeout(r,100));		
// 		await b();
// 	}
// }
// async function b(){
// 	console.log("b")
// 	await new Promise(r=>setTimeout(r,10));		
// }

// import CancelablePromise from 'cancelable-promise';
// const myPromise = new CancelablePromise((resolve) => setTimeout(() => resolve('I\'m resolved'), 100));
// myPromise.then(async(response) => {
// 	while(1){
// 		console.log("1")
// 		await new Promise(r=>setTimeout(r,1000));
// 		await a();
// 	}
// })
// myPromise.cancel();

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
		this.props.fetch_user_info();
	}
	componentWillReceiveProps(props){
		if(props === false){

		}
	}

	render() {
		let user_info = this.props.user_info
		return (<div className="index-page">
			<div className="header-section">
				<div className="content">
					<div className="top">
						<div className="left-logo"></div>
						{user_info ? null : 
						<div className="right-btns">
							<div className="language"> KOR </div>
							<div className="buttons">
								<div className="whatis">FirmaChain 이란</div>
								<div className="login-btn" onClick={()=>history.push("/login")} >로그인 / 회원가입</div>
							</div>
						</div>
						}
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

			<div className="desc-section section-1">
				<div className="text">
					<div className="icon"></div>
					<div className="title">해킹 위험으로 인한 불안한 일상.</div>
					<div className="title">이젠 <b>블록체인</b>으로 벗어나세요</div>
					<div className="desc">
						이컨트랙트 서비스는 탈중앙화 전자계약 플랫폼으로 모든 계약 내용은 오직 계약 당사자들에게만 읽기 및 수정 권한이 부여되며,<br/> 그 외 모든 접근은 불허됩니다. 이는 개발사조차도 계약 내용 접근이 불가능하기 때문에 해킹 위험이 전혀 없습니다.
					</div>
				</div>
				<div className="img"> <div className="iii"></div> </div>
			</div>
			<div className="desc-section section-2">
				<div className="img"> <div className="iii"></div> </div>
				<div className="text">
					<div className="icon"></div>
					<div className="title">해킹 위험으로 인한 불안한 일상.</div>
					<div className="title">이젠 <b>블록체인</b>으로 벗어나세요</div>
					<div className="desc">
						이컨트랙트 서비스는 탈중앙화 전자계약 플랫폼으로 모든 계약 내용은 오직 계약 당사자들에게만 읽기 및 수정 권한이 부여되며,<br/> 그 외 모든 접근은 불허됩니다. 이는 개발사조차도 계약 내용 접근이 불가능하기 때문에 해킹 위험이 전혀 없습니다.
					</div>
				</div>
			</div>
			<div className="desc-section section-3">
				<div className="text">
					<div className="icon"></div>
					<div className="title">해킹 위험으로 인한 불안한 일상.</div>
					<div className="title">이젠 <b>블록체인</b>으로 벗어나세요</div>
					<div className="desc">
						이컨트랙트 서비스는 탈중앙화 전자계약 플랫폼으로 모든 계약 내용은 오직 계약 당사자들에게만 읽기 및 수정 권한이 부여되며,<br/> 그 외 모든 접근은 불허됩니다. 이는 개발사조차도 계약 내용 접근이 불가능하기 때문에 해킹 위험이 전혀 없습니다.
					</div>
				</div>
				<div className="img"> <div className="iii"></div> </div>
			</div>
			<div className="bottom">
			</div>
		</div>);
	}
}