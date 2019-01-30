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
    fetch_user_info,
    get_approval,
    get_approval_chats,
    send_approval_chat,
    update_approval_model,
} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info,
        template_folders:state.template.folders
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    get_approval,
    get_approval_chats,
    send_approval_chat,
    update_approval_model,
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
            ...window.CONST.FROALA,

            events : {
                'froalaEditor.initialized' : (e, editor) => {
                    this.editor = editor;
                    if( !!this.state.approval && this.props.user_info.account_id != this.state.approval.can_approval_account_id ) {
                        this.editor.edit.off()
                    } else {
                        this.editor.edit.on()
                    }


                    if(!!this.editor && !!this.state.approval && this.state.approval.status == 2) {
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
            approval_modify_status:"",
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
            await window.showIndicator(translate("loding_approval_detail_data"))
            await this.props.fetch_user_info()
            await this.onRefresh()
            this.subscribeChannel()
            await this.onChatLoadMore()
            await window.hideIndicator()
        })

        history.block( (targetLocation) => {
            if(this.blockFlag)
                return true
            if(this.state.approval && this.state.approval.html == this.state.model)
                return true
            if(!this.state.contract)
                return true
            
            let out_flag = window._confirm(translate("are_u_stop_approval_modify_work_and_now_page_out"))
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
        if(!this.state.approval)
            return

        this.socket.emit('subscribe_channel', 'approval_'+this.state.approval.approval_id)
        this.socket.on("receive_chat_approval_"+this.state.approval.approval_id, this.onReceiveChat)
        this.socket.on("refresh_approval_"+this.state.approval.approval_id, this.onRefresh)
    }

    onRefresh = async () => {
        let approval_id = this.props.match.params.approval_id || 0
        let groups = [];
        let _state = {}

        let approval = await this.props.get_approval(approval_id, this.props.user_info.corp_key)

        if(!approval) {
            alert(translate("contract_is_encrypt_so_dont_enter"))
            return history.goBack()
        }
        
        if(approval.payload.approval) {
            let model = approval.payload.approval.html != null ? approval.payload.approval.html : ""
            _state = {
                ..._state,
                ...approval.payload,
                model,
            }

            await this.setState(_state)

            if( !!this.editor && !!approval.payload.approval && this.props.user_info.account_id != approval.payload.approval.can_approval_account_id ) {
                this.editor.edit.off()
            } else {
                this.editor.edit.on()
            }

            if(!!this.editor && !!approval.payload.approval && approval.payload.approval.status == 2) {
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

        console.log(this.state.approval)

        window.openModal("PreviewContract",{
            title: this.state.approval.name,
            model: this.state.model,
        })

        /*history.push({pathname:"/preview-contract", state:{
            contract:this.state.contract,
            infos:this.state.infos,
        }})*/
    }

    onClickApprovalSave = async () => {
        let model = this.state.model

        if(this.state.approval.html == this.state.model)
            return;

        let result = await window.confirm(translate("modify_approval"), translate("modify_approval_desc"))
        if(!result) return;

        let r = await this.props.update_approval_model(this.state.approval.approval_id, model, this.props.user_info.corp_key)
        if(r.code == 1) {
            this.setState({
                approval_modify_status:translate("last_modify_contract_save") + " " + moment().format("YYYY-MM-DD HH:mm:ss")
            })
        } else if(r.code == -9) {
            alert(translate("you_dont_update_already_complete_approval"))
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

    isOpenUser = (entity_id, corp_id) => {
        for(let v of this.state.open_users) {
            if(v.l == entity_id+"_"+corp_id) {
                return true;
            }
        }
        return false 
    }

    onChatLoadMore = async () => {
        if(this.end_chat)
            return false

        let chats = await this.props.get_approval_chats(this.state.approval.approval_id, this.state.page_chat, 30, this.state.last_chat_id)
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

        let account_id = this.props.user_info.account_id
        let corp_id = this.props.user_info.corp_id || 0

        let msg = {
            text
        }

        let result = await this.props.send_approval_chat(this.state.approval.approval_id, account_id, corp_id, JSON.stringify(msg))
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
                return this.render_approval_line()
            case 1:
                return this.render_chat()
        }
    }

    render_approval_line() {
        return <div className="bottom approval-line">
            <div className="title">{translate("count_curr_total_person", [this.state.order_list.filter(e=>e.is_exclude==0).length])}</div>
            <div className="list">
                {this.state.order_list.map((e, k) => {
                    let role
                    let is_last = e.order_num == this.state.order_list.length - 1
                    if(e.order_num == 0)
                        role = translate("drafter")
                    else if(is_last)
                        role = translate("final_approval_user")
                    else
                        role = translate("approval_user")

                    console.log(e)

                    return <div className="item" key={e.account_id}>
                        <div className="approval-line-shape">
                            <div className="circle"></div>
                            {is_last ? null : <div className="line"></div>}
                        </div>
                        <div className="top">
                            <div className="left">
                                {role}
                            </div>
                            <div className="right">
                                <div className="name">
                                    {e.name} <span className="job">{e.public_info.job}</span>
                                </div>
                                <div className="desc">
                                    # {e.public_info.department}
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            {e.comment}
                        </div>
                    </div>
                })}
            </div>
        </div>
    }

    render_chat() {
        return <div className="bottom chat">
            <Chatting 
                approval={this.state.approval}
                order_list={this.state.order_list}
                user_info={this.state.user_info}
                chat_list={this.state.chat_list}
                onSend={this.onClickSendChat}
                onLoadMore={this.onChatLoadMore}
                isSendable={this.state.approval.status != 2}
                chatType={"approval"}
                initialize={(scrollBottom) => {
                    this.setState({scrollBottom})
                }}
            />
        </div>
    }

	render() {
        if(!this.props.user_info || !this.state.approval)
            return <div></div>

        let can_edit_name
        for(let v of this.state.order_list) {
            if(v.account_id == this.state.approval.can_approval_account_id) {
                can_edit_name = v.public_info.username
            }
        }
        let corp_id = this.props.user_info.corp_id || -1
        let meOrGroup = this.props.user_info

        return (<div className="upsert-page upsert-approval-page">
            <div className="header-page">
                <div className="header">
                    <div className="left-icon">
                        <i className="fal fa-times" onClick={()=>history.goBack()}></i>
                    </div>
                    <div className="title">{this.state.approval.name}</div>
                    { !!this.props.user_info ? <Information /> : null }
                </div>
                <div className="container">
                    <div className="editor">
                        <div className="title">
                            <span> <i className="fas fa-keyboard"></i> &nbsp;{translate("web_editor_mode")} </span>
                            <span className="modify-status">{this.state.approval_modify_status}</span>
                        </div>
                        <FroalaEditor
                            tag='textarea'
                            config={this.config}
                            model={this.state.model}
                            onModelChange={(model) => this.setState({model, approval_modify_status:translate("approval_modify")})} />
                        { this.state.approval.status == 1 ? <div className="can-edit-text">
                            <div>{translate("now_approval_privilege_who", [can_edit_name])}</div>
                        </div> : null }
                    </div>
                    <div className="info">
                        <div className="top">
                            <div className={"menu" + (this.state.selected_menu == 0 ? " enable-menu" : "")} onClick={e=>this.setState({selected_menu:0})}>
                                <i className="fal fa-sitemap"></i>
                                <div className="text">{translate("approval_line")}</div>
                            </div>
                            <div className={"menu" + (this.state.selected_menu == 1 ? " enable-menu" : "")} onClick={e=>this.setState({selected_menu:1})}>
                                <i className="far fa-comments"></i>
                                <div className="text">{translate("conversation")}</div>
                            </div>
                        </div>
                        {this.render_info()}
                    </div>
                </div>
            </div>
            <div className="bottom-container">
                <div className="left">
                    <div className="but" onClick={this.onClickPreview}>
                        <i className="fal fa-eye"></i>
                        {translate("approval_preview")}
                    </div>
                    { ( this.state.approval.status < 2 && this.state.approval.can_approval_account_id == this.props.user_info.account_id) ?
                        <div className="but" onClick={this.onClickApprovalSave}>
                            <i className="far fa-save"></i>
                            {translate("modify_content_save")}
                        </div> : null}
                </div>
                {(()=>{
                    //0 : 작성 중 1 : 결재 중 2 : 완료됨 3 : 반려됨
                    let my_account_id = this.props.user_info.account_id
                    let can_approval_account_id = this.state.approval.can_approval_account_id
                    let creator_id = this.state.approval.account_id
                    let status = this.state.approval.status

                    if(status == 2) {
                        return <div className="sign" onClick={(e)=>history.goBack()}>
                            {translate("go_back")}
                        </div>
                    } else if(status == 0 && my_account_id == can_approval_account_id){
                        return <div className="sign" onClick={this.onStartApproval}>
                            {translate("start_approval")}
                        </div>
                    } else if(status == 1 && my_account_id == can_approval_account_id && my_account_id != creator_id) {
                        return [<div className="sign" onClick={this.onConfirmApproval}>
                            {translate("confirm_approval")}
                        </div>, <div className="sign" onClick={this.onRejectApproval}>
                            {translate("reject_approval")}
                        </div>]
                    } else if(status == 3 && my_account_id == creator_id) {
                        return <div className="sign" onClick={this.onStartApproval}>
                            {translate("re_start_approval")}
                        </div>
                    } else if(status == 3 && my_account_id != creator_id) {
                        return <div className="sign">
                            {translate("re_approval_confirming")}
                        </div>
                    } else {
                        return <div className="sign">
                            {translate("ing_approval")}
                        </div>
                    }
                })()}
                
            </div>
		</div>);
	}
}
