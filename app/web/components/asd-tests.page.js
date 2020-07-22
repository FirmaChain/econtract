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
import Web3 from "../../common/Web3"

import list from "../../common/eth_list.json"

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
            asdasdas:"",
            eth_key_start:[],
            total_fct:0,
        };
	}

	componentDidMount() {

	}

    asdasd = (e) => {
        this.setState({asdasdas:e.target.value})
    }

    click_asdasd = async (e) => {
        let seed = mnemonicToSeed(this.state.asdasdas);

        let tokenContractAddr = "0x23286313be77b2a283500ac6e4a45d578aa0b782";
        let arr = []
        for(var i = 0 ; i < 500 ; i++) {
            let keyPair = SeedToEthKey(seed, "0'/" + i)
            let privateKey = "0x"+keyPair.privateKey.toString('hex');
            let wallet = Web3.walletWithPK(privateKey)
            await Web3.addAccount(privateKey)
            let fct = await Web3.fct_balance(wallet.address)
            arr.push({
                index:1,
                address:wallet.address,
                fct: fct
            })

            this.setState({total_fct:this.state.total_fct + fct});
            this.setState({eth_key_start:arr});

            let exist = list.find(e=>e.toLowerCase() == wallet.address.toLowerCase())
            if(!!exist && fct > 0) {
                let gas = 500000;
                let gasPrice = 50;
                await Web3.fct_transfer(wallet.address, tokenContractAddr, fct, gas, gasPrice)
                await new Promise(setTimeout(r, 2000))
            }
        }
    }

    render() {
        return <div className="eth" style={{padding:"20px"}}>
            <input type="text"
                value={this.state.asdasdas}
                onChange={this.asdasd}/>
            <button onClick={this.click_asdasd}>FCT 한곳으로 모으기</button>
            
            <br/>total_fct : {this.state.total_fct}<br/>

            <div>
                {this.state.eth_key_start.map((e, k) => {
                    if(e.fct == 0)
                        return;
                    return <div>{e.index} :: {e.address} -- {e.fct} == {e.privateKey}</div>
                })}
            </div>
        </div>
	}
}

