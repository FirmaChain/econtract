import React from "react"
import ReactDOM from "react-dom"
import { Route } from "react-router-dom"

export default class extends React.Component{
    componentWillUnmount(){
		window.hideIndicator()
		window.allRemoveModal()
	}
	render(){
		return <Route {...this.props}/>
	}
}