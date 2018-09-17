import React from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom";

export default function(props){
    return (<div className="checkbox2-comp" onClick={()=>{props.onClick && props.onClick(!props.on)}}>
        {props.on ? <i className="fas fa-check"></i> : null}
    </div>)
}