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
    fetch_user_info,
    list_template,
} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    list_template,
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
            model:""
        }
    }

    componentDidMount() {
        (async()=>{
            await window.showIndicator()
            await this.props.fetch_user_info()
            await window.hideIndicator()
        })()
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
            jsPDF:{ unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak:{ mode: ['avoid-all'] }
        }
        html2pdf().set(savePdfOption).from(document.getElementsByClassName('fr-view')[0]).save()
    }

    onClickSubmit = () => {

    }

	render() {

        return (<div className="add-template">
            <div className="header-page">
                <div className="header">
                    <div className="left-icon">
                        <i className="fal fa-times" onClick={()=>history.goBack()}></i>
                    </div>
                    <div className="title">템플릿 생성</div>
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
                                <input className="common-textbox" type="text" />
                            </div>
                        </div>
                        <div className="desc">
                            <div className="title">폴더 지정</div>
                            <div className="text-box">
                                <Dropdown className="common-select"
                                    controlClassName="control"
                                    menuClassName="item"
                                    options={_roles}
                                    onChange={e=>{this.setState({add_role:e.value})}}
                                    value={_roles[0]} placeholder="사용자 역할을 골라주세요" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom-container">
                <div className="preview" onClick={this.onClickPreview}>
                    <i className="fal fa-eye"></i>
                    미리보기
                </div>
                <div className="submit" onClick={this.onClickSubmit}>
                    등록하기
                </div>
            </div>
		</div>);
	}
}
