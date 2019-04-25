import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../../history'
import translate from "../../../common/translate"
import {
} from "../../../common/crypto_test"
import {
    get_my_info,
    login_account
} from "../../../common/legal_actions"

import Footer from "../footer.comp"
import CheckBox3 from "../checkbox3"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    get_my_info,
    login_account
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            email:"",
            password:"",
            continue_login:true,
        };
	}

	componentDidMount(){
        (async()=>{
            await window.showIndicator()
            await this.props.get_my_info()
            await window.hideIndicator()
        })()
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.user_info === false) {
            return history.replace("/legal-advice/login")
        }
    }

    
    render() {
        return <div className="legal-advice-home legal-advice-maintain">
            홈페이지
        </div>
    }
}
