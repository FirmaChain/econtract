import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ContractMenu from "./contract-menu"
import Information from "./information.comp"
import Pager from "./pager"
import CheckBox from "./checkbox"
import TransactionBackgroundWork from "./transaction_background_work"
import CheckBox2 from "./checkbox2"
import history from '../history'
import Route from "./custom_route"
import moment from "moment"

import {
    recently_contracts,
    folder_in_contracts,
    all_folders,
    move_to_folder,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user:state.user.info
	}
}

let mapDispatchToProps = {
    recently_contracts,
    folder_in_contracts,
    all_folders,
    move_to_folder,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	render() {
		return (<div>
			컨트랙트 리스트
		</div>)
	}
}
