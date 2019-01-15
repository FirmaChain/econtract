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
import translate from "../../common/translate"
import Information from "./information.comp"
import Footer from "./footer.comp"
import Chatting from "./chatting.comp"

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'

import moment from 'moment'

import {
    add_template,
    update_template,
    folder_list_template,
    fetch_user_info,
    add_folder_template,
    get_template,
    get_contract,
    get_group_info,
    update_contract_model,
    update_contract_sign,
    update_contract_sign_info,
    move_contract_can_edit_account_id,
    get_chats,
    send_chat,
    check_ticket_count,
    select_subject,

} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info,
        template_folders:state.template.folders
	}
}

let mapDispatchToProps = {
    add_template,
    update_template,
    folder_list_template,
    fetch_user_info,
    add_folder_template,
    get_template,
    get_contract,
    get_group_info,
    update_contract_model,
    update_contract_sign,
    update_contract_sign_info,
    move_contract_can_edit_account_id,
    get_chats,
    send_chat,
    check_ticket_count,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
        super();

        /*$.FroalaEditor.DefineIcon('getPDF', {NAME: 'file-pdf'});
        $.FroalaEditor.RegisterCommand('getPDF', {
            title: 'getPDF',
            focus: true,
            undo: true,
            refreshAfterCallback: true,
            callback: () => {
            }
        })*/
        this.blockFlag = false;
        this.disconnect = false
        this.socket = socketIOClient(config.HOST)
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
        })
        //reconect

        this.config = {
            key:"YD3H5F3F3c1A6B5B4E2A3C2C2G3C5B1D-17mB5idbyC-22nseB1zH-9==",
            language:"ko",
            height:"100%",
            heightMax:"100%",
            charCounterCount: false,
            toolbarSticky: false,

            fontFamily: {
                "'Nanum Gothic',sans-serif":'나눔 고딕',
                'Arial,Helvetica,sans-serif': 'Arial',
                'Georgia,serif': 'Georgia',
                'Impact,Charcoal,sans-serif': 'Impact',
                'Tahoma,Geneva,sans-serif': 'Tahoma',
                "'Times New Roman',Times,serif": 'Times New Roman',
                'Verdana,Geneva,sans-serif': 'Verdana'
            },

            toolbarButtons:['paragraphFormat', 'fontFamily', 'fontSize', 'bold', 'italic', 'underline', 'strikeThrough', '|',
                'color', 'align', 'outdent', 'indent', 'formatOL', 'formatUL', 'lineHeight', '|',
                'subscript', 'superscript', 'quote', 'paragraphStyle', '-',
                /*'insertLink', */'insertImage', 'insertTable', '|',
                'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|',
                'print', /*'getPDF', */'spellChecker', 'help', '|', 'undo', 'redo','fullscreen'],

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
        }
    }

    componentDidMount() {
        setTimeout(async()=>{
            await window.showIndicator(translate("loding_contract_detail_data"))
            await this.props.fetch_user_info()
            await this.onRefresh()
            this.subscribeChannel()
            await this.onChatLoadMore()
            await window.hideIndicator()
        })

        history.block( (targetLocation) => {
            if(this.blockFlag)
                return true
            if(this.state.contract && this.state.contract.html == this.state.model)
                return true
            if(!this.state.contract)
                return true
            
            let out_flag = window._confirm(translate("are_u_stop_contract_modify_work_and_now_page_out"))
            if(out_flag)
                history.block( () => true )
            return out_flag
        })
    }

    componentWillUnmount() {
        if(this.socket)
            this.socket.disconnect()
    }

    subscribeChannel() {
        if(!this.state.contract)
            return

        this.socket.emit('subscribe_channel', this.state.contract.contract_id)
        this.socket.on("receive_chat_"+this.state.contract.contract_id, this.onReceiveChat)
        this.socket.on("refresh_contract_"+this.state.contract.contract_id, this.onRefresh)
    }

    onRefresh = async () => {
        let contract_id = this.props.match.params.contract_id || 0
        let groups = [];
        let _state = {}
        if(this.props.user_info.account_type != 0) {
            groups = await this.props.get_group_info(0)
            _state.groups = groups
        }

        let contract = await this.props.get_contract(contract_id, this.props.user_info, groups)
        if(contract.payload.contract) {
            let sign_info = {}
            let me = select_subject(contract.payload.infos, groups, this.props.user_info.account_id, -1).my_info
            if(me) {
                sign_info = me.sign_info || {};
                this.onToggleUser(me.entity_id, me.corp_id, true)
            }

            let model = contract.payload.contract.html != null ? contract.payload.contract.html : ""
            _state = {
                ..._state,
                ...contract.payload,
                model,
                sign_info,
            }

            await this.setState(_state)

            if( !!this.editor && !!contract.payload.contract && this.props.user_info.account_id != contract.payload.contract.can_edit_account_id ) {
                this.editor.edit.off()
            } else {
                this.editor.edit.on()
            }

            if(!!this.editor && !!contract.payload.contract && contract.payload.contract.status == 2) {
                this.editor.edit.off()
            }
        } else {
            alert(translate("not_exist_contract"))
            history.goBack()
        }
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }
    }

    onClickPreview = () => {
        let savePdfOption = {
            margin:0,
            filename:'계약서.pdf',
            image:{ type: 'jpeg', quality: 0.98 },
            jsPDF:{ unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:{ mode: ['avoid-all'] }
        }
        //html2pdf().set(savePdfOption).from(document.getElementsByClassName('fr-view')[0]).save()
        //window.html2Doc(document.getElementsByClassName('fr-view')[0], `[계약서] ${this.state.contract.name}`)

        if(!this.state.model || this.state.model == "") {
            return alert(translate("please_write_content"))
        }

        window.openModal("PreviewContract",{
            contract:this.state.contract,
            infos: this.state.infos,
            model: this.state.model,
        })

        /*history.push({pathname:"/preview-contract", state:{
            contract:this.state.contract,
            infos:this.state.infos,
        }})*/
    }

    onClickContractSave = async () => {
        let model = this.state.model

        if(this.state.contract.html == this.state.model)
            return;
        //encrypt model

        let r = await this.props.update_contract_model(this.state.contract.contract_id, model, this.state.contract.the_key)
        if(r.code == 1) {
            this.setState({
                contract_modify_status:translate("last_modify_contract_save") + " " + moment().format("YYYY-MM-DD HH:mm:ss")
            })
        } else if(r.code == -9) {
            alert(translate("you_dont_update_alredy_complete_contract"))
        }
    }

    onClickMoveEditPrivilege = async () => {

        window.openModal("MoveCanEditAccount",{
            user_infos: this.state.infos,
            my_account_id: this.props.user_info.account_id,
            onConfirm : async (user)=>{

                if((this.state.contract.html || "") != this.state.model)
                    if(window._confirm(translate("you_have_modify_content_save_and_pass_modify_verification")))
                        await this.onClickContractSave();

                await window.showIndicator()
                let result = await this.props.move_contract_can_edit_account_id(this.state.contract.contract_id, user.entity_id, user.sub)
                //await this.onRefresh()
                await window.hideIndicator()
            }
        })
    }

    onToggleRegisterSignForm = async () => {
        this.state.sign_mode ? this.editor.toolbar.show() : this.editor.toolbar.hide()

        let wrapper = document.getElementsByClassName("fr-wrapper")[0]
        this.state.sign_mode ? 
            wrapper.setAttribute('style', `max-height: 100%; overflow: auto; height: 100%;`) :
            wrapper.setAttribute('style', `max-height: 100%; overflow: auto; height: 100%; max-height: calc(100% - 34px) !important`);

        if( !!this.state.contract && this.props.user_info.account_id == this.state.contract.can_edit_account_id ) {
            this.state.sign_mode ? this.editor.edit.on() : this.editor.edit.off()
        }

        this.setState({
            sign_mode: !this.state.sign_mode
        })
    }

    onClickRegiserSignInfo = async () => {

        let sign_info = Object.assign(this.state.sign_info, {}) || {}
        let sign_info_list

        if(this.props.user_info.account_type == 0) {
            sign_info_list = this.state.contract.necessary_info.individual
        } else {
            sign_info_list = this.state.contract.necessary_info.corporation
        }

        for(let v of sign_info_list) {
            if(!sign_info["#"+v] || sign_info["#"+v].trim() == "") {
                return alert(translate("input_all_sign_info"))
            } else {
                sign_info["#"+v] = sign_info["#"+v].trim()
            }
        }

        if((this.state.contract.html || "") != this.state.model)
            if(window._confirm(translate("Are_U_have_modify_content_save_and_register_sign_info")))
                await this.onClickContractSave()

        await window.showIndicator()
        let r = await this.props.update_contract_sign_info(this.state.contract.contract_id, sign_info, this.state.contract.the_key)
        if(r.code == -9) alert(translate("you_dont_update_complete_contract_sign_info"))
        //await this.onRefresh()
        this.onToggleRegisterSignForm()
        await window.hideIndicator()
    }

    onClickRegisterSign = async () => {
        if( (this.state.contract.html || "") != this.state.model)
            return alert(translate("if_modify_content_not_sign"))

        let exist_ticket = (await this.props.check_ticket_count()).payload
        if(!exist_ticket)
            return alert(translate("no_ticket_please_charge"))

        let me = select_subject(this.state.infos, [], this.props.user_info.account_id, -1).my_info
        if(me == null)
            return;

        let sign_info_list
        if(this.props.user_info.account_type == 0) {
            sign_info_list = this.state.contract.necessary_info.individual
        } else {
            sign_info_list = this.state.contract.necessary_info.corporation
        }

        let sign_info = me.sign_info || {}

        for(let v of sign_info_list) {
            if(!sign_info["#"+v] || sign_info["#"+v] == "") {
                return alert(translate("input_all_sign_info"))
            }
        }

        window.openModal("DrawSign",{
            onFinish : async (signature)=>{
                let exist_ticket = (await this.props.check_ticket_count()).payload
                if(!exist_ticket)
                    return alert(translate("no_ticket_please_charge"))
                
                if(await window.confirm(translate("ticket_use_notify"), translate("ticket_use_notify_desc"))) {
                    await window.showIndicator()
                    let email_list = this.state.infos.filter(e=>window.email_regex.test(e.sub)).map(e=>e.sub)
                    let r = await this.props.update_contract_sign(this.state.contract.contract_id, signature, this.state.contract.the_key, email_list)
                    if(r.code == -9) {
                        return alert(translate("you_dont_update_complete_contract_sign"))
                    } else if(r.code == -11) {
                        return alert(tranlate("no_ticket_no_sign_please_charge"))
                    } else if(r.code == -12) {
                        let no_ticket_users = r.no_ticket_users.map(e => this.state.infos.find(ee=>e.entity_id == ee.entity_id && e.corp_id == ee.corp_id))
                        return alert(translate("i_have_ticket_but_other_no_ticket", [no_ticket_users.map(e=>e.user_info.username).join(", ")]))

                    }
                    else alert(translate("complete_sign_register"))
                    this.blockFlag = true
                    await window.hideIndicator()
                    history.replace(`/contract-info/${this.props.match.params.contract_id}`)
                }
            }
        })
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

        let corp_id = this.props.user_info.corp_id || -1
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

    render_info() {
        switch(this.state.selected_menu) {
            case 0:
                return this.render_sign()
            case 1:
                return this.render_chat()
        }
    }

    text_status(v) {
        switch(v.privilege) {
            case 1:
                return v.signature ? translate("sign_all") : translate("status_1")
            case 2:
                return translate("viewer")
        }
    }

    render_sign_form() {
        let sign_info_list
        if(this.props.user_info.account_type == 0) {
            sign_info_list = this.state.contract.necessary_info.individual
        } else {
            sign_info_list = this.state.contract.necessary_info.corporation
        }

        return <div className="bottom sign-form">
            {sign_info_list.map( (e, k) => {
                return <div className="desc" key={e}>
                    <div className="title">{e}</div>
                    <div className="text-box">
                        <input className="common-textbox"
                            type="text"
                            value={this.state.sign_info["#"+e]}
                            onChange={(ee) => {
                                let _ = {...this.state.sign_info}
                                _["#"+e] = ee.target.value
                                this.setState({sign_info:_})
                            }} />
                    </div>
                </div>
            })}
            <div className="button-save-sign-info" onClick={this.onClickRegiserSignInfo}>{translate("sign_info_save")}</div>
        </div>
    }

    render_sign() {
        let contract = this.state.contract;
        let user_infos = this.state.infos;

        let corp_id = this.props.user_info.corp_id || -1
        let meOrGroup = select_subject(user_infos, this.state.groups, this.props.user_info.account_id, corp_id).my_info

        return <div className="bottom signs">
            <div className="title">{translate("count_curr_total_person", [user_infos.filter(e=>e.privilege==1).length])}</div>
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

                    { (meOrGroup.privilege == 1 && this.state.contract.status != 2) ? <div className="modify-button" onClick={this.onToggleRegisterSignForm}> {translate("sign_info_modify")} </div> : null}
                </div> : null}
            </div>
            {user_infos.map( (e, k) => {
                let info = e
                if(e.corp_id == 0) {
                    info.name = e.user_info.username
                    info.sub = e.user_info.email
                } else {
                    info.name = e.user_info.title
                    info.sub = e.user_info.company_name
                }

                if(e == meOrGroup)
                    return null

                if(info.user_info.user_type == 2) 
                    return null

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
                            } else {
                                for(let v of contract.necessary_info.corporation) {
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
                isSendable={true}
                initialize={(scrollBottom) => {
                    this.setState({scrollBottom})
                }}
            />
        </div>
    }

	render() {
        if(!this.props.user_info || !this.state.contract)
            return <div></div>

        let can_edit_name
        for(let v of this.state.infos) {
            if(v.corp_id == 0 && v.entity_id == this.state.contract.can_edit_account_id) {
                can_edit_name = v.user_info.username
            }
        }
        let corp_id = this.props.user_info.corp_id || -1
        let meOrGroup = select_subject(this.state.infos, this.state.groups, this.props.user_info.account_id, corp_id).my_info

        return (<div className="upsert-contract-page">
            <div className="header-page">
                <div className="header">
                    <div className="left-icon">
                        <i className="fal fa-times" onClick={()=>history.goBack()}></i>
                    </div>
                    <div className="title">{this.state.contract.name}</div>
                    { !!this.props.user_info ? <Information /> : null }
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
            <div className="bottom-container">
                <div className="left">
                    <div className="but" onClick={this.onClickPreview}>
                        <i className="fal fa-eye"></i>
                        {translate("contract_preview")}
                    </div>
                    { ( this.state.contract.status < 2 && this.state.contract.can_edit_account_id == this.props.user_info.account_id) ? [
                        <div className="but" onClick={this.onClickMoveEditPrivilege} key={"edit_privilege"}>
                            <i className="far fa-arrow-to-right"></i>
                            {translate("move_edit_privilege")}
                        </div>, <div className="but" onClick={this.onClickContractSave} key={"contract_save"}>
                            <i className="far fa-save"></i>
                            {translate("modify_content_save")}
                        </div>]
                    : null}
                </div>
                {(()=>{
                    if(meOrGroup.privilege == 2 || this.state.contract.status == 2) {
                        return <div className="sign" onClick={(e)=>history.goBack()}>
                            {translate("go_back")}
                        </div>
                    }

                    return this.state.sign_mode ? <div className="sign" onClick={this.onToggleRegisterSignForm}>
                        {translate("edit_mode")}
                    </div> : <div className="sign" onClick={this.onClickRegisterSign}>
                        {meOrGroup.signature ? translate("resign") : translate("go_sign")}
                    </div>
                })()}
                
            </div>
		</div>);
	}
}
