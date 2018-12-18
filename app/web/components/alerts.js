import React from "react"
import ReactDOM from "react-dom"
import {modal} from "./modalmanager"
import SignerSlot from "./signer-slot"
import history from '../history';
import translate from "../../common/translate"

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
class AddCommonModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text:""
        }
    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    onConfirm = () => {
        this.props.onConfirm && this.props.onConfirm(this.state.text)
        this.closeSelf()
    }

    render() {
        return <div className="add-common-modal">
            <div className="container">
                <div className="icon"><i className={this.props.icon}></i></div>
                <div className="title">{this.props.title}</div>
                <div className="text-box">
                    <div className="sub-title">{this.props.subTitle}</div>
                    <input type="text" className="common-textbox"
                        onChange={(e)=>this.setState({text:e.target.value})}
                        value={this.state.text}
                        placeholder={this.props.placeholder}/>
                </div>
                <div className="button">
                    <div className="confirm" onClick={this.onConfirm}>{this.props.confirmText || "생성"}</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class RemoveCommonModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    onConfirm = () => {
        this.props.onDelete && this.props.onDelete()
        this.closeSelf()
    }

    render() {
        return <div className="remove-common-modal">
            <div className="container">
                <div className="icon"><i className={this.props.icon}></i></div>
                <div className="title">{this.props.title}</div>
                <div className="sub-title" dangerouslySetInnerHTML={{__html:this.props.subTitle}}>
                </div>
                <div className="button">
                    <div className="confirm" onClick={this.onDelete}>{this.props.deleteText || "삭제"}</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class CommonModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    render() {
        return <div className="common-modal">
            <div className="container">
                <div className="data">
                    <div className="icon"><i className={this.props.icon}></i></div>
                    <div className="desc-container">
                        <div className="place">
                            <div className="title">{this.props.title}</div>
                            <div className="sub-title">{this.props.subTitle}</div>
                        </div>
                        <div className="desc" dangerouslySetInnerHTML={{__html:this.props.desc}}>
                        </div>
                    </div>
                </div>
                <div className="button">
                    <div onClick={this.closeSelf}>확인</div>
                </div>
            </div>
        </div>
    }
}

@modal
class StartContract extends React.Component{
    constructor(){
        super()
        this.state = {}
    }
    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClick = (type)=>{

        this.props.onClick && this.props.onClick( type )
        this.closeSelf()
    }

    render(){
        return <div className="start-contract-modal">
            <div className="container">
                <div className="icon"><i className="fal fa-file-code"></i></div>
                <div className="title">시작하기</div>
                <div className="btn-container">
                    <div className="btn" onClick={this.onClick.bind(this, 1)}>
                        <i className="fal fa-comment-alt-edit"></i>
                        <div className="btn-desc">
                            <div className="title">웹 에디터 사용하기</div>
                            <div className="sub">계약 내용을 직접 추가하고 수정할 수 있습니다.<br/>내용이 확정되면 서명 또는 도장을 추가하여 작업을 완료할 수 있습니다.</div>
                        </div>
                    </div>
                    <div className="btn" onClick={this.onClick.bind(this, 2)}>
                        <i className="fal fa-paste"></i>
                        <div className="btn-desc">
                            <div className="title">템플릿 사용하기</div>
                            <div className="sub">기존에 생성한 템플릿을 바로 사용하실 수 있습니다.<br/>기존 내용을 수정하거나 서명 또는 도장을 추가할 수 있습니다.</div>
                        </div>
                    </div>
                </div>
                <div className="cancel" onClick={this.closeSelf}>취소</div>
            </div>
        </div>
    }
}

@modal
class BrowserNotVerified extends React.Component{
    constructor(){
        super()
        this.state = {}
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    render(){
        return <div className="browser-not-verified-modal">
            <div className="container">
                <div className="icon"><i className="fal fa-browser"></i></div>
                <div className="title">브라우저 미인증이란?</div>
                <div className="sub-title">E-Contract 서비스는 회원가입시 발급되는 마스터 키워드를 기반으로 로그인 하실 수 있습니다.</div>
                <div className="desc-container">
                    <div className="place">
                        <i className="fal fa-sign-in"></i>
                        <div className="title">회원가입</div>
                        <div className="sub">전자 계약 진행시 신원을 확인 할 수 있는 정보를 입력하여 가입합니다.</div>
                    </div>
                    <div className="place">
                        <i className="fal fa-key"></i>
                        <div className="title">마스터 키워드 발급</div>
                        <div className="sub">발급받은 마스터 키워드는 접속하고 있는 브라우저에 자동으로 저장됩니다.</div>
                    </div>
                    <div className="place">
                        <i className="fal fa-money-check"></i>
                        <div className="title">마스터 키워드 인증</div>
                        <div className="sub">서비스에 접속시 브라우저에 저장된 마스터 키워드를 기반으로 인증이 진행되며, 가입시 입력한 이메일과 비밀번호로 로그인이 가능합니다</div>
                    </div>
                </div>
                <div className="button">
                    <div onClick={this.closeSelf}>확인</div>
                </div>
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
        return <div className="default-modal register-contract-modal">
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

@modal
class RefreshSession extends React.Component{
    constructor(){
        super()
        this.state = {}
    }
    componentDidMount(){
        this.interval = setInterval(this.update, 1000)
        this.update()
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    digit = (o)=>{
        o = o.toString()
        if(o.length == 1){
            return "0"+o
        }
        return o
    }

    update = ()=>{
        let t = window.getCookie("session_update");
        if(t){
            let day = 60 * 60 * 3;

            let left_time = day - ((Date.now()-t)/1000);
            let left_hour = Math.floor(left_time/60/60)
            let left_min = Math.floor(left_time/60%60)
            let left_sec = Math.floor(left_time%60)

            this.setState({
                hour:this.digit(left_hour),
                min:this.digit(left_min),
                sec:this.digit(left_sec),
            })
        }
    }

    onClickRenewal= ()=>{
        let session = window.getCookie("session");
        if(session){
            window.setCookie("session", session, 0.125)
            window.setCookie("session_update", Date.now(), 0.125)
        }

        window.closeModal(this.props.modalId)
        this.props.onClose && this.props.onClose()
    }
    
    onClickLogout = ()=>{
        window.eraseCookie("session")
        window.eraseCookie("session_update")
        
        location.reload(true)
    }

    render(){
        try{
            return <div className="default-modal session-expired-warning-modal">
                <div className="title">
                    세션이 {this.state.hour}시간 {this.state.min}분 {this.state.sec}초 후 만료됩니다.
                </div>
                <div className="content">
                    세션 만료 후에는 재로그인을 해야합니다.<br />
                    세션 만료를 연장하시겠습니까?
                </div>
                <div className="btns">
                    <button onClick={this.onClickRenewal}>연장</button>
                    <button onClick={this.onClickLogout}>로그아웃</button>
                </div>
            </div>
        }catch(err){
            return <div />
        }
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

let refesh_modal_idx = null
setInterval(()=>{
    let t = window.getCookie("session_update");
    if(t){
        let day = 60 * 60 * 3;

        let left_time = day - ((Date.now()-t)/1000);

        if(left_time < 0){
            window.eraseCookie("session")
            window.eraseCookie("session_update")
            
            location.reload(true)
        }

        if(left_time < 60 * 5 && !refesh_modal_idx){
            refesh_modal_idx = window.openModal("RefreshSession",{
                onClose:()=>{
                    refesh_modal_idx = null
                }

            })
        }
    }else{
        let exclude = [
            "/",
            '/login',
            '/register',
            '/recover'
        ]
        if( exclude.indexOf(location.pathname) == -1 ){
            location.href="/"
        }
    }
},1000)
