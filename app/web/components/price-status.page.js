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
import queryString from "query-string"

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
    make_yearly_commitment,
    make_monthly_commitment,
    buy_onetime_ticket,
    increase_account,
    get_maximum_member_count,
    get_ticket_log,
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
    make_yearly_commitment,
    make_monthly_commitment,
    buy_onetime_ticket,
    increase_account,
    get_maximum_member_count,
    get_ticket_log,
}

const LIST_DISPLAY_COUNT = 6

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            cur_use_page:0,
            cur_payment_page:0,
        };
	}

	componentDidMount(){
        (async() => {
            await this.onRefresh()
        })()
    }

    onRefresh = async (nextProps) => {
        nextProps = !!nextProps ? nextProps : this.props
        let params = queryString.parse(nextProps.location.search)

        await window.showIndicator()

        let subscription_plans = (await this.props.get_subscribe_plan()).payload;
        let current_subscription = (await this.props.get_current_subscription()).payload;
        let current_onetime_ticket = (await this.props.get_current_onetime_ticket()).payload;
        let payment_info = (await this.props.get_payment_info()).payload;
        let partial_payment_info = payment_info ? payment_info.preview_data : null;
        let current_subscription_payment = (await this.props.get_current_subscription_payment()).payload;
        let corp_member_count = 0;
        let corp_member_count_max = 0;
        if (this.props.user_info.account_type != 0) {
            corp_member_count = (await this.props.get_corp_member_count()).payload.count;
            corp_member_count_max = (await this.props.get_maximum_member_count()).payload.count;
        }

        await this.setState({
            subscription_plans,
            current_subscription,
            current_onetime_ticket,
            partial_payment_info,
            current_subscription_payment,
            corp_member_count,
            corp_member_count_max,
            cur_payment_page:Number(params.payment_page) || 0,
            cur_use_page:Number(params.use_page) || 0,
        })

        let payment_logs = (await this.props.get_payment_log(this.state.cur_payment_page, LIST_DISPLAY_COUNT)).payload;
        let use_logs = (await this.props.get_ticket_log(this.state.cur_use_page, LIST_DISPLAY_COUNT)).payload;

        await window.hideIndicator()

        this.setState({
            payment_logs,
            use_logs,
        })


        console.log("subscription_plans", subscription_plans)
        console.log("current_subscription", current_subscription)
        console.log("current_onetime_ticket", current_onetime_ticket)
        console.log("payment_info", payment_info)
        console.log("partial_payment_info", partial_payment_info)
        console.log("payment_logs", payment_logs);
        console.log("current_subscription_payment", current_subscription_payment);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.user_info === false) {
            history.replace("/login")
        }

        let prev_payment_page = queryString.parse(nextProps.location.search).payment_page || 0
        let payment_page = queryString.parse(this.props.location.search).payment_page || 0 

        let prev_use_page = queryString.parse(nextProps.location.search).use_page || 0
        let use_page = queryString.parse(this.props.location.search).use_page || 0 

        if(prev_use_page != use_page || prev_payment_page != payment_page){
            (async()=>{
                await this.onRefresh(nextProps)
            })()
        }
    }

    moveContract = async (contract_id) => {
        history.push(`/contract-info/${contract_id}`)
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
            is_current_subscription: !!this.state.current_subscription,
            onResponse: async (period_type, plan_id) => {
                let resp
                if (period_type == 1) { // Yearly
                    // TODO: Make branch between register and change
                    resp = await this.props.make_yearly_commitment(plan_id);
                    if(resp.code == 1) {
                        alert(translate("subscribe_purchase_plan_yearly"))
                        await this.onRefresh()
                    } else {
                        return alert("error : ", resp.code)
                    }
                } else {
                    resp = await this.props.make_monthly_commitment(plan_id);
                    if(resp.code == 1) {
                        alert(translate("subscribe_purchase_plan_monthly"))
                        await this.onRefresh()
                    } else {
                        return alert("error : ", resp.code)
                    }
                }
            }
        });
    }

    onBuyTicket = async () => {
        if(!this.state.partial_payment_info) {
            let result = await this.onChangeCardInfo()
            if(!result) return;
        }

        let onetime_ticket_plan = this.state.subscription_plans.filter(e=>e.type==1).sort((a,b)=>a.total_price-b.total_price)[0]

        //let ticket_plan = (await this.props.get_onetime_ticket_plan()).payload
        window.openModal("PurchaseTicket", {
            ticket_plan:onetime_ticket_plan,
            onResponse: async (give_count) => {
                let subscribe_plans = this.state.subscription_plans;
                let plan_id = subscribe_plans.find(e=>e.type==1).plan_id;
                let resp = await this.props.buy_onetime_ticket(plan_id, give_count);
                if (resp.code == 1) {
                    await this.onRefresh();
                }
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
                partial_info['card_type'] = card_info.card_type;
                let preview_data = JSON.stringify(partial_info);
                let resp = await this.props.input_payment_info(encrypted_data, preview_data);
                await this.onRefresh()
                if(resp.code == 1) {
                    alert(translate("card_info_register_msg"))
                    await this.onRefresh();
                    r(true)
                } else {
                    alert(translate("card_info_register_fail_msg"))
                    r(false)
                }
            }
        }))
        return result
    }

    onClickPaymentLogPage = async (page)=>{
        if(this.state.cur_payment_page == page - 1)
            return;

        let params = queryString.parse(this.props.location.search)
        params.payment_page = page - 1

        history.push({pathname:this.props.match.url, search:`?${queryString.stringify(params)}`})
    }

    onClickUseLogPage = async (page)=>{
        if(this.state.cur_use_page == page - 1)
            return;

        let params = queryString.parse(this.props.location.search)
        params.use_page = page - 1

        history.push({pathname:this.props.match.url, search:`?${queryString.stringify(params)}`})
    }

    onChangeAccountNumber = async () => {
        if(!this.state.current_subscription) {
            return alert(translate("no_subscribe_no_change_group_member"))
        }

        if(!this.state.partial_payment_info) {
            let result = await this.onChangeCardInfo()
            if(!result) return
        }
        window.openModal("PurchaseGroupMemberChange", {
            member_count:this.state.corp_member_count,
            max_member_count:this.state.corp_member_count_max,
            onResponse: async (change_count) => {
                let resp = await this.props.increase_account(change_count);
                if (resp.code == 1) {
                    alert(translate("group_member_change_count"))
                    await this.onRefresh();
                } else {
                    alert(translate("group_member_change_fail"))
                }
            }
        })
    }

	render() {
        let subscription_plans = this.state.subscription_plans ? this.state.subscription_plans : []
        let current_subscription = this.state.current_subscription ? this.state.current_subscription : null
        let current_onetime_ticket = this.state.current_onetime_ticket ? this.state.current_onetime_ticket : {total_count: 0, unused_count: 0};

        let payment_logs = this.state.payment_logs ? this.state.payment_logs : {list:[]}
        let total_payment_cnt = payment_logs.total_cnt

        let use_logs = this.state.use_logs ? this.state.use_logs : {list:[]}
        let total_use_cnt = use_logs.total_cnt

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

        let is_not_yearly_plan = current_subscription && current_subscription.type != window.CONST.PAYMENT_LOG_TYPE.YEARLY_DISTRIBUTE_TICKET;
        let is_current_subscription = !current_subscription

		return (<div className="right-desc price-status-page">
            <div className="title">{translate("price_info")}</div>
            <div className="container">
                <div className="cluster">
                    <div className="box blue-box">
                        <div className="icon"><i className="fas fa-credit-card"></i></div>
                        <div className="title">{accountTypeText}</div>
                        <div className="sub-title">{subscriptionText}</div>
                        { (!current_subscription) ? [<div className="desc" key={Math.random()}>&nbsp;</div>, <div className="sub" key={Math.random()}>&nbsp;<br/>&nbsp;</div>] : [
                        <div className="desc" key={"curr_count"+current_subscription.unused_count+" "+current_subscription.total_count}>{translate("count_curr_all_ticket", [current_subscription.unused_count, current_subscription.total_count])}</div>,
                        <div className="sub" key={current_subscription.start_date}>
                            {translate("purchase_date")} : {moment(this.state.current_subscription_payment.start_date).format("YYYY-MM-DD HH:mm:ss")}<br/>
                            {translate("pre_purchase_date")} : {moment(this.state.current_subscription_payment.end_date).format("YYYY-MM-DD")}
                        </div>]
                        }
                        {this.props.user_info.account_type == 2 ? null : 
                        <div className="button-container">
                            { is_current_subscription || is_not_yearly_plan ? <div className="button" onClick={this.onClickChangeRegularPayment}>{this.state.current_subscription ? translate("change") : translate("register")}</div> : null}
                            { is_not_yearly_plan ? <div className="button">{translate("terminate")}</div> : null}
                        </div>}
                    </div>
                    {this.props.user_info.account_type != 0 ? <div className="box gray-box">
                        <div className="icon"><i className="fal fa-users"></i></div>
                        <div className="title">{translate("group_member_count")}</div>
                        <div className="sub-title">&nbsp;</div>
                        <div className="desc">{this.state.corp_member_count_max ? translate("count_curr_all_person", [this.state.corp_member_count, this.state.corp_member_count_max]) : ""}</div>
                        <div className="sub">
                            &nbsp;<br/>
                            &nbsp;
                        </div>
                        {this.props.user_info.account_type == 2 ? null : 
                        <div className="button-container">
                            <div className="button" onClick={this.onChangeAccountNumber}>{translate("change")}</div>
                        </div>}
                    </div> : null}
                    {this.props.user_info.account_type != 2 ? <div className="big-box">
                        <div className="bar middlegray-bar">
                            <div className="left">
                                <div className="title">{translate("one_time_ticket")}</div>
                                <div className="desc">{translate("remain_count_msg", [current_onetime_ticket.unused_count || 0])}</div>
                                <div className="sub">{translate("ticket_use_order_msg")}</div>
                            </div>
                            <div className="right">
                                <div className="button" onClick={this.onBuyTicket}>{translate("buy")}</div>
                            </div>
                        </div>
                        <div className="bar gray-bar">
                            <div className="left">
                                <div className="title">{translate("card_info")}</div>
                                <div className="desc">{card_info_string}</div>
                            </div>
                            <div className="right">
                                <div className="button" onClick={this.onChangeCardInfo}>{this.state.partial_payment_info ? translate("re_register") : translate("register")}</div>
                            </div>
                        </div>
                    </div> : null }
                </div>
                {this.props.user_info.account_type != 2 ?
                <div className="list">
                    <div className="title">{translate("purchase_logs")}</div>
                    <div className="head">
                        <div className="list-head-item list-content">{translate("article")}</div>
                        {/*<div className="list-head-item list-purchase-type">{translate("purchase_way")}</div>*/}
                        <div className="list-head-item list-price">&nbsp;</div>
                        <div className="list-head-item list-price">{translate("amount_of_money")}</div>
                        <div className="list-head-item list-date">{translate("date")}</div>
                    </div>
                    {payment_logs.list ? payment_logs.list.map( (e,k) => {
                        let type
                        let count = ""
                        let plan
                        switch(e.type) {
                            case window.CONST.PAYMENT_LOG_TYPE.YEARLY_COMMITMENT:
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.YEARLY_PAYMENT_REGULAR:
                                plan = this.state.subscription_plans.find(plan=>plan.plan_id == e.plan_id)
                                type = `${translate("YEARLY_PAYMENT_REGULAR")} ${plan.ticket_count}`
                                if(e.status == window.CONST.PAYMENT_LOG_STATUS.PENDING)
                                    type += ` (${translate("payment_pending")})`
                                count = translate("ticket_msg", [e.total_count])
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.YEARLY_PAYMENT_UPGRADE:
                                type = translate("YEARLY_PAYMENT_UPGRADE")
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.YEARLY_DISTRIBUTE_TICKET:
                                type = translate("YEARLY_DISTRIBUTE_TICKET")
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.MONTHLY_PAYMENT_AND_DISTRIBUTE:
                                plan = this.state.subscription_plans.find(plan=>plan.plan_id == e.plan_id)
                                type = `${translate("MONTHLY_PAYMENT_AND_DISTRIBUTE")} ${plan.ticket_count}`
                                if(e.status == window.CONST.PAYMENT_LOG_STATUS.PENDING)
                                    type += ` (${translate("payment_pending")})`
                                count = translate("ticket_msg", [e.total_count])
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.ONETIME_PAYMENT_AND_DISTRIBUTE:
                                type = translate("ONETIME_PAYMENT_AND_DISTRIBUTE")
                                count = translate("ticket_msg", [e.total_count])
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.PROMOTION_DISTRIBUTE_TICKET:
                                type = translate("PROMOTION_DISTRIBUTE_TICKET")
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.MEMBER_PAYMENT_REGULAR:
                                type = translate("MEMBER_PAYMENT_REGULAR")
                                count = translate("count_curr_total_person", [e.total_count])
                                break;
                            case window.CONST.PAYMENT_LOG_TYPE.MEMBER_PAYMENT_UPGRADE:
                                type = translate("MEMBER_PAYMENT_UPGRADE")
                                count = translate("count_curr_total_person", [e.total_count])
                                break;
                        }
                        return <div className="item" key={e.log_id}>
                            <div className="list-body-item list-content">{type}</div>
                            {/*<div className="list-body-item list-purchase-type">신용카드</div>*/}
                            <div className="list-body-item list-price">{count}</div>
                            <div className="list-body-item list-price">{translate("count_number_moeny_last", [e.money_amount.number_format()])}</div>
                            <div className="list-body-item list-date">{moment(e.start_date).format("YYYY-MM-DD HH:mm:ss")}</div>
                        </div>
                    }) : null}
                    {!payment_logs.list || payment_logs.list.length == 0 ? <div className="empty-item">{translate("empty_log")}</div>:null}
                </div> : null}
                {this.props.user_info.account_type != 2 ? <div className="pager-wrapper">
                    <Pager max={Math.ceil(total_payment_cnt/LIST_DISPLAY_COUNT)} cur={this.state.cur_payment_page + 1 ||1} onClick={this.onClickPaymentLogPage} />
                </div> : null}


                {this.props.user_info.account_type != 2 ?
                <div className="list">
                    <div className="title">{translate("ticket_use_logs")}</div>
                    <div className="head">
                        <div className="list-head-item list-content">계약명</div>
                        {/*<div className="list-head-item list-signer">서명자</div>*/}
                        <div className="list-head-item list-date">차감 일자</div>
                    </div>
                    {use_logs.list ? use_logs.list.map( (e,k) => {
                        return <div className="item" key={e.log_id} onClick={this.moveContract.bind(this, e.contract_id)}>
                            <div className="list-body-item list-content">{e.data.name}</div>
                            <div className="list-body-item list-date">{moment(e.addedAt).format("YYYY-MM-DD HH:mm:ss")}</div>
                        </div>
                    }) : null}
                    {!use_logs.list || use_logs.list.length == 0 ? <div className="empty-item">{translate("empty_log")}</div>:null}
                </div> : null}
                {this.props.user_info.account_type != 2 ? <div className="pager-wrapper">
                    <Pager max={Math.ceil(total_use_cnt/LIST_DISPLAY_COUNT)} cur={this.state.cur_use_page + 1 ||1} onClick={this.onClickUseLogPage} />
                </div> : null}
            </div>
        </div>)
	}
}

