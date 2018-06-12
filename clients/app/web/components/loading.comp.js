import React from "react"
import ReactDOM from "react-dom"

export default class Component extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
	}

	render() {
		return (<div className="loading-bar-anim" style={{
            width:this.props.width || 200,
            height:this.props.height || 200,
        }}>
            <div className="mover"/>
		</div>);
	}
}