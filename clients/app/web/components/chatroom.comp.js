import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import { 
	RoomDetail
} from "../../common/actions"
import LoadingBar from "./loading.comp"
import ChatSlot from "./chatslot.comp"

class LoadingChatRoom extends React.Component{
    render(){
        return (<div className="chat-room">
            <div className="header"> 
                <div className="left">
                    <i className="fas fa-angle-left"></i>
                </div>
                <div className="subject">
                    <div className="empty-logo"/>
                    <div className="text">
                        <div className="title"><LoadingBar width={150} height={20} /></div>
                        <div className="info"><LoadingBar width={70} height={13} /></div>
                    </div>
                </div>
                <div className="right">
                    <i className="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <div className="chat-list"> <LoadingBar width={150} height={20} /></div>
            <div className="input-bar">
                <button>
                    <i className="fas fa-paperclip"></i>
                </button>
                <input placeholder="Write a message...."/>
                <button>
                    <i className="fas fa-smile"></i>
                </button>
            </div>
		</div>);
    }
}

let mapStateToProps = (state)=>{
    return {
        roomList:state.room.roomList,
        roomInfo:state.room.roomInfo
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        RefreshRoomInfo:(idx)=>dispatch(RoomDetail(idx))
    }
}

@connect(mapStateToProps, mapDispatchToProps )
export default class ChatRoom extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
        if(!this.props.empty)
            this.props.RefreshRoomInfo(this.props.idx)
    }
    
    componentWillReceiveProps(props){
        if(props.idx !== this.props.idx){
            this.props.RefreshRoomInfo(props.idx)
        }
    }

    gotoBack = ()=>{
        history.replace("/")
    }

    isLoading = ()=>{
        return this.props.roomInfo != null
    }

	render() {
        if(!this.isLoading())
            return <LoadingChatRoom />

        let roomInfo = this.props.roomInfo
        return (<div className="chat-room">
            <div className="header"> 
                <div className="left" onClick={this.gotoBack}>
                    <i className="fas fa-angle-left"></i>
                </div>
                <div className="subject">
                    <img src={roomInfo.pic}/>
                    <div className="text">
                        <div className="title">{roomInfo.name}</div>
                        <div className="info">{roomInfo.joinNum} members</div>
                    </div>
                </div>
                <div className="right">
                    <i className="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <div className="chat-list">
                <ul>
                    {roomInfo.chat.map((raw,idx)=>{
                        return <ChatSlot key={idx} raw={raw} />;
                    })}
                </ul>
            </div>
            <div className="input-bar">
                <button>
                    <i className="fas fa-paperclip"></i>
                </button>
                <input placeholder="Write a message...."/>
                <button>
                    <i className="fas fa-smile"></i>
                </button>
            </div>
		</div>);
	}
}