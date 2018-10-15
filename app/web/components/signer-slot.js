import React from "react";

export default function(props){
    return (<div className="signer-slot-comp">
        {props.onDelete ? <div className="delete-btn" onClick={()=>{
            props.onDelete(props.code)
        }}>삭제</div> : null }
        <div className="info">
            <div className="profile" style={{backgroundImage:`url(https://identicon-api.herokuapp.com/${props.code}/70?format=png)`}} />
            <div className="info-text">
                <div className="name">
                    {props.name} {props.onDelete ? null : <div className="gray">(본인)</div> }
                </div>
                <div className="email">{props.email}</div>
                <div className="account">{props.eth_address}</div>
            </div>
        </div>
    </div>)
}