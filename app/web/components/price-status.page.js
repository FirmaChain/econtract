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
    get_current_subscription,
    get_current_onetime_ticket,
    input_payment_info,
    get_payment_info,
    select_subscription_plan,
    make_yearly_commitment,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    get_subscribe_plan,
    get_current_subscription,
    get_current_onetime_ticket,
    input_payment_info,
    get_payment_info,
    select_subscription_plan,
    make_yearly_commitment,
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
        let subscription_plans = (await this.props.get_subscribe_plan()).map((e)=>{e.data = JSON.parse(e.data); return e});
        let current_subscription = await this.props.get_current_subscription();
        let current_onetime_ticket = await this.props.get_current_onetime_ticket();
        let payment_info = await this.props.get_payment_info();
        let partial_payment_info
        if(payment_info)
            partial_payment_info = JSON.parse(payment_info.preview_data);

        console.log("subscription_plans", subscription_plans)
        console.log("current_subscription", current_subscription)
        console.log("current_onetime_ticket", current_onetime_ticket)
        console.log("payment_info", payment_info)
        console.log("partial_payment_info", partial_payment_info)

        this.setState({
            subscription_plans,
            current_subscription,
            current_onetime_ticket,
            partial_payment_info,
        })
    }

    onClickChangeRegularPayment = async () => {
        if(this.state.partial_payment_info) {
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
            onResponse: async (period_type, plan_id) => {
                if (period_type == 1) { // Yearly
                    // TODO: Make branch between register and change
                    await this.props.make_yearly_commitment(plan_id);
                } else {
                    await this.props.select_subscription_plan(plan_id);
                }
            }
        });
    }

    onBuyTicket = async () => {
        if(this.state.partial_payment_info) {
            let result = await this.onChangeCardInfo()
            if(!result) return
        }
        window.openModal("PurchaseTicket", {
            onResponse: async (give_count) => {
            }
        })
    }

    onChangeCardInfo = async () => {
        if(this.state.partial_payment_info)
            return true

        let result = await new Promise( r => window.openModal("CardInfo", {
            data:this.state.partial_payment_info || null,
            onResponse: async (card_info) => {
                //TODO: necessary to encrypt via firma's private key
                let encrypted_data = JSON.stringify(card_info);
                let partial_info = {};
                partial_info['partial_card_number'] = card_info.card_number.slice(0, 4)+"-xxxx-xxxx-xxxx";
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
        if(this.state.partial_payment_info) {
            let result = await this.onChangeCardInfo()
            if(!result) return
        }
        window.openModal("PurchaseGroupMemberAdd", {
            onResponse: async (card_info) => {
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
        if (current_subscription) {
            let current_subscription_info = subscription_plans.find(e=>e.plan_id == current_subscription.plan_id);
            if (current_subscription_info) {
                subscriptionText = current_subscription_info.type == 1 ? translate("monthly_purchase") : translate("yearly_purchase");
                subscriptionText += " ";
                subscriptionText += current_subscription_info.data.title;
            }
        } else {
            subscriptionText = translate("not_subscribe_status");
        }
		return (<div className="right-desc price-status-page">
            <div className="title">{translate("price_info")}</div>
            <div className="container">
                <div className="cluster">
                    <div className="box blue-box">
                        <div className="icon"><i className="fas fa-credit-card"></i></div>
                        <div className="title">{accountTypeText} | {subscriptionText}</div>
                        <div className="desc">{translate("count_curr_all_ticket", [0, 10])}</div>
                        <div className="sub">{translate("purchase_date")} : {moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                        <div className="button-container">
                            <div className="button" onClick={this.onClickChangeRegularPayment}>{this.state.partial_payment_info ? translate("change") : translate("register")}</div>
                            <div className="button">{translate("terminate")}</div>
                        </div>
                    </div>
                    <div className="box gray-box">
                        <div className="icon"><i className="fal fa-users"></i></div>
                        <div className="title">{translate("count_curr_person", [10])}</div>
                        <div className="desc">{translate("count_curr_all_ticket", [0, 10])}</div>
                        <div className="sub">{translate("purchase_date")} : {moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                        <div className="button-container">
                            <div className="button" onClick={this.onChangeAccountNumber}>{translate("change")}</div>
                        </div>
                    </div>
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
                                <div className="desc">{this.state.partial_payment_info ? this.state.partial_payment_info.partial_card_number : translate("no_register_status")}</div>
                            </div>
                            <div className="right">
                                <div className="button" onClick={this.onChangeCardInfo}>{this.state.partial_payment_info ? translate("change") : translate("register")}</div>
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
                    <div className="item">
                        <div className="list-body-item list-content">건별 결제</div>
                        <div className="list-body-item list-purchase-type">신용카드</div>
                        <div className="list-body-item list-price">{"36,500원"}</div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
                    <div className="item">
                        <div className="list-body-item list-content">정기 결제</div>
                        <div className="list-body-item list-purchase-type">신용카드</div>
                        <div className="list-body-item list-price">{"36,500원"}</div>
                        <div className="list-body-item list-date">{moment().format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
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

