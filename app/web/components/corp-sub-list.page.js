import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import Information from "./information.comp"

import {
    fetch_user_info,
    list_template,
    select_userinfo_with_email
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    list_template,
    select_userinfo_with_email
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	render() {
		return (<div>
			hiho
		</div>)
	}
}
