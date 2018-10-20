import React from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import history from "../history"
import {
    send_chat,
    fetch_chat
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user:state.user.info,
        // chat:state.contract.chat
	}
}

let mapDispatchToProps = {
    send_chat,
    fetch_chat
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
    constructor(){
        super()
        this.state = {
            chat_text:"",
            list:[]
        }
    }

    componentDidMount(){
        (async ()=>{
            let list = await this.props.fetch_chat(this.props.contract_id);
            await this.addList(list)

            this.refs.bottom.scrollIntoView({ behavior: "smooth" });
        })()
    }

    componentWillUnmount(){
    }

    addList(newlist){
        return new Promise(r=>{
            let list = [...this.state.list,...newlist]

            let s = {}
            let _ = []
            for(let o of list){
                if(s[o.id] == null){
                    s[o.id] = true
                    _.push(o)
                }
            }

            _.sort((a,b)=>a.id-b.id)
            
            this.setState({
                list:_
            },r)
        })
    }
    
    onClickFold = ()=>{
        this.setState({
            fold:!this.state.fold
        })
    }

    async send(){
        await this.props.send_chat(this.props.contract_id, this.state.chat_text)
        this.setState({
            chat_text:""
        })

        let list = await this.props.fetch_chat(this.props.contract_id);
        await this.addList(list)

        this.refs.bottom.scrollIntoView({ behavior: "smooth" });
    }

    onKeyDownChat = async(e)=>{
        if(e.key == "Enter"){
            if(this.state.chat_text.length == 0)
                return ;
            await this.send()
        }
    }

    onClickSendChat = async(e)=>{
        if(this.state.chat_text.length == 0)
            return alert("메세지를 입력해주세요");

        await this.send()
    }

    onClickNext = async()=>{
        if(await confirm("다음으로","저장할 내용이 있다면 저장을 먼저 해주세요! 다음으로 넘어가시겠습니까?")){
            history.push(`/contract-confirm/${this.props.contract_id}`)
        }
    }

    userInfo(account_id){
        for(let c of this.props.counterparties){
            if(c.account_id == account_id)
                return c
        }

        if(this.props.author.account_id == account_id){
            return this.props.author
        }
    }

    render_type_string(user, type){
        if(type == 1){
            return <div>[<b>{user.name}</b>]님께서 계약서를 갱신하여 모든 서명자의 서명이 취소되었습니다. 검토 후 다시 승인해주세요.</div>
        }else if(type == 2){
            return <div>[<b>{user.name}</b>]님께서 계약서를 승인했습니다.</div>
        }else if(type == 3){
            return <div>[<b>{user.name}</b>]님께서 계약서를 거절하였습니다.</div>
        }
    }

    render_chat_slot(e){
        let user = this.userInfo(e.account_id);
        if(typeof e.msg == "object"){
            return <div key={e.id} className="notice">
                {this.render_type_string(user, e.msg.type)}
            </div>
        }else{
            let isMine = this.props.user.account_id == e.account_id
            return <div key={e.id} className={isMine? "chat-slot right" : "chat-slot left"}>
                <img className="profile" src={`https://identicon-api.herokuapp.com/${user.code}/70?format=png`}/>
                <div>
                    <div className="name">{user.name}</div>
                    <div className="msg-text">{e.msg}</div>
                </div>
            </div>
        }
    }

    render(){
        let allower = this.props.counterparties.filter(e=>e.confirm==1);
        return (<div className="chatting-comp">
            <div className="header" onClick={this.onClickFold}>
                <div className="icon">
                    <i className="fas fa-comment-alt"></i>
                </div>
                <div className="title">
                    <div className="subject">{this.props.contract_name}</div>
                    <div className="counterparties">{this.props.author.name}{this.props.counterparties.map(e=>`, ${e.name}`).join("")}</div>
                </div>
                {/* <div style={{flex:1}}/> */}
                <div> <i className={this.state.fold?`fas fa-chevron-up` : `fas fa-chevron-down`} />  </div>
            </div>
            <div className="content">
                <div style={this.state.fold ? {} : {height:0}}>
                    <div className="chat-text-container">
                        <div style={{ float:"left", clear: "both" }} ref="top" />
                        {this.state.list.map(e=>{
                            return this.render_chat_slot(e)
                        })}
                        <div style={{ float:"left", clear: "both" }} ref="bottom" />
                    </div>
                    <div className="confirm-container">
                        <div className="confirm-text">컨펌 완료</div>
                        <div className="confirm-counterparties">
                            {this.props.author.confirm == 1 ? this.props.author.name + (allower.length == 0 ? "" :", ") : null}
                            {allower.map(e=>e.name).join(", ")}
                        </div>
                    </div>
                    <div className="input-container">
                        <div className="input">
                            <input placeholder="메세지를 입력해주세요." value={this.state.chat_text || ""} onKeyPress={this.onKeyDownChat} onChange={e=>this.setState({chat_text:e.target.value})} />
                            <button onClick={this.onClickSendChat}>
                                <i className="fas fa-comment"></i>
                            </button>
                        </div>
                        <div className="next-btn" onClick={this.onClickNext}>
                            <i className="fas fa-check"></i>
                            컨펌하기
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}