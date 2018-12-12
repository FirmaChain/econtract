import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import Information from "./information.comp"

import {
    invite_sub_account,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    invite_sub_account,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
    onInviteSubAcount = async ()=>{
        let resp = await this.props.invite_sub_account("1", "test@test.com", {});
        if (resp) {
            return alert(resp);
        }
    }

	render() {
		return (<div>
                <div className="add-btn" onClick={this.onInviteSubAcount}>
                <div>초대</div>
                </div>
		</div>)
	}
}
