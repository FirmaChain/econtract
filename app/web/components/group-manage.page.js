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
    get_corp_member_info_all,
    get_group_info,
    remove_corp_member,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info,
        groups: state.group.groups,
        members: state.group.members,
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    get_corp_member_info_all,
    get_group_info,
    remove_corp_member,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
        (async()=>{
            await this.onRefresh()
        })()
    }


    onRefresh = async (nextProps) => {
        nextProps = !!nextProps ? nextProps : this.props

        await this.props.get_group_info(0)
        await this.props.get_corp_member_info_all(this.props.user_info.corp_key)
    }

    onRemoveGroupMember = async (account_id) => {
    	await this. props.remove_corp_member(account_id)
    }

    onChangeAccountNumber = async () => {
        window.openModal("PurchaseGroupMemberAdd", {
            onResponse: async (card_info) => {
            }
        })
    }

	render() {
        if(!this.props.members)
            return <div />

		return (<div className="right-desc group-manage-page">
            <div className="title">그룹 관리</div>
            <div className="container">
            	<div className="row">
            		<div className="title">그룹 계정</div>
            		<div className="desc">
            			{"5/10명"}
            			<div className="blue-but" onClick={this.onChangeAccountNumber}>추가</div>
            		</div>
            	</div>
            	<div className="row">
            		<div className="title">그룹원 리스트</div>
            		<div className="desc">
            			<div className="form-list">
                        {this.props.members.map((e, k)=>{
                        	let group_id_list = e.group_ids.split(",")
                        	let user_groups = []
                        	
                        	group_id_list.map( (e, k) => {
                    			if(e == 0) {
                    				user_groups.push({title:"모든 그룹"})
                    				return
                    			}
                        		this.props.groups.map( (ee, kk) => {
                        			if(e == ee.group_id)
                        				user_groups.push({...ee, title:"#"+ee.title})
                        		})
                        	})

                            return <div className="item" key={e.account_id}>
                                <div className="icon">
                                    <i className="fas fa-user-tie"></i>
                                </div>
                                <div className="desc">
                                        <div className="username">{e.data.username}<span>{e.data.job}</span></div>
                                        <div className="email">{e.data.email}</div>
                                </div>
                                <div className="group">
                                    {user_groups.map( (e, k) => e.title).join(", ")}
                                </div>
                                <div className="action">
                                    {this.props.user_info.account_id != e.account_id ? <div className="delete" onClick={this.onRemoveGroupMember.bind(this, e.account_id)}>삭제</div> : null}
                                </div>
                            </div>
                        })}
                        {this.props.members.length == 0 ? <div className="empty">그룹원이 없습니다.</div> : null}
                        </div>
            		</div>
            	</div>
            </div>
        </div>)
	}
}

