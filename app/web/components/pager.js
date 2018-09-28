import React from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom";

let display_count = 6;

function render_left_btn(cur, onClick){
    if(cur-1 > display_count/2){
        return <li className="slot chevron" onClick={()=>{onClick(Math.max(0,cur-display_count))}}> <i className="fas fa-chevron-left" /> </li>
    }
    return <li></li>
}

function render_right_btn(cur, max, onClick){
    if( max - display_count/2 > cur){
        return <li className="slot chevron" onClick={()=>{onClick(Math.min(max,cur+display_count))}}> <i className="fas fa-chevron-right" /> </li>
    }
    return <li></li>
}

function render_li(cur, max, onClick){
    let list = []
    let start = cur-display_count/2;
    start = start < 1 ? 1 : start
    
    let target = Math.min(max , start + display_count)
    start = target - display_count

    for(let i=start; i < target; i++ ){
        list.push(<li 
            key={i}
            className={cur == i ? `slot active` : `slot`} 
            onClick={()=>{onClick(i)}}
        >{i}</li>)
    }
    return list
}

export default function(props){
    let onClick = props.onClick;
    let max = props.max || 1
    let cur = props.cur || 1
    return (<div className="pager-comp">
        <ul>
            {render_left_btn(cur, onClick)}
            
            {render_li(cur, max, onClick)}

            {render_right_btn(cur, max, onClick)}
        </ul>
    </div>)
}