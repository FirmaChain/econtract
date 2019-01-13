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
import creditcardutils from 'creditcardutils';

import ProfilePage from "./profile.page"
import PriceStatusPage from "./price-status.page"
import GroupManagePage from "./group-manage.page"
import Footer from "./footer.comp"
import Web3 from "../../common/Web3"

import translate from "../../common/translate"
import {
    fetch_user_info,
    get_corp_member_count,
    get_subscribe_plan,
    get_current_subscription,
    get_current_subscription_payment,
    get_current_onetime_ticket,
    input_payment_info,
    get_payment_info,
    get_payment_log,
    select_subscription_plan,
    make_yearly_commitment,
    increase_account,
    get_maximum_member_count,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    get_corp_member_count,
    get_subscribe_plan,
    get_current_subscription,
    get_current_subscription_payment,
    get_current_onetime_ticket,
    input_payment_info,
    get_payment_info,
    get_payment_log,
    select_subscription_plan,
    make_yearly_commitment,
    increase_account,
    get_maximum_member_count,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
        (async() => {
            await this.onRefresh()
        })()
    }

    onRefresh = async () => {
        let subscription_plans = (await this.props.get_subscribe_plan()).payload.map((e)=>{e.data = JSON.parse(e.data); return e});
        let current_subscription = (await this.props.get_current_subscription()).payload;
        let current_onetime_ticket = (await this.props.get_current_onetime_ticket()).payload;
        let payment_info = (await this.props.get_payment_info()).payload;
        let partial_payment_info = payment_info ? JSON.parse(payment_info.preview_data) : null;
        let payment_logs = (await this.props.get_payment_log()).payload;
        let current_subscription_payment = (await this.props.get_current_subscription_payment()).payload;
        let corp_member_count = 0;
        let corp_member_count_max = 0;
        if (this.props.user_info.account_type != 0) {
            corp_member_count = (await this.props.get_corp_member_count()).payload.count;
            corp_member_count_max = (await this.props.get_maximum_member_count()).payload.count;
        }

        console.log("subscription_plans", subscription_plans)
        console.log("current_subscription", current_subscription)
        console.log("current_onetime_ticket", current_onetime_ticket)
        console.log("payment_info", payment_info)
        console.log("partial_payment_info", partial_payment_info)
        console.log("payment_logs", payment_logs);
        console.log("current_subscription_payment", current_subscription_payment);

        this.setState({
            subscription_plans,
            current_subscription,
            current_onetime_ticket,
            partial_payment_info,
            payment_logs,
            current_subscription_payment,
            corp_member_count,
            corp_member_count_max,
        })
    }

    onClickChangeRegularPayment = async () => {
        if(!this.state.partial_payment_info) {
            let result = await this.onChangeCardInfo()
            if(!result) return
        }
        let subscribe_plans = this.state.subscription_plans;
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
            selectPeriod: 0,
            account_type:this.props.user_info.account_type,
            onResponse: async (period_type, plan_id) => {
                let resp
                if (period_type == 1) { // Yearly
                    // TODO: Make branch between register and change
                    resp = await this.props.make_yearly_commitment(plan_id);
                    if(resp.code == 1) {
                        await this.onRefresh()
                    }
                } else {
                    resp = await this.props.select_subscription_plan(plan_id);
                    if(resp.code == 1) {
                        await this.onRefresh()
                    }
                }
            }
        });
    }

    onBuyTicket = async () => {
        if(!this.state.partial_payment_info) {
            let result = await this.onChangeCardInfo()
            if(!result) return
        }
        window.openModal("PurchaseTicket", {
            onResponse: async (give_count) => {
            }
        })
    }

    onChangeCardInfo = async () => {
        let result = await new Promise( r => window.openModal("CardInfo", {
            onResponse: async (card_info) => {
                //TODO: necessary to encrypt via firma's private key
                let encrypted_data = JSON.stringify(card_info);
                let partial_info = {};
                partial_info['partial_card_number'] = card_info.card_number.slice(0, 4)+"-xxxx-xxxx-xxxx";
                partial_info['name'] = card_info.name;
                partial_info['card_type'] = card_info.card_type.toUpperCase();
                let preview_data = JSON.stringify(partial_info);
                let resp = await this.props.input_payment_info(encrypted_data, preview_data);
                await this.onRefresh()
                if(resp.code == 1) {
                    r(true)
                } else {
                    alert("card info error")
                    r(false)
                }
            }
        }))
        return result
    }

    onChangeAccountNumber = async () => {
        if(!this.state.partial_payment_info) {
            let result = await this.onChangeCardInfo()
            if(!result) return
        }
        window.openModal("PurchaseGroupMemberChange", {
            onResponse: async (change_count) => {
                let resp = this.props.increase_account(change_count);
                if (resp.code == 1) {
                    r(true);
                } else {
                    r(false);
                }
            }
        })
    }

	render() {
        let subscription_plans = this.state.subscription_plans ? this.state.subscription_plans : []
        let current_subscription = this.state.current_subscription ? this.state.current_subscription : null
        let current_onetime_ticket = this.state.current_onetime_ticket ? this.state.current_onetime_ticket : null

        let accountTypeText;
        let subscriptionText;
        switch (this.props.user_info.account_type) {
            case 0:
                accountTypeText = translate("individual_user");
                break;
            case 1:
                accountTypeText = translate("corp_user");
                break;
            case 2:
                accountTypeText = translate("corp_user");
                break;
        }

        let current_subscription_info
        if (current_subscription) {
            current_subscription_info = subscription_plans.find(e=>e.plan_id == current_subscription.plan_id);
            if (current_subscription_info) {
                console.log(current_subscription_info)
                subscriptionText = current_subscription_info.type == 2 ? translate("monthly_purchase") : translate("yearly_purchase"); // 1 건별 2 월간 3 년간
                subscriptionText += " ";
                subscriptionText += current_subscription_info.data.title;
            }
        } else {
            subscriptionText = translate("not_subscribe_status");
        }

        let card_info_string = translate("no_register_status")
        if(this.state.partial_payment_info) {
            let _i = this.state.partial_payment_info
            card_info_string = `${_i.card_type} ${_i.partial_card_number} ${_i.name}`
        }

		return (<div className="right-desc price-status-page">
            <div className="title">{translate("price_info")}</div>
            <div className="container">
                <div className="cluster">
                    <div className="box blue-box">
                        <div className="icon"><i className="fas fa-credit-card"></i></div>
                        <div className="title">{accountTypeText} | {subscriptionText}</div>
                        { (!current_subscription) ? null : [
                        <div className="desc">{translate("count_curr_all_ticket", [current_subscription.unused_count, current_subscription.total_count])}</div>,
                        <div className="sub" key={current_subscription.start_date}>
                            {translate("purchase_date")} : {moment(this.state.current_subscription_payment.start_date).format("YYYY-MM-DD HH:mm:ss")}<br/>
                            {translate("pre_purchase_date")} : {moment(this.state.current_subscription_payment.end_date).format("YYYY-MM-DD HH:mm:ss")}
                        </div>]
                        }
                        <div className="button-container">
                            <div className="button" onClick={this.onClickChangeRegularPayment}>{this.state.current_subscription ? translate("change") : translate("register")}</div>
                            {this.current_subscription ? <div className="button">{translate("terminate")}</div> : null}
                        </div>
                    </div>
                    {this.props.user_info.account_type != 0 ? <div className="box gray-box">
                        <div className="icon"><i className="fal fa-users"></i></div>
                        <div className="title">{translate("group_member_count")}</div>
                        <div className="desc">{translate("count_curr_all_person", [this.state.corp_member_count, this.state.corp_member_count_max])}</div>
                        <div className="sub">
                            {translate("purchase_date")} : {moment().format("YYYY-MM-DD HH:mm:ss")}<br/>
                            {translate("pre_purchase_date")} : {moment().format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                        <div className="button-container">
                            <div className="button" onClick={this.onChangeAccountNumber}>{translate("change")}</div>
                        </div>
                    </div> : null}
                    <div className="big-box">
                        <div className="bar middlegray-bar">
                            <div className="left">
                                <div className="title">{translate("one_time_ticket")}</div>
                                <div className="desc">{translate("remain_count_msg", [0])}</div>
                                <div className="sub">{translate("ticket_use_order_msg")}</div>
                            </div>
                            <div className="right">
                                <div className="button" onClick={this.onBuyTicket}>{translate("buy")}</div>
                            </div>
                        </div>
                        <div className="bar gray-bar">
                            <div className="left">
                                <div className="title">{translate("purchase_info")}</div>
                                <div className="desc">{card_info_string}</div>
                            </div>
                            <div className="right">
                                <div className="button" onClick={this.onChangeCardInfo}>{this.state.partial_payment_info ? translate("re_register") : translate("register")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="list">
                    <div className="title">{translate("purchase_logs")}</div>
                    <div className="head">
                        <div className="list-head-item list-content">{translate("article")}</div>
                        <div className="list-head-item list-purchase-type">{translate("purchase_way")}</div>
                        <div className="list-head-item list-price">{translate("amount_of_money")}</div>
                        <div className="list-head-item list-date">{translate("date")}</div>
                    </div>
                    {this.state.payment_logs ? this.state.payment_logs.map( (e,k) => {
                        let type
                        switch(e.type) {
                            case window.CONST.PAYMENT_LOG_TYPE.YEARLY_COMMITMENT:
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.YEARLY_PAYMENT_REGULAR:
                                type = "연간 결제 지불"
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.YEARLY_PAYMENT_UPGRADE:
                                type = "연간 결제 변경"
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.YEARLY_DISTRIBUTE_TICKET:
                                type = "연간 티켓 충전"
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.MONTHLY_PAYMENT_AND_DISTRIBUTE:
                                type = "월간 결제 " + e.total_count
                                if(e.reference_id == "PENDING")
                                    type += " (결제 예정)"
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.ONETIME_PAYMENT_AND_DISTRIBUTE:
                                type = "건별 결제"
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.PROMOTION_DISTRIBUTE_TICKET:
                                type = "프로모션 이용권 충전"
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.REFUND:
                                type = "환불"
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.MEMBER_PAYMENT_REGULAR:
                                type = "그룹 계정 결제"
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.MEMBER_PAYMENT_UPGRADE:
                                type = "그룹원 수 추가"
                                break;
                        }
                        return <div className="item" key={e.log_id}>
                            <div className="list-body-item list-content">{type}</div>
                            <div className="list-body-item list-purchase-type">신용카드</div>
                            <div className="list-body-item list-price">{e.money_amount.number_format()}원</div>
                            <div className="list-body-item list-date">{moment(e.start_date).format("YYYY-MM-DD HH:mm:ss")}</div>
                        </div>
                    }) : null}
                </div>
                <div className="list">
                    <div className="title">{translate("ticket_use_logs")}</div>
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

