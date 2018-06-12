import React from "react"
import ReactDOM from "react-dom"
// import LoadingBar from "./loading.comp"

export default class App extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
				{/* <LoadingBar /> */}
			</div>
		);
	}
}
