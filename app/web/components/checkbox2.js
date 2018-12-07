import React from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom";

export default function(props){
    return (<div className="checkbox2-comp"
    		style={{width:props.size ? (props.size+"px") : "15px", height:props.size ? (props.size+"px") : "15px"}}
    		onClick={()=>{props.onClick && props.onClick(!props.on)}}>
        {props.on ? <i className="fas fa-check" style={{fontSize:props.size ? (props.size*2/3 + "px") : "14px"}}></i> : null}
    </div>)
}