import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history'
import {
    fetch_user_info
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = {
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super()
		this.state={

        }
	}

	componentDidMount(){
        (async()=>{
            await window.showIndicator()
            await window.hideIndicator()
        })()
    }

    componentWillReceiveProps(props){
    }

    onClickUploadFile = async (e)=>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsBinaryString(file)

        reader.onload = async()=>{
            await window.showIndicator()
            try{
                /*let pdf = await pdfjsLib.getDocument({data: reader.result}).promise;
                let imgs = []
                for(let i=1; i <= pdf.numPages;i++){
                    let page = await pdf.getPage(i)
                    let viewport = page.getViewport(1.5);
        
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
        
                    let renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
        
                    await page.render(renderContext);
                    let v = canvas.toDataURL("image/png")
                    imgs.push(v);
                }*/

                this.setState({
                    file: file,
                    // imgs: imgs
                })
            }catch(err){
                console.log(err)
                window.alert("PDF 형식이 아닙니다.")
            }
            await window.hideIndicator()
        }
    }

	render() {
        if(this.props.user_info === null){
            return <div />
        }

		return (<div className="verification-page">
            <div className="top">
                <div className="logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
                </div>
                <div className="title">문서 위 ・ 변조 검증 서비스</div>
                <div className="desc">이더리움에 올라간 계약의 해쉬값과 파일의 대조를 통한 검증 서비스를 제공합니다!</div>
                <div className="desc-image">
                    <div>
                        <img src="/static/pic_01.jpg" />
                        <div className="img-desc">등록하신 계약의 상세보기 화면에서</div>
                    </div>
                    <div>
                        <img src="/static/pic_02.jpg" />
                        <div className="img-desc">해쉬값 혹은 트랜잭션 주소를 붙여넣으시고</div>
                    </div>
                    <div>
                        <img src="/static/pic_03.jpg" />
                        <div className="img-desc">계약서를 로드하여 검증하면 끝!</div>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="form-label"> 계약 해쉬값 또는 트랜잭션 </div>
                <div className="form-input">
                    <input placeholder="해쉬값 또는 트랜잭션 주소를 입력해주세요(etherscan.io)" value={this.state.contract_name || ""} onChange={e=>this.setState({contract_name:e.target.value})} />
                </div>
                <div className="form-label"> 계약명 </div>
                {this.state.file ? <div className="selected-file">
                    <div className="filename">{this.state.file.name}</div>
                    <div className="del-btn" onClick={()=>this.setState({file:null,imgs:[]})}>삭제</div>
                </div> : <div className="upload-form">
                    <button className="file-upload-btn" onClick={()=>this.refs.file.click()}> <i className="fas fa-file-archive"></i> 파일 업로드 </button>
                    <input ref="file" type="file" onChange={this.onClickUploadFile} style={{display:"none"}}/>
                </div>}
                <div className="form-button">
                    <div className="submit-button">검증하기</div>
                </div>
            </div>
		</div>);
	}
}