import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import Information from "./information.comp"
import moment from "moment"
import md5 from 'md5'
import {modal} from "./modalmanager"

import {
    get256bitDerivedPublicKey,
    aes_encrypt,
    decrypt_corp_info,
} from "../../common/crypto_test"


@modal
export default class PreviewContract extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            /*contract:props.location.state.contract || null,
            infos:props.location.state.infos || null*/
        }
    }

    componentDidMount() {
        if(!this.props.contract || !this.props.infos) {
            alert("잘못된 경로로 들어왔습니다.")
            return history.goBack()
        }

        (async()=>{
            await this.onRefresh()
        })()
    }

    onRefresh = async () => {

    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    render_sign_info = () => {
        return <div className="sign-info">
            {this.props.infos.map( (e, k) => {
                if(e.privilege != 1)
                    return
                
                return <div className="item" key={k}>
                    <div className="title">계약자 {k+1}</div>
                    {e.sign_info ? Object.entries(e.sign_info).map( (ee, kk) => {
                        let title = ee[0].substring(1, ee[0].length)
                        return <div className="info" key={kk}><span className="first">{title}</span> : <span className="last">{ee[1]}</span></div>
                    }) : <div className="info">아직 서명 정보를 등록하지 않았습니다.</div>}
                    {e.sign_info ? <div className="signature">
                        서명
                        {e.signature ? <img src={e.signature} /> : null }
                    </div> : null}
                </div>
            })}
        </div>
    }

	render() {
        if(!this.props.contract || !this.props.infos)
            return <div></div>

        return (<div className="preview-contract-page">
            <div className="header-page">
                <div className="header">
                    <div className="left-icon">
                        <i className="fal fa-times" onClick={()=>this.closeSelf()}></i>
                    </div>
                    <div className="title">{this.props.contract.name}</div>
                    { !!this.props.user_info ? <Information /> : null }
                </div>
                <div className="container">
                    <div className="contract-main-text">
                        <div dangerouslySetInnerHTML={{__html:this.props.model}} />
                        {this.render_sign_info()}
                    </div>
                </div>
            </div>
        </div>)
	}
}
