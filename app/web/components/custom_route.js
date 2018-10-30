import React from "react"
import ReactDOM from "react-dom"
import { Route } from "react-router-dom"

class MyRoute extends React.Component{
	componentDidMount(){

	}
    componentWillUnmount(){
		window.hideIndicator()
		window.allRemoveModal()
	}
	componentWillReceiveProps(nextProps) {
		const { location, match } = this.props.routerProps;
		const { location: nextLocation, match: nextMatch } = nextProps.routerProps;
		if (match.path !== nextMatch.path) {
		} else if (location !== nextLocation) {
		}
	  }
	
	render(){
		return <Route {...this.props}/>
	}
}

const RouteHook = ({
	path,
	exact,
	strict,
	...rest
}) => (<Route
	path={path}
	exact={exact}
	strict={strict}
	render={routerProps => <MyRoute routerProps={routerProps} {...rest} />}
/>);

export default RouteHook;