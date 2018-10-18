import React from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom";

export default class extends React.Component {
    constructor(){
        super()
        this.state = {
            chat_text:""
        }
    }
    
    onClickFold = ()=>{
        this.setState({
            fold:!this.state.fold
        })
    }

    send_chat = async(msg)=>{
        this.props.onChat && this.props.onChat(msg)
    }

    onKeyDownChat = async(e)=>{
        if(e.key == "Enter"){
            if(this.state.chat_text.length == 0)
                return ;

            await this.send_chat(this.state.chat_text);
            this.setState({
                chat_text:""
            })
        }
    }

    onClickSendChat = async(e)=>{
        if(this.state.chat_text.length == 0)
            return alert("메세지를 입력해주세요");


        await this.send_chat(this.state.chat_text);
        this.setState({
            chat_text:""
        })
    }

    render(){
        return (<div className="chatting-comp">
            <div className="header" onClick={this.onClickFold}>
                <div className="icon">
                    <i className="fas fa-comment-alt"></i>
                </div>
                <div className="title">
                    <div className="subject">근로계약서</div>
                    <div className="counterparties">박불이세, 박불이세, 박불이세, 박불이세</div>
                </div>
                {/* <div style={{flex:1}}/> */}
                <div> <i className={this.state.fold?`fas fa-chevron-up` : `fas fa-chevron-down`} />  </div>
            </div>
            <div className="content">
                <div style={this.state.fold ? {} : {height:0}}>
                    <div className="chat-text-container">
                    </div>
                    <div className="confirm-container">
                        <div className="confirm-text">컨펌 완료</div>
                        <div className="confirm-counterparties">박불이세, 박불이세</div>
                    </div>
                    <div className="input-container">
                        <div className="input">
                            <input placeholder="메세지를 입력해주세요." value={this.state.chat_text || ""} onKeyPress={this.onKeyDownChat} onChange={e=>this.setState({chat_text:e.target.value})} />
                            <button onClick={this.onClickSendChat}>
                                <i className="fas fa-comment"></i>
                            </button>
                        </div>
                        <div className="next-btn">
                            <i className="fas fa-check"></i>
                            컨펌하기
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}