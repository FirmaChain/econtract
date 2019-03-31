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
                    if( !!this.state.contract && this.state.entity_id != this.state.contract.can_edit_account_id ) {
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

    unlock_contract = (contract_open_key) => {
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

        _.step = 1;
        this.setState(_)
        return true;
    }
    

    isOpenUser = (entity_id, corp_id) => {
        for(let v of this.state.open_users) {
            if(v.l == entity_id+"_"+corp_id) {
                return true;
            }
        }
        return false 
    }

    textPrivilege(privilege) {
        switch(privilege) {
            case 1:
                return translate("signer")
                break;
            case 2:
                return translate("viewer")
                break;
        }
    } 

    onChatLoadMore = async () => {
        if(this.end_chat)
            return false

        let chats = await this.props.get_chats(this.state.contract.contract_id, this.state.page_chat, 30, this.state.last_chat_id)
        if(chats.code == 1) {
            if(chats.payload.length == 0) {
                this.end_chat = true
                return false
            }
            let all_chats = [...chats.payload, ...this.state.chat_list]
            all_chats = all_chats.sort( (a, b) => a.chat_id - b.chat_id )
            

            let _ = {
                chat_list:all_chats,
                page_chat:this.state.page_chat + 1,
            }
            if(this.state.last_chat_id == 0 && all_chats.length > 0) _.last_chat_id = all_chats[all_chats.length - 1].chat_id
            await this.setState(_);
            return true
        }
        return false
    }

    onClickSendChat = async (text)=>{
        if(this.disconnect) {
            alert(translate("broken_chat_connection_plaese_refresh"))
            return false
        }
        
        if(text.length == 0) {
            alert(translate("input_message"));
            return false
        }

        let corp_id = this.props.user_info.corp_id || 0
        let meOrGroup = select_subject(this.state.infos, this.state.groups, this.props.user_info.account_id, corp_id)

        let msg = {
            text
        }

        if(!meOrGroup.isAccount) {
            msg.username = this.props.user_info.username;
            msg.account_id = this.props.user_info.account_id;
        }
        meOrGroup = meOrGroup.my_info

        let result = await this.props.send_chat(this.state.contract.contract_id, meOrGroup.entity_id, meOrGroup.corp_id, JSON.stringify(msg))
        if(result.code == 1) {
            /*let all_chats = [...this.state.chat_list, result.payload]
            all_chats = all_chats.sort( (a, b) => a.chat_id - b.chat_id )
            await this.setState({chat_list:all_chats})*/
            return true
        }
        return false
    }

    onReceiveChat = async (chat) => {
        let all_chats = [...this.state.chat_list, chat]
        all_chats = all_chats.sort( (a, b) => a.chat_id - b.chat_id )
        await this.setState({chat_list:all_chats})
        this.state.scrollBottom && this.state.scrollBottom()
    }


    text_status(v) {
        switch(v.privilege) {
            case 1:
                return v.signature ? translate("sign_all") : translate("status_1")
            case 2:
                return translate("viewer")
        }
    }


    onToggleUser = (entity_id, corp_id, force_open) => {
        let _ = [...this.state.open_users]
        
        let checkFlag = false
        for(let i in _) {
            let v = _[i]
            if(v.l == entity_id+"_"+corp_id) {
                checkFlag = true;
                if(!force_open) _.splice(i, 1)
            }
        }

        if(!checkFlag)
            _.push({l:entity_id+"_"+corp_id})

        this.setState({
            open_users:_
        })
    }


    render_info() {
        switch(this.state.selected_menu) {
            case 0:
                return this.render_sign()
            case 1:
                return this.render_chat()
        }
    }

    render_sign() {
        let contract = this.state.contract;
        let user_infos = this.state.infos;

        let corp_id = -1
        let meOrGroup = select_subject(user_infos, [], this.state.entity_id, corp_id).my_info

        console.log(meOrGroup)

        return <div className="bottom signs">
            <div className="title">{translate("count_curr_total_person", [user_infos.filter(e=>e.is_exclude == 0).length])}</div>
            <div className="user-container me">
                <div className="user" onClick={this.onToggleUser.bind(this, meOrGroup.entity_id, meOrGroup.corp_id, false)}>
                    <i className="icon fas fa-user-edit"></i>
                    <div className="user-info">
                        <div className="name">{meOrGroup.user_info.username ? meOrGroup.user_info.username : meOrGroup.user_info.title}<span>{this.text_status(meOrGroup)}</span></div>
                        <div className="email">{meOrGroup.user_info.email ? meOrGroup.user_info.email : meOrGroup.user_info.company_name}</div>
                    </div>
                    {this.isOpenUser(meOrGroup.entity_id, meOrGroup.corp_id) ? <i className="arrow fas fa-caret-up"></i> : <i className="arrow fas fa-caret-down"></i>}
                </div>
                {this.isOpenUser(meOrGroup.entity_id, meOrGroup.corp_id) ? <div className="user-detail">
                    <div className="text-place">
                        <div className="title">{translate("role")}</div>
                        <div className="desc">{this.textPrivilege(meOrGroup.privilege)}</div>
                    </div>
                    {(()=> {
                        let user_type = meOrGroup.user_info.user_type || 0

                        if( meOrGroup.privilege != 1 ) return

                        let divs = []
                        if(user_type == 0) {
                            for(let v of contract.necessary_info.individual) {
                                divs.push(<div className="text-place" key={v}>
                                    <div className="title">{v}</div>
                                    <div className="desc">{meOrGroup.sign_info ? meOrGroup.sign_info["#"+v] || translate("unregistered") : translate("unregistered")}</div>
                                </div>)
                            }
                        } else {
                            for(let v of contract.necessary_info.corporation) {
                                divs.push(<div className="text-place" key={v}>
                                    <div className="title">{v}</div>
                                    <div className="desc">{meOrGroup.sign_info ? meOrGroup.sign_info["#"+v] || translate("unregistered") : translate("unregistered")}</div>
                                </div>)
                            }
                        }
                        return divs
                    })()}
                    { meOrGroup.privilege == 1 ? <div className="text-place">
                        <div className="title">{translate("sign")}</div>
                        <div className="desc">
                            {meOrGroup.signature ? <img src={meOrGroup.signature}/> : translate("before_sign")}
                        </div>
                    </div> : null }

                    { /*(meOrGroup.privilege == 1 && this.state.contract.status != 2) ? <div className="modify-button" onClick={this.onToggleRegisterSignForm.bind(this, false)}> {translate("sign_info_modify")} </div> : null*/ }
                </div> : null}
            </div>
            {user_infos.map( (e, k) => {
                let info = e
                if(e.user_info.user_type == 0 || e.user_info.user_type == 1) {
                    info.name = e.user_info.username;
                    info.sub = e.user_info.email;
                } else if(e.user_info.user_type == -1) {
                    info.name = `(${translate("not_regist_user")}) ${e.user_info.username}`
                    info.sub = e.user_info.email
                } else {
                    info.name = e.user_info.title
                    info.sub = e.user_info.company_name
                }

                if(e == meOrGroup)
                    return null

                /*if(info.user_info.user_type == 2) 
                    return null*/

                return <div className="user-container" key={e.entity_id+"_"+e.corp_id}>
                    <div className="user" onClick={this.onToggleUser.bind(this, e.entity_id, e.corp_id, false)}>
                        <div className="user-info">
                            <div className="name">{info.name}<span>{this.text_status(e)}</span></div>
                            <div className="email">{info.sub}</div>
                        </div>
                        {this.isOpenUser(e.entity_id, e.corp_id) ? <i className="arrow fas fa-caret-up"></i> : <i className="arrow fas fa-caret-down"></i>}
                    </div>
                    {this.isOpenUser(e.entity_id, e.corp_id) ? <div className="user-detail">
                        <div className="text-place">
                            <div className="title">{translate("role")}</div>
                            <div className="desc">{this.textPrivilege(e.privilege)}</div>
                        </div>
                        {(()=> {
                            let user_type = e.user_info.user_type || 0

                            if(e.privilege != 1)
                                return

                            let divs = []
                            if(user_type == 0) {
                                for(let v of contract.necessary_info.individual) {
                                    divs.push(<div className="text-place" key={v}>
                                        <div className="title">{v}</div>
                                        <div className="desc">{e.sign_info ? e.sign_info["#"+v] || translate("unregistered") : translate("unregistered")}</div>
                                    </div>)
                                }
                            } else if(user_type == 1){
                                for(let v of contract.necessary_info.corporation) {
                                    divs.push(<div className="text-place" key={v}>
                                        <div className="title">{v}</div>
                                        <div className="desc">{e.sign_info ? e.sign_info["#"+v] || translate("unregistered") : translate("unregistered")}</div>
                                    </div>)
                                }
                            } else if(user_type == -1) {
                                for(let v of contract.necessary_info.individual) {
                                    divs.push(<div className="text-place" key={v}>
                                        <div className="title">{v}</div>
                                        <div className="desc">{e.sign_info ? e.sign_info["#"+v] || translate("unregistered") : translate("unregistered")}</div>
                                    </div>)
                                }
                            }
                            return divs
                        })()}
                        { e.privilege == 1 ? <div className="text-place">
                            <div className="title">{translate("sign")}</div>
                            <div className="desc">
                                {e.signature != null ? <img src={e.signature}/> : translate("before_sign")}
                            </div>
                        </div> : null }
                    </div> : null}
                </div>
            })}
        </div>
    }

    render_chat() {
        return <div className="bottom chat">
            <Chatting 
                contract={this.state.contract}
                infos={this.state.infos}
                user_info={this.state.user_info}
                groups={this.state.groups}
                chat_list={this.state.chat_list}
                onSend={this.onClickSendChat}
                onLoadMore={this.onChatLoadMore}
                isSendable={this.state.contract.status != 2}
                chatType={"contract"}
                initialize={(scrollBottom) => {
                    this.setState({scrollBottom})
                }}
            />
        </div>
    }

    render_main() {

        let can_edit_name
        for(let v of this.state.infos) {
            if(v.corp_id == 0 && v.entity_id == this.state.contract.can_edit_account_id) {
                can_edit_name = v.user_info.username
            }
        }

        console.log(this.state)

        return <div className="public-sign-page">
            <div className="header-page">
                <div className="header">
                    <div className="left-icon">
                        <i className="fal fa-times" onClick={()=>history.goBack()}></i>
                    </div>
                    <div className="title">{this.state.contract.name}</div>
                </div>
                <div className="container">
                    <div className="editor">
                        <div className="title">
                            <span> <i className="fas fa-keyboard"></i> &nbsp;{translate("web_editor_mode")} </span>
                            <span className="modify-status">{this.state.contract_modify_status}</span>
                        </div>
                        <FroalaEditor
                            tag='textarea'
                            config={this.config}
                            model={this.state.model}
                            onModelChange={(model) => this.setState({model, contract_modify_status:translate("contract_modify")})} />
                        { this.state.contract.status < 2 ? <div className="can-edit-text">
                            <div>{translate("now_edit_privilege_who", [can_edit_name])}</div>
                        </div> : null }
                        { this.state.contract.status < 2 && this.state.contract.can_edit_account_id == this.state.entity_id ? <div className="floating">
                            <div>
                                <div className="circle" unselectable="on" onClick={()=>this.setState({toolbar_open:!this.state.toolbar_open})}>
                                    <i className={`far fa-plus ${this.state.toolbar_open ? "spin-start-anim" : "spin-end-anim"}`}></i>
                                </div>
                            </div>
                        </div>: null}

                        { this.state.contract.status < 2 && this.state.contract.can_edit_account_id == this.state.entity_id ? <div className={`tool-bar ${this.state.toolbar_open ? "fade-start-anim" : "fade-end-anim"}`}>
                            <div>
                                <div className="sign-title">{translate("sign_place_add_title")}</div>
                                {this.state.infos.filter( e=>e.privilege == 1 ).map( (e, k) => {
                                    return <div className="but" key={k} unselectable="on" onClick={this.onAddEditorSign.bind(this, e)}>
                                        {translate("sign_user", [e.user_info.username])}
                                    </div>
                                })}
                            </div>
                        </div> : null}
                    </div>
                    {!this.state.sign_mode ? <div className="info">
                        <div className="top">
                            <div className={"menu" + (this.state.selected_menu == 0 ? " enable-menu" : "")} onClick={e=>this.setState({selected_menu:0})}>
                                <i className="far fa-signature"></i>
                                <div className="text">{translate("sign_info")}</div>
                            </div>
                            <div className={"menu" + (this.state.selected_menu == 1 ? " enable-menu" : "")} onClick={e=>this.setState({selected_menu:1})}>
                                <i className="far fa-comments"></i>
                                <div className="text">{translate("conversation")}</div>
                            </div>
                        </div>
                        {this.render_info()}
                    </div> : <div className="info">
                        <div className="top">
                            <div className="menu">
                                <i className="far fa-signature"></i>
                                <div className="text">{translate("sign_info_register")}</div>
                            </div>
                        </div>
                        {this.render_sign_form()}
                    </div>}
                </div>
            </div>
        </div>
    }

    render() {
        if(this.state.step == 0) {
            return <div></div>
        } else if(this.state.step == 1) {
            return this.render_main();
        }
    }
}
