import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import Draggable from 'react-draggable';
import Resizable from "re-resizable";
import {
    load_contract,
    fetch_user_info,
    get_pin_from_storage,
    edit_contract,
    send_chat,
    fetch_chat
} from "../../common/actions"
import Chatting from "./chatting"

@connect((state)=>{return {user:state.user.info}}, {} )
class Item extends React.Component{
    content(isMine){
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
                    width:"100%",
                    height:"100%"
                }} />
            </div>
        }
    }

    render(){
        let props = this.props
        let isMine = props.editable == true && (props.code == null || props.code == this.props.user.code)
        return <Draggable handle=".handle" defaultPosition={{x:props.x,y:props.y}} onStop={(e,n)=>props.onUpdate("pos", {x:n.x, y:n.y})} >
            <Resizable 
                style={{position:"absolute"}} 
                defaultSize={{ width: props.width, height: props.height }}
                onResizeStop={(e, direction, ref, d) => {
                    props.onUpdate("resize",{ dx:ref.clientWidth, dy:ref.clientHeight, })
                }}
                onResizeStart={(e, direction, ref, d) => {
                    props.onUpdate("resize",{ dx:ref.clientWidth, dy:ref.clientHeight, })
                }}
            >
                <div className="draggable-div">
                    {isMine ? <div className="handle"><i className="fas fa-arrows-alt" /></div> : null }
                    {props.name ? <div className="name-container">{props.name}</div> : null}
                    {isMine ? <div className="trash" onClick={this.props.removeItem}><i className="fas fa-trash" /></div> : null }
                    {this.content(isMine)}
                </div>
            </Resizable>
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
    edit_contract,
    send_chat,
    fetch_chat
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
        this.blockFlag = true;
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
                while(1){
                    try{
                        pin = await new Promise(r=>window.openModal("TypingPin",{
                            onFinish:(pin)=>{
                                r(pin)
                            }
                        }))
                        if( pin == null ){
                            history.goBack();
                        }
                        await this.load_contract(contract_id, pin)
                        break;
                    }catch(err){
                        alert("PIN 번호가 잘못되었습니다.")
                    }
                }
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

    unblockFunction = async() => {
        this.blockFlag = false;
    }

    componentWillUnmount(){
        if(this.blockFlag) {
            //this.unblock();
        }
    }

    async load_contract(contract_id, pin){
        let contract = await this.props.load_contract(contract_id,pin)
        if(contract.contract_id){

            let objects = []
            for(let k in contract.html){
                objects[k] = (objects[k] || []).concat(contract.html[k])
            }
            for(let c of contract.counterparties){
                for(let k in c.html || []){
                    objects[k] = (objects[k] || []).concat(c.html[k])
                }
            }
            this.setState({
                ...contract,
                pin:pin,
                edit_page:objects,
            })

            if(contract.status == 2)
                this.unblock()
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

    onRemoveItem = async(i)=>{
        if(await confirm("정말로 삭제하시겠습니까?")){
            let edit_page = [...this.state.edit_page]
            edit_page[this.state.page].splice(i,1)
            this.setState({
                edit_page:edit_page
            })
        }
    }
        
    onUpdateItem = (i, type, data)=>{
        let edit_page = [...this.state.edit_page]
        if(type == "pos"){
            edit_page[this.state.page][i].x = data.x
            edit_page[this.state.page][i].y = data.y
        }else if(type == "text"){
            edit_page[this.state.page][i].text = data
        }else if(type == "resize"){
            edit_page[this.state.page][i].width = data.dx
            edit_page[this.state.page][i].height = data.dy
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
                        this.unblock()
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

    onClickRefresh = async()=>{
        if(await confirm("초기화","수정사항을 저장하지 않고 모두 되돌리겠습니까?")){
            location.reload()
        }
    }

    onClickSave = async()=>{
        if(await confirm("저장","계약서를 수정사항을 적용하시겠습니까?")){
            let myObject = this.state.edit_page.map(e=>{
                return e.filter(o=>{
                    return o.code == null || o.code == this.props.user.code
                })
            })

            await window.showIndicator()
            let resp = await this.props.edit_contract(this.state.contract_id, this.state.pin, window.clone_object(myObject))
            await window.hideIndicator();

            if(resp){
                alert("성공적으로 저장하였습니다.")
            }else{
                alert("저장하는데 문제가 발생했습니다. 관리자에게 문의해주세요.")
            }
        }
    }

    render_finish_button(){
        if(this.state.status == 0)
            return <div className="confirm-box" onClick={this.onClickFinishEdit}>
                <i className="fas fa-check" />
                입력 완료
            </div>
        return <Chatting 
            contract_id={this.state.contract_id} 
            author={{
                name: this.state.author_name,
                code: this.state.author_code,
                account_id: this.state.account_id,
                confirm:this.state.author_confirm,
            }} 
            counterparties={this.state.counterparties}
            contract_name={this.state.name}
            contract_status={this.state.status} 
            unblockFunction={this.unblockFunction}/>
    }

    render_save_recover_btn(){
        if(this.state.status == 1){
            return [
                <div key={0} className="line" />,
                <div key={1} className="toolkit" onClick={this.onClickRefresh}>
                    <i className="fas fa-undo"></i>
                    초기화
                </div>,
                <div key={2} className="toolkit" onClick={this.onClickSave}>
                    <i className="fas fa-save"></i>
                    저장
                </div>
            ]
        }
    }
    
	render() {
        if(this.state.pin == null)
            return <div className="default-page"><div className="container">{/*<h1>로딩중..</h1>*/}</div></div>

        let objects = this.state.edit_page[this.state.page] || [];
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
                {this.state.status <= 1 ? <div className="header-toolkit">
                    {this.state.status == 1 ?[
                        <div key={0} className="toolkit" onClick={this.onClickAddSign}>
                            <i className="fab fa-asymmetrik" />
                            서명 그리기
                        </div>,
                        <div key={1} className="toolkit" onClick={this.onClickAddImg}>
                            <i className="fab fa-asymmetrik" />
                            서명,도장 업로드
                        </div>
                    ] : null}

                    <div className="toolkit" onClick={this.onClickAddImg}>
                        <i className="fab fa-asymmetrik" />
                        이미지 업로드
                    </div>

                    <div className="toolkit" onClick={this.onClickAddLabel}>
                        <i className="fab fa-asymmetrik" />
                        텍스트 입력
                    </div>
                    {/*<div className="toolkit" onClick={this.onClickAddCheckbox}>
                        <i className="fab fa-asymmetrik" />
                        체크박스 추가
                    </div>*/}
                    {this.state.status == 0 ? <div style={{flex:1}} /> : null }
                    
                    {this.render_save_recover_btn()}
                    
                </div> : null}
                <div className="edit-box">
                    {(objects).map((e,k)=>{
                        return <Item key={`${k}:${e.type}:${e.x}:${e.y}`} {...e} 
                            onUpdate={this.onUpdateItem.bind(this, k)}
                            removeItem={this.onRemoveItem.bind(this, k)}
                            editable={this.state.status < 2}
                        />
                    })}
                    <img className="edit-target" src={this.state.imgs[this.state.page]} />
                </div>
            </div>
            
            {this.render_finish_button()}
		</div>);
	}
}