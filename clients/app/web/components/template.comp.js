import React from "react"
import ReactDOM from "react-dom"

export default class extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}
