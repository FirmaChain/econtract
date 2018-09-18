import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import SignerSlot from "./signer-slot"
import history from '../history';
import pdfjsLib from "pdfjs-dist"
import Draggable from 'react-draggable';

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
		this.state={
            imgs : [],
            page : 0
        };
	}

	componentDidMount(){
        this.loadTestPDF("/test.pdf");
    }

    addObject = async(props)=>{
        let _ = `page${this.state.page}`
        let toolkit = this.state[_] || []
        this.setState({
            [_]:[...toolkit,props]
        })
        console.log(this.state)
    }

    onClickAddLabel = async(props)=>{
        this.addObject({type:"text"})
    }

    onClickAddCheckbox = async()=>{
        this.addObject({type:"checkbox"})
    }

    onClickAddImg = async()=>{
        let input = document.createElement("input")
        input.type = "file"
        input.accept=".png, .jpg, .jpeg"
        input.onchange = (e)=>{
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = ()=>{
                this.addObject({type:"img", data:reader.result})
            }
        }
        input.click()
    }

    onClickNext = async ()=>{
    }

    loadTestPDF = async (file)=>{
        await window.showIndicator("pdf를 로딩하고 있습니다.")

        let imgs = []
        let pdf = await pdfjsLib.getDocument(file).promise;
        for(let i=1; i <= pdf.numPages;i++){
            let page = await pdf.getPage(i)
            let viewport = page.getViewport(1.3);

            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            let renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext);
            imgs.push(canvas.toDataURL("image/png"));
        }

        this.setState({
            imgs:imgs
        })

        await window.hideIndicator()
    }

	render() {
		return (<div className="editor-page">
            <div className="back-key">
                <div className="round-btn"><i className="fas fa-arrow-left"></i></div>
            </div>

            <div className="left-menu">
                {this.state.imgs.map((e,k)=>{
                    return (<div key={k} onClick={()=>this.setState({page:k})} className={this.state.page == k ? `img-slot active` : `img-slot`} >
                        <div>{k+1}</div>
                        <img src={e} width="120px" />
                    </div>)
                })}
            </div>

            <div className="contents">
                <div className="header-toolkit">
                    <div className="toolkit" onClick={this.onClickAddLabel}>
                        <i className="fab fa-asymmetrik"></i>
                        서명 그리기
                    </div>
                    <div className="toolkit" onClick={this.onClickAddImg}>
                        <i className="fab fa-asymmetrik"></i>
                        서명,도장 업로드
                    </div>
                    <div className="toolkit" onClick={this.onClickAddLabel}>
                        <i className="fab fa-asymmetrik"></i>
                        텍스트 입력
                    </div>
                    <div className="toolkit" onClick={this.onClickAddCheckbox}>
                        <i className="fab fa-asymmetrik"></i>
                        체크박스 추가
                    </div>

                    <div className="line" />

                    <div className="toolkit">
                        <i className="fas fa-search-plus"></i>
                        확대
                    </div>
                    <div className="toolkit">
                        <i className="fas fa-search-minus"></i>
                        축소
                    </div>
                </div>
                <div className="edit-box">
                    {(this.state[`page${this.state.page}`] || []).map((e,k)=>{
                        return <Draggable key={k} handle=".handle" defaultPosition={{x:50,y:50}} >
                            <div className="draggable-div">
                                <div className="handle"><i className="fas fa-arrows-alt"></i></div>
                                {e.type =="text" ? <div className="content" contentEditable={true}></div> : <div className="content">
                                    {e.type == "checkbox" ? <input type="checkbox" /> : null}
                                    {e.type == "img" ? <img src={e.data} /> : null}
                                </div> }
                            </div>
                        </Draggable>
                    })}
                    <img className="edit-target" src={this.state.imgs[this.state.page]} />
                </div>
            </div>

            <div className="confirm-box">
                <i className="fas fa-check"></i>
                입력 완료
            </div>

		</div>);
	}
}