import React from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom";

export default class extends React.Component {
    constructor(){
        super()
        this.state = {}
    }
    
    onClickFold = ()=>{
        this.setState({
            fold:!this.state.fold
        })
    }

    render(){
        return (<div className="chatting-comp">
            <div className="header" onClick={this.onClickFold}>
                <div className="title">계약 진행</div>
                <div> <i className="fas fa-chevron-up" />  </div>
            </div>
            <div className="content">
                <div style={this.state.fold ? {} : {height:0}}>
                    <div className="chatting">
                    채팅 내역<br/>
                    채팅 내역<br/>
                    채팅 내역<br/>
                    채팅 내역<br/>
                    채팅 내역<br/>
                    채팅 내역<br/>
                    </div>
                    <div className="counterparties">
                    카운터파티들<br/>
                    카운터파티들<br/>
                    카운터파티들<br/>
                    카운터파티들<br/>
                    카운터파티들<br/>
                    카운터파티들<br/>
                    </div>
                </div>
            </div>
        </div>)
    }
}