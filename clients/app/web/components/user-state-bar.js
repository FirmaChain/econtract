import React from "react"
import ReactDOM from "react-dom"

export default function(){
    return (<div className="user-state-bar">
        <div className="searchbar">
            <i className="fas fa-search" />
            <input type="text" placeholder="검색어를 입력해주세요" />
        </div>

        <div className="login-time-bar">
            <div>로그인</div>
            <div>05:00</div>
            <div>연장</div>
        </div>

        <div className="profile">
            <div className="info">
                <div className="top">윤대현의 초대코드</div>
                <div className="bottom">ㅉㅉㅈ</div>
            </div>
            <div className="pic"></div>
        </div>

        <div className="add-button">
            + 계약 등록
        </div>
    </div>)
}