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
			<div className="index-container">
				<div className="grid"></div>
				<img src="/static/top_back.png" className="top-back" />

				<div className="header-section">
					<div className="top">
						<div className="econtract-logo" onClick={()=>window.location.reload(true)}>
							<img className="logo-img" src="/static/econtract_logo.png"/>
							<div className="contract">CONTRACT</div>
						</div>
						<div className="nav-menu">
							<div className="language"> KOR </div>
							<div className="whatis" onClick={()=>window.open("https://firmachain.org", "_blank")}>FirmaChain 이란</div>
							{user_info ? null : 
								<div className="login-place"><div className="login-btn" onClick={()=>history.push("/login")} >로그인 / 회원가입</div></div>}
						</div>
					</div>
					<div className="mid">
						<div className="mid-container">
							<div className="title">위 ・ 변조 없는 전자문서</div>
							<div className="sub-title"><b>E-Contract 를 만나보실 시간입니다.</b></div>
							<div className="start-btn" onClick={()=>history.push("/login")}>지금 시작하기</div>
						</div>
					</div>
					<div className="desc-container">
						<img className="right-img" src="/static/iphone.png" />
						<div className="place">
							<div className="title">
								해킹 위험으로 인한 불안한 일상<br/>
								<b>이젠 블록체인으로 벗어나세요.</b>
							</div>
							<div className="desc">
								E-Contract 서비스는 탈중앙화 전자계약 플랫폼으로<br/>
								모든 계약 내용은 오직 계약 당사자들에게만 읽기 및 수정 권한이 부여되며,<br/>
								그 외 모든 접근은 불허됩니다.<br/>
								이는 개발사조차도 계약 내용 접근이 불가능하기 때문에 해킹 위험이 전혀 없습니다.
							</div>
						</div>
					</div>
				</div>
				<div className="mid-section">
					<div className="desc-container" style={{textAlign:"right"}}>
						<img className="left-img" src="/static/macbook.png" />
						<div className="place place-right">
							<div className="title">
								불편한 서면계약 대신<br/>
								<b>편리한 전자계약을 사용해 보세요.</b>
							</div>
							<div className="desc">
								전자계약 법안이 발효되면서 서면계약과 동일한 법적 효력이<br/>
								발생하게 되었습니다. E-Contract 는 서면 계약이 가지는 단점들은<br/>
								보완하고 장점들은 극대화하여 상호간에 이뤄지는 계약 과정 내에서의<br/>
								발생하는 불편한 점들을 <b>*기능</b>을 통해 해결하였습니다.
							</div>
						</div>
					</div>
				</div>
				<div className="bottom-section">
					<div className="title-place">
						<img src="/static/econtract_logo.png" />
						<div>
							E-Contract 의<br/>
							<b>특별한 *기능들을 소개합니다.</b>
						</div>
					</div>
					<div className="data-place">
						<img className="back-img" src="/static/pad.png" />
						<div className="container">
							<div className="card">
								<div className="title">해킹 원천 차단</div>
								<div className="desc">
									접속하는 브라우저에 계약 정보를 저장함으로써<br/>
									계약에 대한 외부 해킹을 차단함은 물론,<br/>
									오로지 계약 당사자들만이 접근 가능합니다.
								</div>
								<img className="desc-img" src="/static/masterkeyword.jpg"/>
							</div>
							<div className="card option-card">
								<div className="title">모두가 만족하는 계약</div>
								<div className="desc">
									계약 당사자들에게 제공되는 실시간 메시지 기능과<br/>
									컨펌하기 기능은 계약 진행에 있어서<br/>
									모두가 만족하는 계약이 될 수 있게끔 합니다.
								</div>
								<img className="desc-img" src="/static/chatting.jpg"/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-section">
				<div className="footer-container">
					<img className="firma-logo" src="/static/firmachain_logo.png"/>
					<div className="footer">
						(주) 피르마 솔루션즈 ㅣ 대표 권승훈<br/>
						서울시 성동구 성동이로 58, P-Tower 5층ㅣ 사업자등록번호 261-88-01086<br/>
						developer@firma-solutions.com<br/>
						COPYRIGHT @FIRMA SOLUTIONS, ALL RIGHT RESERVED.
					</div>
				</div>
			</div>
		</div>);
	}
}