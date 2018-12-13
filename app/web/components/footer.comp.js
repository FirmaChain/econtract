import React from "react"
import ReactDOM from "react-dom"
import { ModalManager } from "./modalmanager"
import translate from "../../common/translate"
import "./alerts"

export default class extends React.Component {
	render() {
		return (<div className="footer">
            <div className="left">Copyright 2018 Firma Solutions, Inc, All right reserved</div>
            <div className="middle">
                이용약관 | 개인정보처리방침
            </div>
            <div className="right">
                developer@firma-solutions.com
            </div>
        </div>)
	}
}
