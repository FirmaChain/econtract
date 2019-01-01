import React from "react"
import ReactDOM from "react-dom"

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/languages/ko.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';
 
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
    move_contract_can_edit_account_id,
    update_contract_sign_info,
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
                'insertLink', 'insertImage', 'insertTable', '|',
                'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|',
                'print', /*'getPDF', */'spellChecker', 'help', '|', 'undo', 'redo','fullscreen'],

            events : {
                'froalaEditor.initialized' : (e, editor) => {
                    this.editor = editor;
                    if( !!this.state.contract && this.props.user_info.account_id != this.state.contract.can_edit_account_id ) {
                        this.editor.edit.off()
                    }
                }
            }
        }


        this.state = {
            model:"",
            select_folder_id:null,
            selected_menu:0,
            sign_mode:false,
            sign_info:{},
            open_users:[],
        }
    }

    componentDidMount() {
        (async()=>{
            await this.props.fetch_user_info()
            await this.onRefresh()
        })()

        history.block( (targetLocation) => {
            if(this.blockFlag)
                return true
            let out_flag = window._confirm("계약서 수정 작업을 중단하고 현재 페이지를 나가시겠습니까?")
            if(out_flag)
                history.block( () => true )
            return out_flag
        })
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
            _state = {
                ..._state,
                ...contract.payload,
                model:Buffer.from(contract.payload.contract.html).toString()
            }

            this.setState(_state)
        } else {
            alert("계약이 존재하지 않습니다.")
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
        window.html2Doc(document.getElementsByClassName('fr-view')[0], `[계약서] ${this.state.contract.name}`)
    }

    onClickContractSave = async () => {
        let model = this.state.model
        //encrypt model

        await window.showIndicator()
        await this.props.update_contract_model(this.state.contract.contract_id, model)
        await this.onRefresh()
        await window.hideIndicator()
    }

    onClickMoveEditPrivilege = () => {
        window.openModal("MoveCanEditAccount",{
            user_infos: this.state.infos,
            my_account_id: this.props.user_info.account_id,
            onConfirm : async (user)=>{
                await window.showIndicator()
                await this.props.move_contract_can_edit_account_id(this.state.contract.contract_id, user.entity_id)
                await this.onRefresh()
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

        if(this.state.sign_mode) {
            await window.showIndicator()
            await this.props.update_contract_sign_info(this.state.contract.contract_id, this.state.sign_info)
            await this.onRefresh()
            await window.hideIndicator()
        }

        this.setState({
            sign_mode: !this.state.sign_mode
        })
    }

    onClickRegisterSign = async () => {
        
        /*
        window.openModal("DrawSign",{
            onFinish : async (sign_blob)=>{
                let sign = this.state.sign_info
                sign.sign = sign_blob
                console.log(sign)
                //encrypt model
                //await this.props.update_contract_sign(this.state.contract.contract_id, sign)
            }
        })*/
    }

    onToggleUser = (entity_id, corp_id) => {
        let _ = [...this.state.open_users]
        
        let checkFlag = false
        for(let i in _) {
            let v = _[i]
            if(v.l == entity_id+"_"+corp_id) {
                checkFlag = true
                _.splice(i, 1)
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
                return "서명자"
                break;
            case 2:
                return "보기 전용"
                break;
        }
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
                return v.sign ? "서명 완료" : "서명 전"
            case 2:
                return "보기 전용"
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
            <div className="button-save-sign-info" onClick={this.onClickRegisterSign}>서명하기</div>
        </div>
    }

    render_sign() {
        let contract = this.state.contract;
        let user_infos = this.state.infos;

        let corp_id = this.props.user_info.corp_id || -1
        let meOrGroup = select_subject(user_infos, this.state.groups, this.props.user_info.account_id, corp_id).my_info

        return <div className="bottom signs">
            <div className="title">총 {user_infos.length}명</div>
            <div className="user-container me">
                <div className="user" onClick={this.onToggleUser.bind(this, meOrGroup.entity_id, meOrGroup.corp_id)}>
                    <i className="icon fas fa-user-edit"></i>
                    <div className="user-info">
                        <div className="name">{meOrGroup.user_info.username ? meOrGroup.user_info.username : meOrGroup.user_info.title}<span>{this.text_status(meOrGroup)}</span></div>
                        <div className="email">{meOrGroup.user_info.email ? meOrGroup.user_info.email : meOrGroup.user_info.company_name}</div>
                    </div>
                    {this.isOpenUser(meOrGroup.entity_id, meOrGroup.corp_id) ? <i className="arrow fas fa-caret-up"></i> : <i className="arrow fas fa-caret-down"></i>}
                </div>
                {this.isOpenUser(meOrGroup.entity_id, meOrGroup.corp_id) ? <div className="user-detail">
                    <div className="text-place">
                        <div className="title">역할</div>
                        <div className="desc">{this.textPrivilege(meOrGroup.privilege)}</div>
                    </div>
                    {(()=> {
                        let account_type = meOrGroup.account_type || 2

                        let divs = []
                        if(account_type == 0) {
                            for(let v of contract.necessary_info.indivisual) {
                                divs.push(<div className="text-place" key={v}>
                                    <div className="title">{v}</div>
                                    <div className="desc">{meOrGroup.sign_info ? meOrGroup.sign_info["#"+v] || "미등록" : "미등록"}</div>
                                </div>)
                            }
                        } else {
                            for(let v of contract.necessary_info.corporation) {
                                divs.push(<div className="text-place" key={v}>
                                    <div className="title">{v}</div>
                                    <div className="desc">{meOrGroup.sign_info ? meOrGroup.sign_info["#"+v] || "미등록" : "미등록"}</div>
                                </div>)
                            }
                        }
                        return divs
                    })()}
                    <div className="text-place">
                        <div className="title">서명</div>
                        <div className="desc">{meOrGroup.sign ? <div></div>: "서명 하기 전"}</div>
                    </div>
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

                return <div className="user-container" key={e.entity_id+"_"+e.corp_id}>
                    <div className="user" onClick={this.onToggleUser.bind(this, e.entity_id, e.corp_id)}>
                        <div className="user-info">
                            <div className="name">{info.name}<span>{this.text_status(e)}</span></div>
                            <div className="email">{info.sub}</div>
                        </div>
                        {this.isOpenUser(e.entity_id, e.corp_id) ? <i className="arrow fas fa-caret-up"></i> : <i className="arrow fas fa-caret-down"></i>}
                    </div>
                    {this.isOpenUser(e.entity_id, e.corp_id) ? <div className="user-detail">
                        <div className="text-place">
                            <div className="title">역할</div>
                            <div className="desc">{this.textPrivilege(e.privilege)}</div>
                        </div>
                        {(()=> {
                            let account_type = meOrGroup.account_type || 2

                            let divs = []
                            if(account_type == 0) {
                                for(let v of contract.necessary_info.indivisual) {
                                    divs.push(<div className="text-place" key={v}>
                                        <div className="title">{v}</div>
                                        <div className="desc">{meOrGroup.user_info["#"+v] || "미등록"}</div>
                                    </div>)
                                }
                            } else {
                                for(let v of contract.necessary_info.corporation) {
                                    divs.push(<div className="text-place" key={v}>
                                        <div className="title">{v}</div>
                                        <div className="desc">{meOrGroup.user_info["#"+v] || "미등록"}</div>
                                    </div>)
                                }
                            }
                            return divs
                        })()}
                        <div className="text-place">
                            <div className="title">서명</div>
                            <div className="desc">{e.sign ? <div></div>: "서명 하기 전"}</div>
                        </div>
                    </div> : null}
                </div>
            })}
        </div>
    }

    render_chat() {
        return <div className="bottom chat">
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

        return (<div className="upsert-contract-page">
            <div className="header-page">
                <div className="header">
                    <div className="left-icon">
                        <i className="fal fa-times" onClick={()=>history.goBack()}></i>
                    </div>
                    <div className="title">계약 내용 입력</div>
                    { !!this.props.user_info ? <Information /> : null }
                </div>
                <div className="container">
                    <div className="editor">
                        <div className="title"><i className="fas fa-keyboard"></i> &nbsp;웹 에디터 모드</div>
                        <FroalaEditor
                            tag='textarea'
                            config={this.config}
                            model={this.state.model}
                            onModelChange={(model) => this.setState({model})} />
                        <div className="can-edit-text">
                            <div>현재 {can_edit_name} 님이 수정권한을 갖고 있습니다.</div>
                        </div>
                    </div>
                    {!this.state.sign_mode ? <div className="info">
                        <div className="top">
                            <div className={"menu" + (this.state.selected_menu == 0 ? " enable-menu" : "")} onClick={e=>this.setState({selected_menu:0})}>
                                <i className="far fa-signature"></i>
                                <div className="text">서명 정보</div>
                            </div>
                            <div className={"menu" + (this.state.selected_menu == 1 ? " enable-menu" : "")} onClick={e=>this.setState({selected_menu:1})}>
                                <i className="far fa-comments"></i>
                                <div className="text">대화</div>
                            </div>
                        </div>
                        {this.render_info()}
                    </div> : <div className="info">
                        <div className="top">
                            <div className="menu">
                                <i className="far fa-signature"></i>
                                <div className="text">서명 하기</div>
                            </div>
                        </div>
                        {this.render_sign_form()}
                    </div>}
                </div>
            </div>
            <div className="bottom-container">
                <div className="left">
                    {this.state.contract.can_edit_account_id == this.props.user_info.account_id ? [<div className="but" onClick={this.onClickContractSave} key={"contract_save"}>
                        <i className="far fa-save"></i>
                        수정한 내용 저장하기
                    </div>,
                    <div className="but" onClick={this.onClickMoveEditPrivilege} key={"edit_privilege"}>
                        <i className="far fa-arrow-to-right"></i>
                        수정 권한 넘기기
                    </div>] : null}
                    <div className="but" onClick={this.onClickPreview}>
                        <i className="fal fa-eye"></i>
                        계약 미리보기
                    </div>
                </div>
                <div className="sign" onClick={this.onToggleRegisterSignForm}>
                    {this.state.sign_mode ? "저장하기" : "서명 정보 등록"}
                </div>
            </div>
		</div>);
	}
}
