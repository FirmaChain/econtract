import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import RoomList from "./roomlist.comp"
import EmptyChatRoom from "./EmptyChatRoom.comp"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

@connect(mapStateToProps, mapDispatchToProps )
export default class IndexPage extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
	}

	render() {
		return (
			<div className="top-container index-page transition-item" >
				<RoomList />
				<EmptyChatRoom />
			</div>
		);
	}
}