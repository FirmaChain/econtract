import React from "react"
import ReactDOM from "react-dom"
import {modal} from "./modalmanager"
import SignerSlot from "./signer-slot"

@modal
class AddFolder extends React.Component{

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    render(){
        return <div className="default-modal">
            <div className="contents">
                <div className="title">폴더 추가</div>
                <div className="form-label">폴더 이름</div>
                <div className="form-input">
                    <input type="text" placeholder="폴더이름을 입력해주세요" />
                </div>
            </div>
            <div className="buttons">
                <button onClick={this.closeSelf}>확인</button>
                <button onClick={this.closeSelf}>취소</button>
            </div>
        </div>
    }
}

@modal
class RegistContract extends React.Component{
    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }
    
    render(){
        return <div className="default-modal regist-contract-modal">
            <div className="contents">
                <div className="title">계약 등록</div>
                <div className="form-content">
                    <div>
                        <div className="label">계약명</div>
                        <div className="info">홍길동_근로계약서</div>

                        <div className="label">계약파일</div>
                        <div className="info">test.pdf</div>

                        <div className="label">계약 PIN</div>
                        <div className="info">
                            <div className="pin-box">
                                316783
                            </div>
                        </div>
                        
                        <div className="checkbox">
                            <input type="checkbox" /> PIN 번호 저장하기
                        </div>

                        <div className="desc"> * 해당 PIN번호는 암호화되어 저장되어 본인만 열람이 가능합니다.</div>

                    </div>
                    <div>
                        <div className="label">서명자</div>
                        <SignerSlot />
                        <SignerSlot />
                    </div>
                </div>
            </div>
            <div className="buttons">
                <button onClick={this.closeSelf}>확인</button>
                <button onClick={this.closeSelf}>취소</button>
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

    render(){
        return <div className="default-modal">
            <div className="contents">
                <div className="title">폴더 선택 이동</div>
                
                <div className="select">
                    <select>
                        <option>공문서</option>
                        <option>공문서</option>
                        <option>공문서</option>
                        <option>공문서</option>
                    </select>
                </div>

                <div className="msg"><b>n</b>건의 계약이 선택하신 폴더로 이동합니다.</div>
            </div>
            <div className="buttons">
                <button onClick={this.closeSelf}>확인</button>
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
                <button onClick={this.clickNo}>{this.props.left_btn ||"취소"}</button>
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
            left_btn:right,
            resolve:r
        })
    })
}

let indicator_idx = 0;
window.showIndicator = async (text)=>{
    if(indicator_idx)
        return;

    indicator_idx = await window.openModal("Loading",{
        text:text
    })
}

window.hideIndicator = ()=>{
    window.closeModal(indicator_idx)
    indicator_idx = null
}