import React from "react"
import ReactDOM from "react-dom"
import {modal} from "./modalmanager"
import SignerSlot from "./signer-slot"
import history from '../history';

@modal
class AddFolder extends React.Component{
    constructor(){
        super()
        this.state = {}
    }
    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClick = ()=>{
        if(!this.state.name)
            return alert("폴더 이름을 입력해주세요!")

        this.props.onClick && this.props.onClick( this.state.name )
        this.closeSelf()
    }

    render(){
        return <div className="default-modal">
            <div className="contents">
                <div className="title">폴더 추가</div>
                <div className="form-label">폴더 이름</div>
                <div className="form-input">
                    <input type="text" placeholder="폴더이름을 입력해주세요" value={this.state.name || ""} onChange={e=>this.setState({name:e.target.value})} />
                </div>
            </div>
            <div className="buttons">
                <button onClick={this.onClick}>확인</button>
                <button onClick={this.closeSelf}>취소</button>
            </div>
        </div>
    }
}

@modal
class RegistContract extends React.Component{

    constructor() {
        super()
        this.state = {
            isPinSaved : false
        }
    }

    componentDidMount() {
        this.setState({
            isPinSaved: this.props.is_pin_saved
        })
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClickOK = ()=>{
        this.state.isPinSaved ? this.props.updatePIN() : this.props.clearPIN()
        this.props.onOK && this.props.onOK()
        this.closeSelf()
    }

    pinCheckChange = (e) => {
        this.setState({
            isPinSaved: e.target.checked
        });
    }

    render(){
        let author = this.props.author
        let user_code = this.props.login_user_code
        return <div className="default-modal regist-contract-modal">
            <div className="contents">
                <div className="title">계약 등록</div>
                <div className="form-content">
                    <div>
                        <div className="label">계약명</div>
                        <div className="info">{this.props.subject}</div>

                        <div className="label">계약 PIN</div>
                        <div className="info">
                            <div className="pin-box">
                                {this.props.pin}
                            </div>
                        </div>
                        
                        <div className="checkbox">
                            <input
                                type="checkbox" 
                                onChange={this.pinCheckChange}
                                defaultChecked={this.props.is_pin_saved}/> PIN 번호 저장하기
                        </div>

                        <div className="desc"> * 해당 PIN번호는 암호화되어 저장되어 본인만 열람이 가능합니다.</div>
                    </div>
                    <div>
                        <div className="label">서명자</div>
                        <SignerSlot me={user_code == author.code} code={author.code} name={author.name} eth_address={author.eth_address}  />
                        {this.props.counterparties.map((e,k)=>{
                            return <SignerSlot 
                                key={k}
                                me={user_code == e.code} 
                                code={e.code}
                                name={e.name}
                                eth_address={e.eth_address}  />
                        })}
                        
                    </div>
                </div>
            </div>
            <div className="buttons">
                <button onClick={this.onClickOK}>확인</button>
                <button onClick={this.closeSelf}>취소</button>
            </div>
        </div>
    }
}

@modal
class TypingPin extends React.Component{
    constructor(){
        super()
        this.state = { 
            value : "",
            isPinSaved : false
        }
    }
    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClickOK = ()=>{
        if(this.state.value.length == 6){

            if(this.state.isPinSaved){
                this.props.updatePIN(this.state.value);
            }

            this.props.onFinish && this.props.onFinish(this.state.value, this.state.isPinSaved)
            this.closeSelf()
        } else {
            alert("핀번호는 6자리입니다. 정확히 입력해주세요.")
        }
    }

    onClickCancel = () => {
        this.closeSelf()
        window.hideIndicator()
        history.goBack()
    }

    keydown = (e)=>{
        if(e.key == "Backspace") {
            this.setState({
                value: this.state.value.slice(0,this.state.value.length-1)
            })
        } else if(e.key == "Enter" || e.keyCode == 13) {
            this.onClickOK()
        }
        let key = Number(e.key)
        if( 0 <= key && key <= 9 ){
            if(this.state.value.length < 6){
                this.setState({
                    value: this.state.value + "" + key
                })
            }
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.keydown);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keydown);
    }

    pinCheckChange = (e) => {
        this.setState({
            isPinSaved: e.target.checked
        });
    }

    render(){
        return <div className="default-modal type-pin-modal">
            <div className="contents">
                <div className="title">PIN을 입력해주세요</div>
                <div className="pin-box">
                    {this.state.value}
                </div>
                <div className="checkbox">
                    <input
                        type="checkbox"
                        onChange={this.pinCheckChange}
                        defaultChecked={this.state.isPinSaved}/> PIN 번호 저장하기
                </div>
            </div>
            <div className="buttons">
                <button onClick={this.onClickCancel}>취소</button>
                <button onClick={this.onClickOK}>확인</button>
            </div>
        </div>
    }
}

@modal
class DrawSign extends React.Component{
    componentDidMount(){
    }

    finishDraw = ()=>{
        this.props.onFinish(this.refs.canvas.toDataURL("image/png"))
        window.closeModal(this.props.modalId)
    }

    closeSelf = ()=>{
        this.props.onFinish(null)
        window.closeModal(this.props.modalId)
    }
    
    onmousedown = (e)=>{
        let ctx = this.refs.canvas.getContext('2d');

        this.isDrawing = true;
        ctx.moveTo(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
    }

    onmousemove = (e)=>{
        let ctx = this.refs.canvas.getContext('2d');
        if (this.isDrawing) {
            ctx.lineTo(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
            ctx.stroke();
        }
    }

    onmouseup = ()=>{
        this.isDrawing = false;
    }

    render(){
        return <div className="default-modal draw-sign-modal">
            <div className="contents">
                <div className="title">서명 그리기</div>
                
                <canvas ref="canvas" 
                    onMouseDown={this.onmousedown} 
                    onMouseMove={this.onmousemove}
                    onMouseUp={this.onmouseup} />
            </div>
            <div className="buttons">
                <button onClick={this.finishDraw}>완료</button>
                <button onClick={this.closeSelf}>취소</button>
            </div>
        </div>
    }
}

@modal
class MoveToFolder extends React.Component{

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClickMove = ()=>{
        let folder_id = this.refs.sel.value
        
        this.props.onClickMove && this.props.onClickMove(folder_id)
        this.closeSelf()
    }

    render(){
        return <div className="default-modal">
            <div className="contents">
                <div className="title">폴더 선택 이동</div>
                
                <div className="select">
                    <select ref="sel">
                        {this.props.list.map((e,k)=>{
                            return <option key={k} value={e.folder_id}>{e.subject}</option>
                        })}
                    </select>
                </div>

                <div className="msg"><b>{this.props.move_select.length}</b>건의 계약이 선택하신 폴더로 이동합니다.</div>
            </div>
            <div className="buttons">
                <button onClick={this.onClickMove}>확인</button>
                <button onClick={this.closeSelf}>취소</button>
            </div>
        </div>
    }
}

@modal
class Loading extends React.Component{
    render(){
        return <div style={{color:"#fff",textAlign:"center"}}>
            <div className="loader"></div>
            <div style={{marginTop:"20px"}}>{this.props.text || "로딩 중"}</div>
        </div>
    }
}

@modal
class Confirm extends React.Component{

    clickOk = ()=>{
        this.props.resolve && this.props.resolve(true)
        this.closeSelf();
    }

    clickNo = ()=>{
        this.props.resolve && this.props.resolve(false)
        this.closeSelf();
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    render(){
        return <div className="default-modal">
            <div className="contents">
                <div className="title">{this.props.title || "타이틀"}</div>
                <div className="msg">{this.props.msg || "메세지"}</div>
            </div>
            <div className="buttons">
                <button onClick={this.clickOk}>{this.props.left_btn ||"확인"}</button>
                <button onClick={this.clickNo}>{this.props.right_btn ||"취소"}</button>
            </div>
        </div>
    }
}

window._confirm = window.confirm;
window.confirm = (title, msg, left, right)=>{
    return new Promise(r=>{
        window.openModal("Confirm",{
            title:title, 
            msg:msg, 
            left_btn:left, 
            right_btn:right,
            resolve:r
        })
    })
}

let indicator_idx = 0;
window.showIndicator = async (text)=>{
    if(indicator_idx)
        if(await window.updateModal(indicator_idx, {text}))
            return ;

    indicator_idx = await window.openModal("Loading",{
        text:text
    })
}

window.hideIndicator = ()=>{
    window.closeModal(indicator_idx)
    indicator_idx = null
}


setInterval(()=>{
    let t = window.getCookie("session_update");
    if(t){
        let day = 60 * 60 * 3;

        let left_time = day - ((Date.now()-t)/1000);
        let left_hour = Math.floor(left_time/60/60)
        let left_min = Math.floor(left_time/60%60)
    }
})