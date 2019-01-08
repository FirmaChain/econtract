import React from "react"
import ReactDOM from "react-dom"
import history from '../history';
import { connect } from 'react-redux';
import translate from "../../common/translate"
import {
    fetch_user_info
} from "../../common/actions"
import moment from "moment"

function onClickAddContract(){
    history.push("/add-contract")
}

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component{
    constructor(){
		super();
		this.state={};
    }

    componentDidMount(){
        /*if(!this.props.user_info){
            (async()=>{
                await window.showIndicator()
                await this.props.fetch_user_info()
                await window.hideIndicator()
            })()
        }*/

        this.update()
        this.updateIdx = setInterval(this.update, 1000)
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }
    }

    componentWillUnmount(){
        clearInterval(this.updateIdx)
    }
    
    digit = (o)=>{
        if(!o)
            return null
        
        o = o.toString()
        if(o.length == 1){
            return "0"+o
        }
        return o
    }

    update = ()=>{
        let t = window.getCookie("session_update");
        let day = 60 * 60 * 3;

        let left_time = day - ((Date.now()-t)/1000);
        let left_hour = Math.floor(left_time/60/60)
        let left_min = Math.floor(left_time/60%60)
        let left_second = Math.floor(left_time%60)

        if(left_time <= 0) {
            this.deleteSession()
            history.push("/login")
        } else {
            this.setState({
                left_hour,
                left_min,
                left_second
            })
        }
    }

    onClickUpdateLogin = ()=>{
        let session = window.getCookie("session");
        if(session){
            window.setCookie("session", session, 0.125)
            window.setCookie("session_update", Date.now(), 0.125)

            alert("정상적으로 연장되었습니다.")
        }
    }

    onMyInfo = ()=>{
        history.push("/profile")
    }

    onPriceStatusInfo = ()=>{
        history.push("/price-status")
    }

    onGroupInfo = () => {
        history.push("/group-manage")
    }

    deleteSession = () => {
        window.logout()
    }

    onLogout = () => {
        this.deleteSession()

        location.reload(true)
    }
    
    render(){
        if(!this.props.user_info)
            return <div />

        let info = this.props.user_info

        return (<div className="information">
            <div className="profile">
                <div className="name">
                    { (info.account_type == 1 || info.account_type == 2) ? <span className="company">{info.company_name}</span> : "" }
                    {info.username} <i className="fas fa-caret-down"></i>
                </div>
                <div className="email">{info.email}</div>
                <div className="profile-dropdown">
                    <div className="info-container">
                        <div className="login-session" onClick={this.onClickUpdateLogin}>
                            <div className="text">로그인 세션 연장</div>
                            <div className="time">
                                <span className="icon"><i className="fas fa-hourglass-half"></i></span>
                                {this.state.left_hour||"0"}시간 {this.digit(this.state.left_min)||"00"}분 {this.digit(this.state.left_second)||"00"}초
                            </div>
                        </div>
                        <div className="price-status" onClick={this.onPriceStatusInfo}>
                            <div className="text">이용권 현황</div>
                            <div className="status">
                                <span className="icon"><i className="far fa-usd-circle"></i></span>
                                기업 00 / 00 <span className="small">건</span> 
                            </div>
                            {/*<div className="date">
                                연간 결제 | {moment().format("YYYY-MM-DD HH:mm:ss")}
                            </div>*/}
                        </div>
                        <div className="line"></div>
                        <div className="my-info" onClick={this.onMyInfo}>내 정보</div>
                        {info.account_type == 1 ? <div className="my-info" onClick={this.onGroupInfo}>그룹 관리</div> : null}
                        <div className="logout" onClick={this.onLogout}>로그아웃</div>
                    </div>
                </div>
            </div>
        </div>)
    }
}
// <div className="pic" style={{backgroundImage:`url(https://identicon-api.herokuapp.com/${info.code}/70?format=png)`}} />
