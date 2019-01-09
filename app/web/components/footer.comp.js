import React from "react"
import ReactDOM from "react-dom"
import { ModalManager } from "./modalmanager"
import translate from "../../common/translate"
import "./alerts"

export default class extends React.Component {
	
    download = (url) => {
        window.open(url, "_blank")
    }

    render() {
		return (<div className="footer">
            <div className="left">Copyright 2018 Firma Solutions, Inc, All right reserved</div>
            <div className="middle">
                <span onClick={this.download.bind(this, "https://e-contract.io/static/[E-Contract] Terms & Conditions.pdf")}>이용약관</span> | <span onClick={this.download.bind(this, "https://e-contract.io/static/[E-Contract] Privacy Policy.pdf")}>개인정보처리방침</span>
            </div>
            <div className="right">
                developer@firma-solutions.com
            </div>
        </div>)
	}
}
