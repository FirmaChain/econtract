import React from "react"
import ReactDOM from "react-dom"
import { ModalManager } from "./modalmanager"
import "./alerts"

export default class extends React.Component {
	render() {
		return (
			<div>
				<ModalManager />
				{ this.props.children }
			</div>
		);
	}
}
