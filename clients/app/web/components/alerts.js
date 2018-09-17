import React from "react"
import ReactDOM from "react-dom"
import {modal} from "./modalmanager"

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
class Alert extends React.Component{

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

window._alert = window.alert;
window.alert = (title, msg, left, right)=>{
    return new Promise(r=>{
        window.openModal("Alert",{
            title:title, 
            msg:msg, 
            left_btn:left, 
            left_btn:right,
            resolve:r
        })
    })
}
