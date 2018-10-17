import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import Draggable from 'react-draggable';
import {
    load_contract,
    fetch_user_info,
    get_pin_from_storage,
    edit_contract,
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
        user:state.user.info
	}
}

let mapDispatchToProps = {
    load_contract,
    fetch_user_info,
    get_pin_from_storage,
    edit_contract
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            imgs: [],
            page: 0,
            edit_page:[]
        };
	}

	componentDidMount(){
        (async()=>{
            let contract_id = this.props.match.params.id;
            await window.showIndicator()
            await this.props.fetch_user_info()

            let pin = await this.props.get_pin_from_storage(contract_id)
            if( pin ){
                await this.load_contract(contract_id, pin)
            }else{
                pin = await new Promise(r=>window.openModal("TypingPin",{
                    onFinish:(pin)=>{
                        r(pin)
                    }
                }))
                if( pin == null ){
                    history.goBack();
                }
                await this.load_contract(contract_id, pin)
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

    async load_contract(contract_id, pin){
        let contract = await this.props.load_contract(contract_id,pin)
        if(contract.contract_id){
            this.setState({
                ...contract,
                pin:pin
            })
        }else{
            alert("정상적으로 불러오지 못했습니다.")
        }
    }

    onClickBack = ()=>{
        history.goBack();
    }

    addObject = async(props)=>{
        let edit_page = [...this.state.edit_page]
        edit_page[this.state.page] = [...(edit_page[this.state.page]||[]), props]

        this.setState({
            edit_page: edit_page
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
        let edit_page = [...this.state.edit_page]
        if(type == "pos"){
            edit_page[this.state.page][i].x = data.x
            edit_page[this.state.page][i].y = data.y
        }else if(type == "text"){
            edit_page[this.state.page][i].text = data
        }else if(type == "resize"){
            edit_page[this.state.page][i].width += data.dx
            edit_page[this.state.page][i].height += data.dy
        }

        this.setState({
            edit_page:edit_page
        })
    }

    onClickNext = async ()=>{
    }

    onClickFinishEdit = ()=>{
        if(_confirm("정말로 현재 상태로 계약서를 발행하시겠습니까?")){
            window.openModal("RegistContract",{
                subject:this.state.name,
                pin:this.state.pin,
                account_id: this.state.account_id,
                counterparties: this.state.counterparties,
                login_user_code:this.props.user.code,
                author:{
                    name:this.state.author_name,
                    code:this.state.author_code,
                    eth_address:this.state.author_eth_address,
                },
                onOK:async()=>{
                    await window.showIndicator()
                    let resp = await this.props.edit_contract(this.state.contract_id, this.state.pin, window.clone_object(this.state.edit_page))
                    if(resp){
                        alert("성공적으로 저장했습니다.")
                        history.replace("/recently")
                    }else{
                        alert("저장에 문제가 발생했습니다.")
                    }
                    await window.hideIndicator()
                }
            })
        }
    }
    
	render() {
		return (<div className="editor-page">
            <div className="back-key">
                <div className="round-btn" onClick={this.onClickBack}><i className="fas fa-arrow-left" /></div>
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
                    {(this.state.edit_page[this.state.page] || []).map((e,k)=>{
                        return <Item key={k} {...e} onUpdate={this.onUpdateItem.bind(this, k)}/>
                    })}
                    <img className="edit-target" src={this.state.imgs[this.state.page]} />
                </div>
            </div>

            <div className="confirm-box" onClick={this.onClickFinishEdit}>
                <i className="fas fa-check" />
                입력 완료
            </div>

		</div>);
	}
}