import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import Information from "./information.comp"

import {
    invite_sub_account,
    fetch_user_info
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    invite_sub_account,
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

    constructor() {
        super()
        this.state = {
            add_email:""
        }
    }

    componentDidMount() {
        if(!this.props.user_info){
            (async()=>{
                await window.showIndicator()
                await this.props.fetch_user_info()
                await window.hideIndicator()
            })()
        }
    }

    componentWillReceiveProps(props) {
        if(props.user_info === false) {
            history.replace("/login")
        }
    }

    getGroupId() {
        console.log(this.props)
        if(!!this.props.location.state && !!this.props.location.state.group_id)
            return this.props.location.state.group_id

        return 0
    }

    onInviteSubAcount = async ()=>{
        if(this.state.add_email == "")
            return alert("초대하려는 그룹원의 이메일을 입력해주세요.")

        let resp = await this.props.invite_sub_account(this.getGroupId(), this.state.add_email, {});
        return alert(JSON.stringify(resp));
    }

	render() {
		return (<div className="upsert-contract-group-page header-page">
            <div className="header">
                <div className="left-logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/home")}/>
                </div>
                { !!this.props.user_info ? <Information /> : null }
            </div>
            <div className="head group-head">
                <i className="back fal fa-chevron-left" onClick={()=> history.goBack()}></i>
                <div className="text">인사팀</div>
            </div>
            <div className="content">
                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">그룹원 초대하기</div>
                        <div className="desc-content">추가하실 그룹원의 정보를 입력하여 추가하세요</div>
                    </div>
                    <div className="right-form">
                        <div className="column column-flex-2">
                            <div className="form-head">그룹원 이메일</div>
                            <div className="form-input">
                                <input className="common-textbox" id="email" type="email"
                                    placeholder="이메일을 입력해주세요"
                                    value={this.state.add_email || ""}
                                    onChange={e=>this.setState({add_email:e.target.value})}/>
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-head">&nbsp;</div>
                            <div className="form-input">
                                <div className={"btn-add-user" + ( (this.state.add_email || "").length==0 ? "" : " btn-add-user-active" )} onClick={this.onInviteSubAcount}>추가</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
	}
}
