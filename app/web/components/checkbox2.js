import React from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom";

export default function(props){
    return (<div className="checkbox2-comp">
    	<div className={"checkbox" + (!!props.disabled ? " disabled" : "")} style={{width:props.size ? (props.size+"px") : "15px", height:props.size ? (props.size+"px") : "15px"}}
    		onClick={()=>{
    			if(!!props.disabled)
    				return;
    			props.onClick && props.onClick(!props.on)
    		}}>
        	{props.on ? <i className="fas fa-check" style={{fontSize:props.size ? (props.size*2/3 + "px") : "12px"}}></i> : null}
        </div>
        { !!props.text ? <div className="check-label">{props.text}</div> : null }
    </div>)
}