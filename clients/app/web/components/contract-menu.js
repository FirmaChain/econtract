import React from "react"
import ReactDOM from "react-dom"

export default function(){
    return (<div className="column-200 display-flex">
        <ul className="left-menu">
            <li className="item selected">
                <i className="fas fa-plus-circle" /> 최근 사용
            </li>
            <li className="item">
                <i className="fas fa-folder" /> 폴더순으로
            </li>
            <li className="spacer" />
            <li className="item">
                <i className="fas fa-file-alt" /> 내 템플릿
            </li>
        </ul>
    </div>)
}