import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import pdfjsLib from "pdfjs-dist"
import Draggable from 'react-draggable';
import {
    load_contract
} from "../../common/actions"


class Item extends React.Component{
    content(){
        let props = this.props
        if(props.type == "text"){
            return <div 
                className="content" 
                contentEditable={true} 
                onBlur={(e)=>props.onUpdate("text",e.target.innerHTML)} 
                dangerouslySetInnerHTML={{__html:props.text}}>
            </div>
        }else if(props.type == "checkbox"){
            return <div className="content"> <input type="checkbox" /> </div>
        }else if(props.type == "img"){
            return <div className="content">
                <img src={props.data} style={{
                    width:props.width,
                    height:props.height
                }} />
                <div 
                    className="extend"
                    onMouseDown={(e)=>this.click=true}
                    onMouseMove={(e)=>{if(this.click)props.onUpdate("resize",{ dx:e.movementX, dy:e.movementY, })}}
                    onMouseUp={(e)=>this.click=false}
                    onMouseLeave={(e)=>this.click=false}
                > <i className="fas fa-expand"></i> </div>
            </div>
        }
    }

    render(){
        let props = this.props
        return <Draggable handle=".handle" defaultPosition={{x:props.x,y:props.y}} onStop={(e,n)=>props.onUpdate("pos", {x:n.x, y:n.y})} >
            <div className="draggable-div">
                <div className="handle"><i className="fas fa-arrows-alt" /></div>
                {this.content()}
            </div>
        </Draggable>
    }
}

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = {
    load_contract
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
        (async()=>{
            await window.showIndicator()
            let contract = await this.props.load_contract(this.props.match.params.id)
            if(contract.contract_id){
                this.setState({
                    ...contract
                })
            }else{
                alert("정상적으로 불러오지 못했습니다.")
            }
            await window.hideIndicator()
        })()

        this.unblock = history.block(targetLocation => {
            if(window._confirm("계약작성을 중단하고 현재 페이지를 나가시겠습니까?")){
                return true;
            }else{
                return false;
            }
       })
    }

    componentWillUnmount(){
        this.unblock();
    }

    addObject = async(props)=>{
        let _ = `page${this.state.page}`
        let toolkit = this.state[_] || []
        this.setState({
            [_]:[...toolkit,props]
        })
    }

    onClickAddLabel = async(props)=>{
        this.addObject({
            type:"text",
            x:250,
            y:50
        })
    }

    onClickAddCheckbox = async()=>{
        this.addObject({
            type:"checkbox",
            x:250,
            y:50
        })
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
                let img = new Image();
                img.onload = ()=>{
                    this.addObject({
                        type:"img", 
                        data:reader.result,
                        x:250,
                        y:50,
                        width:img.width,
                        height:img.height,
                    })
                };
                img.src = reader.result 
            }
        }
        input.click()
    }

    onClickAddSign = async()=>{
        await new Promise(r=>{ window.openModal("DrawSign",{
                onFinish : (base64)=>{
                    if(base64){
                        this.addObject({
                            type:"img", 
                            data:base64,
                            x:250,
                            y:50,
                            width:300,
                            height:150,
                        })
                    }
                    r();
                }
            })
        })
    }

    onUpdateItem = (i, type, data)=>{
        let _ = `page${this.state.page}`
        if(type == "pos"){
            this.state[_][i].x = data.x
            this.state[_][i].y = data.y
        }else if(type == "text"){
            this.state[_][i].text = data
        }else if(type == "resize"){
            this.state[_][i].width += data.dx
            this.state[_][i].height += data.dy
        }

        this.setState({
            [_]:[...this.state[_]]
        })
    }

    onClickNext = async ()=>{
    }
    
	render() {
		return (<div className="editor-page">
            <div className="back-key">
                <div className="round-btn"><i className="fas fa-arrow-left" /></div>
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
                    <div className="toolkit" onClick={this.onClickAddSign}>
                        <i className="fab fa-asymmetrik" />
                        서명 그리기
                    </div>
                    <div className="toolkit" onClick={this.onClickAddImg}>
                        <i className="fab fa-asymmetrik" />
                        서명,도장 업로드
                    </div>
                    <div className="toolkit" onClick={this.onClickAddLabel}>
                        <i className="fab fa-asymmetrik" />
                        텍스트 입력
                    </div>
                    <div className="toolkit" onClick={this.onClickAddCheckbox}>
                        <i className="fab fa-asymmetrik" />
                        체크박스 추가
                    </div>

                    <div className="line" />

                    <div className="toolkit">
                        <i className="fas fa-search-plus" />
                        확대
                    </div>
                    <div className="toolkit">
                        <i className="fas fa-search-minus" />
                        축소
                    </div>
                </div>
                <div className="edit-box">
                    {(this.state[`page${this.state.page}`] || []).map((e,k)=>{
                        return <Item key={k} {...e} onUpdate={this.onUpdateItem.bind(this, k)}/>
                    })}
                    <img className="edit-target" src={this.state.imgs[this.state.page]} />
                </div>
            </div>

            <div className="confirm-box" onClick={()=>window.openModal("RegistContract",{
                subject:this.props.name,
                pin:this.props.pin,
            })}>
                <i className="fas fa-check" />
                입력 완료
            </div>

		</div>);
	}
}