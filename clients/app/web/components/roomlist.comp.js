import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import MainMenu from './mainmenu.comp'
import history from '../history';
import { 
	MyRoomList
 } from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
		...state.room
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
		MyRoomList:()=>dispatch(MyRoomList())
    }
}

@connect(mapStateToProps, mapDispatchToProps )
export default class RoomListComp extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
		this.props.MyRoomList()
	}

	clickRoom(idx){
		history.push(`/chat/${idx}`)
	}

	render() {
		return (<div className="room-list">
			<div className="searchbar">
				<input  placeholder="search" />
				{/* <button><i className="fa fa-edit"></i></button> */}
			</div>
            <ul>
                {this.props.roomList ? this.props.roomList.map((raw,idx)=>{
					return (<li className="room-slot" key={idx} onClick={this.clickRoom.bind(this,idx)}>
						<img className="thumb" src={raw.pic} />
						<div className="center-info">
							<div className="subject">{raw.name}</div>
							<div className="last-writor"></div>
							<div className="last-text">{raw.lastChat.name} : {raw.lastChat.text}</div>
						</div>
						<div className="right-info">
						</div>
					</li>)
				}) : <li> Loading... </li> }
            </ul>
			<MainMenu/>
		</div>);
	}
}