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
        if(!this.props.user_info){
            (async()=>{
                await window.showIndicator()
                await this.props.fetch_user_info()
                await window.hideIndicator()
            })()
        }

        this.update_balance(this.props)
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }else{
            this.update_balance(props)
        }
    }

    async update_balance(props){
        let user = props.user_info;
        if(user){
            let fct = await Web3.fct_balance( user.eth_address );
            let eth = await Web3.eth_balance( user.eth_address );

            this.setState({
                fct_balance : fct,
                eth_balance : eth
            })
        }
    }

    move(pageName) {
        history.push(`/${pageName}`)
    }

    getTitle(props) {
        props = !!props ? props : this.props
        let menu = props.match.path || "/profile"

        if(menu == "/price-status") {
            return { id:"/price-status", title : "요금"}
        }
        else if(menu == "/group-manage") {
            return { id:"/group-manage", title : "그룹 관리"}
        }
        return { id:"/profile", title : "내 정보"}
    }

	render() {
        if(!this.props.user_info)
            return <div />

		return (<div className="maintain">
            <div className="header-page">
                <div className="header">
                    <div className="left-logo">
                        <img src="/static/logo_blue.png" onClick={()=>history.push("/home")}/>
                    </div>
                    { !!this.props.user_info ? <Information /> : null }
                </div>
                <div className="information-page">
                    <div className="left-list">
                        <div className="title">설정</div>
                        <div className={"item" + (this.getTitle().id == "/profile" ? " selected" : "")} onClick={this.move.bind(this, "profile")}><i className=" icon far fa-info-circle"></i>내 정보</div>
                        <div className={"item" + (this.getTitle().id == "/price-status" ? " selected" : "")} onClick={this.move.bind(this, "price-status")}><i className="icon far fa-file-invoice-dollar"></i>요금</div>
                        {this.props.user_info.account_type == 1 ? <div className={"item" + (this.getTitle().id == "/group-manage" ? " selected" : "")} onClick={this.move.bind(this, "group-manage")}><i className="icon far fa-users"></i>그룹 관리</div> : null}
                    </div>
                    <Route path="/profile" render={() => <ProfilePage {...this.props}/>} />
                    <Route path="/price-status" render={() => <PriceStatusPage {...this.props}/>} />
                    <Route path="/group-manage" render={() => <GroupManagePage {...this.props}/>} />
                </div>
            </div>
            <Footer />
        </div>)
	}
}


 {/*<div className="default-page profile-page">
    <div className="back-key">
        <div className="round-btn" onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></div>
    </div>
    <div className="container">
        <h1>내 정보</h1>
        <div className="page">
            <div className="column-400">
                <div className="form-layout">
                    <div className="form-label"> 내 정보 </div>
                    <div className="form-input profile-info">
                        <div>
                            <img src={`https://identicon-api.herokuapp.com/${user.code}/70?format=png`} />
                        </div>
                        <div className="username">{user.username} <span className="phone">({user.userphone})</span></div>
                        <div className="useraddress">{user.useraddress}</div>
                    </div>
                    <div className="form-label"> 보유 FCT </div>
                    <div className="form-input">
                        {this.state.fct_balance==null ? "..." : `${this.state.fct_balance} FCT`}
                    </div>
                    <div className="form-label"> 보유 롭스텐 이더리움 </div>
                    <div className="form-input">
                        {this.state.eth_balance==null ? "..." : `${this.state.eth_balance} ETH`}
                    </div>

                    <div className="form-label"> 이더리움 주소 </div>
                    <div className="form-input">
                        {user.eth_address}
                    </div>
                    <div className="form-button">
                        <button className="submit-button" onClick={()=>history.push("/check-mnemonic")}>마스터 키워드 확인</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
*/}