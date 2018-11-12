import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import pdfjsLib from "pdfjs-dist"
import history from '../history';
import {
    convert_doc,
    add_template
} from "../../common/actions" 
import translate from "../../common/translate"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = {
    convert_doc,
    add_template
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
    }

    onClickNext = async ()=>{
        console.log(this.props)
        if(!this.state.subject)
            return alert("제목을 입력해주세요.")
        if(!this.state.imgs)
            return alert("pdf를 선택해주세요.")

        await window.showIndicator()
        let template_id = await this.props.add_template(this.state.subject, this.state.imgs)
        history.replace(`/template-edit/${template_id}`)
        await window.hideIndicator()
    }

    onClickUploadFile = async (e)=>{
        let file = e.target.files[0];
        await window.showIndicator()
        
        let pdf, pdf_payload

        try {
            try{
                pdf_payload = await window.toPdf(file)
                pdf = await pdfjsLib.getDocument({data: pdf_payload}).promise;
            }catch(err){
                let ret = await this.props.convert_doc(file)    
                pdf_payload = ret.payload.data
                pdf = await pdfjsLib.getDocument({data: pdf_payload}).promise;
            }

            this.setState({
                file:file,
                imgs: await window.pdf2png(pdf)
            })
        } catch(err) {
            console.log(err)
            await window.hideIndicator()
            return window.alert("파일 로딩 중 문제가 발생하여 중단합니다.")
        }

        await window.hideIndicator()
    }

	render() {
		return (<div className="default-page add-template-page">
            <div className="back-key">
                <div className="round-btn" onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
                <h1>템플릿 추가</h1>
                <div className="page">
                    <div className="column-300">
                        <div className="form-layout">
                            <div className="form-label"> 템플릿 명 </div>
                            <div className="form-input">
                                <input placeholder="템플릿명을 입력해주세요." value={this.state.subject || ""} onChange={e=>this.setState({subject:e.target.value})}  />
                            </div>
                            
                            <div className="form-label"> 계약파일 업로드 </div>
                            
                            <div className="form-button">
                                {this.state.file ? <div className="filename">
                                    {this.state.file.name}
                                    <div className="del-btn" onClick={()=>this.setState({file:null, imgs:null})}>삭제</div>
                                </div> : null}
                                <button onClick={()=>this.refs.file.click()}> 파일 업로드 </button>
                            </div>

                            <input ref="file" type="file" accept=".png, .jpg, .jpeg, .doc, .docx, .ppt, .pptx, .pdf" onChange={this.onClickUploadFile} style={{display:"none"}}/>

                            <div className="form-submit">
                                <button className="border" onClick={this.onClickNext}> 다음 </button>
                            </div>
                        </div>
                    </div>
                    <div className="column-300">
                        <div className="right-desc"> * 20MB 이하의 파일만 업로드 가능합니다. </div>
                    </div>
                </div>
            </div>
		</div>);
	}
}