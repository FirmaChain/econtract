import React from "react"
import ReactDOM from "react-dom"
import { Route } from "react-router-dom"
import translate from "../../common/translate"

class MyRoute extends React.Component{
	constructor(){
		super()
		this.state={}
	}
	componentDidMount(){
		if(window.location.pathname != "/"){
			if(navigator.userAgent.indexOf("Chrome") != -1){
				this.setState({ chrome:true })
			}else{
				this.setState({ chrome:false })
			}
		}else{
			this.setState({ chrome:true })
		}
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
		if(this.state.chrome)
			return <Route {...this.props}/>
		else
			return <div className="default-page chrome-page">
				<div className="logo">
					<img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
				</div>
				<div className="description">
					{translate("this_is_chrome_desc_1")}<br/>
					{translate("this_is_chrome_desc_2")}
					<br/><br/><br/><br/>
					<a href="http://google.com/chrome" target="_blank"><img src="/static/chrome.jpg" width="200px"/></a>
				</div>
			</div>
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