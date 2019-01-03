import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import Information from "./information.comp"
import moment from "moment"
import md5 from 'md5'

import {
    get256bitDerivedPublicKey,
    aes_encrypt,
    decrypt_corp_info,
} from "../../common/crypto_test"

import {
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            contract:props.location.state.contract || null,
            infos:props.location.state.infos || null
        }
        console.log(this.state)
    }

    componentDidMount() {
        if(!this.state.contract || !this.state.infos) {
            alert("잘못된 경로로 들어왔습니다.")
            return history.goBack()
        }

        (async()=>{
            await this.onRefresh()
        })()
    }

    onRefresh = async () => {

    }

	render() {
        if(!this.state.contract || !this.state.infos)
            return <div></div>
		
        return (<div className="preview-contract-page header-page">
            <div className="header">
                <div className="left-logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/home")}/>
                </div>
            </div>
            <div className="container">
                <div className="contract-main-text" dangerouslySetInnerHTML={{__html:this.state.contract.html}}>
                </div>
            </div>
        </div>)
	}
}
