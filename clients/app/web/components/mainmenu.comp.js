import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

@connect(mapStateToProps, mapDispatchToProps )
export default class BottomMenu extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
	}

	render() {
		return (<div className="bottom-menu">
            <div><i className="fa fa-edit"/></div>
            <div><i className="fa fa-edit"/></div>
            <div><i className="fa fa-edit"/></div>
		</div>);
	}
}