import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import SignerSlot from "./signer-slot"
import history from '../history';
import pdfjsLib from "pdfjs-dist"

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
    }

    onClickNext = async ()=>{
        history.push("contract-editor")
    }

    onClickUploadFile = async (e)=>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsBinaryString(file)

        reader.onload = ()=>{
            let loadingTask = pdfjsLib.getDocument({data: reader.result});
            loadingTask.promise.then((pdf)=>{
                let pageNumber = 1;
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
		return (<div className="default-page add-contract-page">
            <div className="back-key" onClick={()=>history.goBack()}>
                <div className="round-btn"><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
                <h1>계약 등록</h1>
                <div className="page">
                    <div className="column-300">
                        <div className="form-layout">
                            <div className="form-label"> 계약명 </div>
                            <div className="form-input">
                                <input placeholder="계약서의 이름을 작성해주세요." />
                            </div>
                            
                            <div className="form-label"> 계약 파일 업로드 </div>
                            {this.state.file ? <div className="selected-file">
                                <div className="filename">{this.state.file.name}</div>
                                <div className="del-btn" onClick={()=>this.setState({file:null})}>삭제</div>
                            </div> : <div className="form-button upload-form">
                                <button onClick={()=>this.refs.file.click()}> 파일 업로드 </button>
                                <div className="or"> OR </div>
                                <select>
                                    <option>템플릿 선택</option>
                                </select>
                                <input ref="file" type="file" onChange={this.onClickUploadFile} style={{display:"none"}}/>
                            </div>}


                            <div className="form-label"> 서명자 </div>
                            <SignerSlot />

                            <div className="form-label"> 서명자 이메일 </div>
                            <div className="form-input">
                                <input placeholder="서명하실 분의 이메일을 입력해주세요." />
                            </div>

                            <div className="form-label"> 서명차 초대코드 </div>
                            <div className="form-input">
                                <input placeholder="서명하실분에게 초대코드를 요청하여 입력하세요." />
                            </div>

                            <button className="add-button">
                                <i className="fas fa-user"></i>
                                서명자 추가
                            </button>

                            <div className="form-submit">
                                <button className="border" onClick={this.onClickNext}> 다음 </button>
                            </div>
                        </div>
                    </div>
                    <div className="column-300">
                        <div className="right-desc"> 
                            <div>* 20MB 이하의 파일만 업로드 가능합니다.</div>
                            <div>자주 쓰는 계약은 [내 탬플릿] 기능을 사용하여 손쉽게 불러올 수 있습니다.<br/> [내 계약] > [내 탬플릿] > [탬플릿 추가]</div>

                            <div style={{marginTop:"110px",color:"red"}}>* 한번 계약을 등록한 경우, 서명자를 변경하실 수 없습니다.<br/>등록 전에 서명자의 정보가 맞는지 확인해주세요.</div>

                            <div>* 서명자가 서비스에 가입되어있지 않더라도 [서명자 추가] 기능을 통해 서비스에 초대하실 수 있습니다.</div>
                        </div>
                    </div>
                </div>
            </div>
		</div>);
	}
}