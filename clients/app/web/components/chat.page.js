import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import RoomList from "./roomlist.comp"
import ChatRoom from "./chatroom.comp"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

@connect(mapStateToProps, mapDispatchToProps )
export default class ChatPage extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
	}

	render() {
		return (
			<div className="top-container chat-page transition-item" >
				<RoomList />
				<ChatRoom idx={this.props.match.params.chat} />
			</div>
		);
	}
}