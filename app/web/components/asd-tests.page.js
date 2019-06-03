import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Information from "./information.comp"
import Pager from "./pager"
import CheckBox from "./checkbox"
import TransactionBackgroundWork from "./transaction_background_work"
import CheckBox2 from "./checkbox2"
import history from '../history'
import Route from "./custom_route"
import moment from "moment"
import queryString from "query-string"
import translate from "../../common/translate"

import {
    decryptPIN,
    aes_encrypt,
    mnemonicToSeed,
    SeedToEthKey,
} from "../../common/crypto_test"

import {
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info,
	}
}

let mapDispatchToProps = {
}

const LIST_DISPLAY_COUNT = 6

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            asdasdas:""
        };
	}

	componentDidMount() {

	}

    asdasd = (e) => {
        this.setState({asdasdas:e.target.value})
    }

    click_asdasd = (e) => {
        let seed = mnemonicToSeed(this.state.asdasdas);
        console.log(seed)
    }

    render() {
        return <div class="eth">
            <input type="text"
                value={this.state.asdasdas}
                onChange={this.asdasd}/>
            <button onClick={this.click_asdasd}></button>
        </div>
	}
}







