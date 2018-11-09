import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import pdfjsLib from "pdfjs-dist"
import history from '../history';
import translate from "../../common/translate"
  
let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
        console.log(pdfjsLib)
    }

    onClickNext = async ()=>{
        
    }

    onClickUploadFile = async (e)=>{
        let file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsBinaryString(file)

        reader.onload = ()=>{
            var loadingTask = pdfjsLib.getDocument({data: reader.result});
            loadingTask.promise.then((pdf)=>{
                var pageNumber = 1;
                pdf.getPage(pageNumber).then((page)=>{
                    this.setState({
                        file:file
                    })
                })
            }).catch(()=>{
                window.alert("PDF 형식이 아닙니다.")
            })
        }
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
                                <input placeholder="템플릿명을 입력해주세요." />
                            </div>
                            
                            <div className="form-label"> 계약파일 업로드 </div>
                            
                            <div className="form-button">
                                {this.state.file ? <div className="filename">
                                    {this.state.file.name}
                                    <div className="del-btn" onClick={()=>this.setState({file:null})}>삭제</div>
                                </div> : null}
                                <button onClick={()=>this.refs.file.click()}> 파일 업로드 </button>
                            </div>

                            <input ref="file" type="file" onChange={this.onClickUploadFile} style={{display:"none"}}/>

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