import React from "react"
import ReactDOM from "react-dom"
import history from '../history';
import { connect } from 'react-redux';
import {
    fetch_user_info
} from "../../common/actions"

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
        if(!this.props.user_info){
            (async()=>{
                await window.showIndicator()
                await this.props.fetch_user_info()
                await window.hideIndicator()
            })()
        }

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
        o = o.toString()
        if(o.length == 1){
            return "0"+o
        }
        return o
    }

    update = ()=>{
        let t = window.getCookie("session_update");
        let day = 60 * 60 * 24;

        let left_time = day - ((Date.now()-t)/1000);
        let left_hour = Math.floor(left_time/60/60)
        let left_min = Math.floor(left_time/60%60)
        // console.log(left_hour, left_min)
        this.setState({
            left_hour: this.digit(left_hour),
            left_min: this.digit(left_min)
        })
    }

    onClickUpdateLogin = ()=>{
        let session = window.getCookie("session");
        if(session){
            window.setCookie("session", session, 0.125)
            window.setCookie("session_update", Date.now(), 0.125)

            alert("정상적으로 연장되었습니다.")
        }
    }
    
    render(){
        if(!this.props.user_info){
            return <div />
        }

        let info = this.props.user_info

        return (<div className="user-state-bar">
            {/* <div className="searchbar">
                <i className="fas fa-search" />
                <input type="text" placeholder="검색어를 입력해주세요" />
            </div> */}

            <div className="login-time-bar" onClick={this.onClickUpdateLogin}>
                <div>로그인 세션</div>
                <div>{this.state.left_hour||"00"}:{this.state.left_min||"00"}</div>
                <div>연장</div>
            </div>

            <div className="profile">
                <div className="info">
                    <div className="top">{info.username}의 초대코드</div>
                    <div className="bottom">{info.code}</div>
                </div>
                <div className="pic" style={{backgroundImage:`url(https://identicon-api.herokuapp.com/${info.code}/70?format=png)`}}>
                </div>
            </div>

            <div onClick={onClickAddContract} className="add-button">
                + 계약 등록
            </div>
        </div>)
    }
}