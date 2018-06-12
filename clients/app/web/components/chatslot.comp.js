import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

export default class Component extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
	}

	render() {
        let raw = this.props.raw
		return (<li className="chat-text-slot" >
            <img className="thumb" src={raw.thumb}/>
            <div className="info">
                <div className="name">{raw.name}</div>
                <div className="speech-bubble"> {raw.raw} </div>
            </div>
		</li>);
	}
}