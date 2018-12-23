import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import Information from "./information.comp"
import Pager from "./pager"
import CheckBox from "./checkbox"
import TransactionBackgroundWork from "./transaction_background_work"
import CheckBox2 from "./checkbox2"
import history from '../history'
import Route from "./custom_route"
import moment from "moment"

import ProfilePage from "./profile.page"
import PriceStatusPage from "./price-status.page"
import GroupManagePage from "./group-manage.page"
import Footer from "./footer.comp"
import Web3 from "../../common/Web3"

import translate from "../../common/translate"
import {
    fetch_user_info,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info
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
		return (<div className="right-desc price-status-page">
            <div className="title">요금 정보</div>
            <div className="container">
                <div className="cluster">
                    <div className="box blue-box">
                        <div className="icon"><i className="fas fa-credit-card"></i></div>
                        <div className="title">기업 회원 | 연간 결제 30</div>
                        <div className="desc">00 / 00 건</div>
                        <div className="sub">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
                    <div className="box gray-box">
                        <div className="icon"><i className="fal fa-users"></i></div>
                        <div className="title">10명</div>
                        <div className="desc">00 / 00 건</div>
                        <div className="sub">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
                    <div className="big-box">
                        <div className="bar middlegray-bar">
                            <div className="left">
                                <div className="title">건별 이용권</div>
                                <div className="desc">0건 남음</div>
                                <div className="sub">*정기결제과 건별 이용권 모두 보유시 정기결제 이용권 먼저 차감됩니다.</div>
                            </div>
                            <div className="right">
                                <div className="button">구매</div>
                            </div>
                        </div>
                        <div className="bar gray-bar">
                            <div className="left">
                                <div className="title">결제 정보</div>
                                <div className="desc">기업 | 4854-****-****-****</div>
                            </div>
                            <div className="right">
                                <div className="button">변경</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="list">
                    <div className="title">결제 내역</div>
                    <div className="head">
                        <div className="list-head-item list-content">내용</div>
                        <div className="list-head-item list-purchase-type">결제 수단</div>
                        <div className="list-head-item list-price">금액</div>
                        <div className="list-head-item list-date">일자</div>
                    </div>
                    <div className="item">
                        <div className="list-body-item list-content">정기 결제</div>
                        <div className="list-body-item list-purchase-type">신용카드</div>
                        <div className="list-body-item list-price">36,500원</div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
                    <div className="item">
                        <div className="list-body-item list-content">정기 결제</div>
                        <div className="list-body-item list-purchase-type">신용카드</div>
                        <div className="list-body-item list-price">36,500원</div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
                </div>
                <div className="list">
                    <div className="title">이용권 차감 내역</div>
                    <div className="head">
                        <div className="list-head-item list-content">계약명</div>
                        <div className="list-head-item list-signer">서명자</div>
                        <div className="list-head-item list-date">차감 일자</div>
                    </div>
                    <div className="item">
                        <div className="list-body-item list-content">근로 계약서</div>
                        <div className="list-body-item list-signer">윤대현, 박불이세 외 2명</div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
                    <div className="item">
                        <div className="list-body-item list-content">외주 계약서</div>
                        <div className="list-body-item list-signer">윤대현, 박불이세 외 2명</div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
                </div>
            </div>
        </div>)
	}
}

