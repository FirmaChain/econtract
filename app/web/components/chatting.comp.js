import React from "react"
import ReactDOM from "react-dom"
 
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'

import {
    select_subject,

} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info,
	}
}

let mapDispatchToProps = {
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chat_text:""
        }
        this.block_scroll = false
        this.block_chat = false
    }

    componentDidMount() {
        this.refs.bottom.scrollIntoView(/*{ behavior: "smooth" }*/);
        this.refs.list_of_chat.addEventListener('scroll', async (e) => {
            if(e.target.scrollTop < 50 && this.props.onLoadMore && !this.block_scroll) {
                let prevScrollHeight = e.target.scrollHeight
                this.block_scroll = true
                let resp = await this.props.onLoadMore()
                if(!resp)
                    return
                let diffScrollHeight = e.target.scrollHeight - prevScrollHeight
                e.target.scrollTop = diffScrollHeight
                this.block_scroll = false
            }
        })
    }

    componentWillReceiveProps(nextProps){
    }

    onClickSendChat = async() => {

        if(this.state.chat_text.length == 0 || this.block_chat)
            return

        this.block_chat = true

        let success_send_chat = await this.props.onSend(this.state.chat_text)

        if(success_send_chat) {
            await this.setState({chat_text:""})
            this.refs.bottom.scrollIntoView(/*{ behavior: "smooth" }*/);
        }

        this.block_chat = false
    }

    onKeyDownChat = async (e)=>{
        if(e.key == "Enter"){
            this.onClickSendChat()
        }
    }

    render_chat_slot(e){
        switch(e.type) {
            case 0: {
                let user = this.props.infos.find(v=>v.corp_id == e.corp_id && v.entity_id == e.entity_id)

                let corp_id = this.props.user_info.corp_id || -1
                let meOrGroup = select_subject(this.props.infos, this.props.groups, this.props.user_info.account_id, corp_id).my_info

                let isMine = meOrGroup == user

                return <div key={e.chat_id} className={isMine ? "chat-slot right" : "chat-slot left"}>
                    { !isMine ? <img className="profile" src={`https://identicon-api.herokuapp.com/${user.corp_id+"_"+user.entity_id}/70?format=png`}/> : null }
                    <div>
                        <div className="name">{user.name ? user.name : user.company_name}</div>
                        <div className="msg-text">{e.msg}</div>
                    </div>
                </div>
            }
            default:
                return <div key={e.chat_id} className="notice">
                    {e.msg}
                </div>
        }
    }


    render() {
        return <div className="chat-component">
            <div className="chat-text-container" ref="list_of_chat">
                <div className="bar" ref="top" />
                {this.props.chat_list.map(e=>{
                    return this.render_chat_slot(e)
                })}
                <div className="bar" ref="bottom" />
            </div>
            {this.props.contract.status != 2 && this.props.isSendable ?
                <div className="input-container">
                    <input className="text-box" placeholder="메세지를 입력해주세요." value={this.state.chat_text || ""}
                        onKeyPress={this.onKeyDownChat}
                        onChange={e=>this.setState({chat_text:e.target.value})} />
                    <div className="send-btn" onClick={this.onClickSendChat}>
                        <i className="fas fa-comment"></i>
                    </div>
                </div> : null
            }
        </div>
    }
}



