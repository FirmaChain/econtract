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
                'print', /*'getPDF', */'spellChecker', 'help', '|', 'undo', 'redo','fullscreen']
        }

        this.state = {
            model:"",
            title:"",
            editMode:false,
            select_folder_id:null,
        }
    }

    componentDidMount() {
        (async()=>{
            await window.showIndicator()
            await this.props.fetch_user_info()
            /*let folders = await this.props.folder_list_template()
            folders = folders ? folders : []*/

            let contractId = this.props.match.params.contract_id

            /*if(!!templateId) {
                let templateData = await this.props.get_template(templateId)
                let select_folder_label = null;
                for(let v of folders) {
                    if(v.folder_id == templateData.folder_id) {
                        select_folder_label = v.subject
                        break;
                    }
                }
                this.setState({
                    editMode: true,
                    template_id : templateId,
                    model:Buffer.from(templateData.html).toString(),
                    title:templateData.subject,
                    select_folder_id:templateData.folder_id,
                    select_folder_label:select_folder_label,
                })
            }*/
            await window.hideIndicator()
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
        window.html2Doc(document.getElementsByClassName('fr-view')[0], `[계약서] ${this.state.title}`)
    }

    onClickContractSave = () => {

    }

    onClickMoveEditPrivilege = () => {

    }

    onClickSubmit = async () => {
        if(this.state.title == "")
            return alert("게약서 제목을 입력해주세요.")
        else if(this.state.select_folder_id == null)
            return alert("게약서을 저장할 폴더를 선택해주세요.")

        if(this.state.editMode) {
            if(await window.confirm("계약서 수정", `해당 계약서을 수정하시겠습니까?`)){
                this.blockFlag = true
                await window.showIndicator()
                //await this.props.update_template(this.state.template_id, this.state.select_folder_id, this.state.title, this.state.model)
                await window.hideIndicator()
                history.goBack()
            }
        } else {
            if(await window.confirm("계약서 등록", `해당 계약서을 등록하시겠습니까?`)){
                this.blockFlag = true
                await window.showIndicator()
                //await this.props.add_template(this.state.title, this.state.select_folder_id, this.state.model)
                await window.hideIndicator()
                history.goBack()
            }
        }
    }

	render() {
        let folders = this.props.template_folders ? this.props.template_folders : []
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
                        <FroalaEditor
                            tag='textarea'
                            config={this.config}
                            model={this.state.model}
                            onModelChange={(model) => this.setState({model})} />
                    </div>
                    <div className="info">
                        <div className="title">
                            <i className="far fa-file-contract"></i>
                            <div className="text">정보 입력</div>
                        </div>
                        <div className="desc">
                            <div className="title">템플릿명</div>
                            <div className="text-box">
                                <input className="common-textbox"
                                    type="text"
                                    value={this.state.title}
                                    onChange={(e) => this.setState({title:e.target.value})} />
                            </div>
                        </div>
                        <div className="desc">
                            <div className="title">폴더 지정</div>
                            <div className="text-box">
                                <Dropdown className="common-select"
                                    controlClassName="control"
                                    menuClassName="item"
                                    options={folders.map((e,k) => {return {value:e.folder_id, label:e.subject}})}
                                    onChange={e=>{this.setState({select_folder_id:e.value, select_folder_label: e.label})}}
                                    value={this.state.select_folder_label} placeholder="저장할 폴더를 골라주세요" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom-container">
                <div className="left">
                    <div className="but" onClick={this.onClickContractSave}>
                        <i className="far fa-save"></i>
                        수정한 내용 저장하기
                    </div>
                    <div className="but" onClick={this.onClickMoveEditPrivilege}>
                        <i className="far fa-arrow-to-right"></i>
                        수정 권한 넘기기
                    </div>
                    <div className="but" onClick={this.onClickPreview}>
                        <i className="fal fa-eye"></i>
                        계약 미리보기
                    </div>
                </div>
                <div className="sign" onClick={this.onClickSubmit}>
                    서명 정보 등록
                </div>
            </div>
		</div>);
	}
}
