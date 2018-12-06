import React from "react"
import ReactDOM from "react-dom"
import history from '../history';
import { connect } from 'react-redux';
import translate from "../../common/translate"
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
        // console.log(left_hour, left_min)
        this.setState({
            left_hour: left_hour,
            left_min: left_min,
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

    onClickProfilePic = ()=>{
        history.push("/profile")
    }

    onLogout = () => {
        window.eraseCookie("session")
        window.eraseCookie("session_update")
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("entropy");
        let keys = Object.keys(sessionStorage);
        for (let i = 0; i < keys.length; i++) {
            sessionStorage.removeItem(keys[i]);
        }
        
        location.reload(true)
    }
    
    render(){
        if(!this.props.user_info){
            return <div />
        }

        let info = this.props.user_info

        return (<div className="information">
            <div className="logout">
                <button className="btn-logout" style={{padding:"10px", marginRight:"20px"}} onClick={this.onLogout}>Logout</button>
            </div>

            <div className="profile" onClick={this.onClickProfilePic}>
                <div className="name">{info.username} <i className="fas fa-caret-down"></i></div>
                <div className="email">{info.email}</div>
            </div>
        </div>)
    }
}
// <div className="pic" style={{backgroundImage:`url(https://identicon-api.herokuapp.com/${info.code}/70?format=png)`}} />
