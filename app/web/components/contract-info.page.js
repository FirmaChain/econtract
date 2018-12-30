import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import SignerSlot from "./signer-slot"
import history from '../history';
import pdfjsLib from "pdfjs-dist"
import translate from "../../common/translate"
import Information from "./information.comp"
import Footer from "./footer.comp"

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'

import {
    fetch_user_info,
} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
        super();
        this.blockFlag = false

		this.state={};
	}

	componentDidMount(){
        (async()=>{
            let user = await this.props.fetch_user_info()

            if(!user) {
                return history.push("/login")
            }
        })()
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }
    }

    onClickBack = ()=>{
        history.goBack();
    }

    keyPress = async (type, e) => {
        if(e.keyCode == 13){
            switch(type) {
                case 0:
                break;
                case 1:
                break;
            }
        }
    }

	render() {
        if(!this.props.user_info)
            return <div></div>

        return (<div className="contract-info-page">
            <div className="header-page">
                <div className="header">
                    <div className="left-icon">
                        <i className="fal fa-times" onClick={()=>history.goBack()}></i>
                    </div>
                    <div className="title">{this.state.editMode ? "템플릿 수정":"템플릿 생성"}</div>
                    { !!this.props.user_info ? <Information /> : null }
                </div>
            </div>
            <div className="content">
                <div className="bottom-container">
                    <div className="regist-contract" onClick={this.onClickRegister}>등 록</div>
                </div>
            </div>
            <Footer />
		</div>);
	}
}
