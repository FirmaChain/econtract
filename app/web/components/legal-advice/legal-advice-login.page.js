import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../../history'
import translate from "../../../common/translate"
import {
    getNewBrowserKey,
} from "../../../common/crypto_test"
import {
    login_account,
    login_2fa_otp_auth,
    fetch_user_info
} from "../../../common/actions"

import Footer from "../footer.comp"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    login_account,
    login_2fa_otp_auth,
    fetch_user_info
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
        (async()=>{
            await window.showIndicator()
            await this.props.fetch_user_info()
            await window.hideIndicator()
        })()
    }

    componentWillReceiveProps(props){
        if(!!props.user_info){
            return history.replace("/legal-advice/home")
        }
    }
    
    render() {
        return <div>
            
        </div>
    }
}
