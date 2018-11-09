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
					본 서비스는 현재 크롬 브라우저에서만 사용할 수 있는 서비스입니다.<br/>
					아래의 링크를 통해 크롬을 설치 하신 뒤 접속해주세요.
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