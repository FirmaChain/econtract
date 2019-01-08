import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
    get_subscribe_plan,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    get_subscribe_plan,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
    }

    onClickChangeRegularPayment = async () => {
        let subscribe_plans = (await this.props.get_subscribe_plan()).map((e)=>{e.data = JSON.parse(e.data); return e});
        let plan_monthly = subscribe_plans.filter(e=>e.type==2);
        let plan_yearly = subscribe_plans.filter(e=>e.type==3);
        let plan_monthly_options = plan_monthly.map((e)=>{return {value: e.plan_id, label: e.data.title}});
        let plan_yearly_options = plan_yearly.map((e)=>{return {value: e.plan_id, label: e.data.title}});
        window.openModal("PurchaseRegularPayment", {
            planMonthly: plan_monthly,
            planYearly: plan_yearly,
            planMonthlyOptions: plan_monthly_options,
            planYearlyOptions: plan_yearly_options,
            selectedMonthlyIndex: plan_monthly[0].plan_id,
            selectedYearlyIndex: plan_yearly[0].plan_id,
            onResponse: async (purchase_type, give_count) => {
            }
        });
    }

    onBuyTicket = async () => {
        window.openModal("PurchaseTicket", {
            onResponse: async (give_count) => {
            }
        })
    }

    onChangeCardInfo = async () => {
        window.openModal("CardInfo", {
            onResponse: async (card_info) => {
            }
        })
    }

    onChangeAccountNumber = async () => {
        window.openModal("PurchaseGroupMemberAdd", {
            onResponse: async (card_info) => {
            }
        })
    }

	render() {
        let subscription_plans = (await this.props.get_subscribe_plan()).map((e)=>{e.data = JSON.parse(e.data); return e});
        let current_subscription = await this.props.get_current_subscription();
        let current_onetime_ticket = await this.props.get_current_onetime_ticket();
        let accountTypeText;
        let subscriptionText;
        switch (this.props.user_info.account_type) {
            case 0:
                accountTypeText = "개인 회원";
                break;
            case 1:
                accountTypeText = "기업 회원";
                break;
            case 2:
                accountTypeText = "기업 회원";
                break;
        }
        if (current_subscription.length > 0) {
            let current_subscription_info = subscription_plans.filter(e=>e.plan_id == current_subscription.plan_id)[0];
            if (current_subscription_info) {
                subscriptionText = current_subscription_info.type == 1 ? "월간 결제" : "연간 결제";
                subscriptionText += " ";
                subscriptionText += current_subscription_info.data.title;
            }
        }
		return (<div className="right-desc price-status-page">
            <div className="title">요금 정보</div>
            <div className="container">
                <div className="cluster">
                    <div className="box blue-box">
                        <div className="icon"><i className="fas fa-credit-card"></i></div>
                        <div className="title">{accountTypeText} | {subscriptionText}</div>
                        <div className="desc">00 / 00 건</div>
                        <div className="sub">결제일 : {moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                        <div className="button-container">
                            <div className="button" onClick={this.onClickChangeRegularPayment}>변경</div>
                            <div className="button">해지</div>
                        </div>
                    </div>
                    <div className="box gray-box">
                        <div className="icon"><i className="fal fa-users"></i></div>
                        <div className="title">10명</div>
                        <div className="desc">00 / 00 건</div>
                        <div className="sub">결제일 : {moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                        <div className="button-container">
                            <div className="button" onClick={this.onChangeAccountNumber}>변경</div>
                        </div>
                    </div>
                    <div className="big-box">
                        <div className="bar middlegray-bar">
                            <div className="left">
                                <div className="title">건별 이용권</div>
                                <div className="desc">0건 남음</div>
                                <div className="sub">*정기결제과 건별 이용권 모두 보유시 정기결제 이용권 먼저 차감됩니다.</div>
                            </div>
                            <div className="right">
                                <div className="button" onClick={this.onBuyTicket}>구매</div>
                            </div>
                        </div>
                        <div className="bar gray-bar">
                            <div className="left">
                                <div className="title">결제 정보</div>
                                <div className="desc">기업 | 4854-****-****-****</div>
                            </div>
                            <div className="right">
                                <div className="button" onClick={this.onChangeCardInfo}>변경</div>
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

