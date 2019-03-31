import React from "react"
import ReactDOM from "react-dom"
import config from "../../../config"

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/languages/ko.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';
import socketIOClient from 'socket.io-client'
 
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import history from '../history';
import pdfjsLib from "pdfjs-dist"
import { sha256 } from "js-sha256"
import translate from "../../common/translate"
import Information from "./information.comp"
import Footer from "./footer.comp"
import Chatting from "./chatting.comp"

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'
import CheckBox2 from "./checkbox2"

import moment from 'moment'

import {
    get_contract_public_link,
    select_subject,
    createContractHtml,

} from "../../common/actions"

import {
    aes_encrypt,
    aes_decrypt,
} from "../../common/crypto_test"

let mapStateToProps = (state)=>{
    return {
    }
}

let mapDispatchToProps = {
    get_contract_public_link,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
    constructor(){
        super();

        this.blockFlag = false;
        this.disconnect = false
        /*this.socket = socketIOClient(config.HOST)
        this.socket.on('disconnect', async () => {
            //console.log("disconnect socket")
            this.disconnect = true
            for(let i in [0,0,0,0,0]) {
                await new Promise(r=>setTimeout(r, 2000))
                try{
                    let result = this.socket.open();
                    this.socket.removeAllListeners()
                    this.subscribeChannel()
                    this.disconnect = false
                }catch(err) {
                    continue
                }
            }
        })*/
        //reconect

        this.config = {
            ...window.CONST.FROALA,

            events : {
                'froalaEditor.initialized' : (e, editor) => {
                    this.editor = editor;
                    if( !!this.state.contract && this.props.user_info.account_id != this.state.contract.can_edit_account_id ) {
                        this.editor.edit.off()
                    } else {
                        this.editor.edit.on()
                    }

                    if(!!this.editor && !!this.state.contract && this.state.contract.status == 2) {
                        this.editor.edit.off()
                    }
                },
                'froalaEditor.image.inserted' : async (e, editor, $img, response) => {
                    $img[0].src = window.getImageBase64Uri($img[0])
                    return false;
                },
            }
        }

        this.end_chat = false

        this.state = {
            model:"",
            select_folder_id:null,
            selected_menu:0,
            contract_modify_status:"",
            sign_mode:false,
            sign_info:{},
            open_users:[],

            page_chat:0,
            last_chat_id:0,
            chat_list:[],

            toolbar_open:false,
            step:0,
        }
    }

    componentDidMount() {
        setTimeout(async()=>{
            await window.showIndicator(translate("loding_contract_detail_data"))
            
            await this.onRefresh()
            await window.hideIndicator()
        })
    }

    componentWillUnmount() {
        if(this.socket)
            this.socket.disconnect()
    }

    onRefresh = async () => {
        let resp = await this.props.get_contract_public_link(this.props.match.params.code)
        
        if(resp.code == 1) {
            this.setState({
                ...resp.payload
            })

            window.openModal("UnlockContractPublic", {
                contract:resp.payload.contract,
                infos:resp.payload.infos,
                onConfirm:this.unlock_contract
            })
        }
        else if(resp.code == -6) {
            alert(translate("invalidate_link"))
            return history.goBack();
        }
    }

    render_main() {

    }

    unlock_contract = (contract_open_key) => {
        console.log("contract_open_key", contract_open_key)
        let the_key;
        try {
            the_key = aes_decrypt(Buffer.from(this.state.ek, 'hex'), Buffer.from(contract_open_key))
        } catch(err) {
            console.log(err)
            alert(translate("fail_input_contract_open_key"))
            return false
        }
        the_key = Buffer.from(the_key, 'hex');

        try {
            let a = JSON.parse(aes_decrypt(Buffer.from(this.state.infos[0].user_info, 'hex').toString('hex'), the_key))
            console.log(a)
        } catch( err ) {
            console.log(err)
            alert(translate("fail_input_contract_open_key"))
            return false
        }
        let _ = {...this.state}

        _.infos = _.infos.map( (e) => {
            let user_info = JSON.parse(aes_decrypt(Buffer.from(e.user_info, 'hex').toString('hex'), the_key))
            return {
                ...e,
                user_info,
                sign_info : e.sign_info ? JSON.parse(aes_decrypt(Buffer.from(e.sign_info, 'hex').toString('hex'), the_key)) : e.sign_info,
                signature : e.signature ? aes_decrypt(Buffer.from(e.signature, 'hex').toString('hex'), the_key) : e.signature,
            }
        })
        _.contract.html = _.contract.html ? aes_decrypt(Buffer.from(_.contract.html, 'hex').toString('hex'), the_key) : _.contract.html
        _.contract.message = _.contract.message ? aes_decrypt(Buffer.from(_.contract.message, 'hex').toString('hex'), the_key) : _.contract.message
        _.contract.necessary_info = JSON.parse(_.contract.necessary_info)
        _.contract.the_key = the_key;

        this.setState(_)
        return true;
    }

    render() {
        if(this.state.step == 0) {
            return <div></div>
        } else {
            return this.render_main();
        }
    }
}
