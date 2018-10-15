// ### WARNING ###
// THIS FILE IS AUTO GENERATED!!
// DO NOT MODIFIY THIS FILE DIRECTLY!!
// ### WARNING ###

import {post, get} from './Network.js';

export async function api_new_contract(subject,imgs,counterparties){
    let data = new FormData();

    data.append('subject', subject);
	for(let k in imgs){
        data.append('imgs:'+k,imgs[k])
    }
    data.append('imgs',imgs.length);
	for(let k in counterparties){
        data.append('counterparties:'+k,counterparties[k])
    }
    data.append('counterparties',counterparties.length)

    return await post("/new_contract", data,{
        session:window.getCookie("session")
    });
}
export async function api_test(){
    return await get("/test", {
        
    },{
        session:window.getCookie("session")
    });
}
export async function api_request_email_verification(email){
    return await get("/request_email_verification", {
        email
    },{
        session:window.getCookie("session")
    });
}
export async function api_check_email_verification_code(email,code){
    return await get("/check_email_verification_code", {
        email,
		code
    },{
        session:window.getCookie("session")
    });
}
export async function api_request_phone_verification_code(phone){
    return await get("/request_phone_verification_code", {
        phone
    },{
        session:window.getCookie("session")
    });
}
export async function api_check_phone_verification_code(phone,code){
    return await get("/check_phone_verification_code", {
        phone,
		code
    },{
        session:window.getCookie("session")
    });
}
export async function api_regist_account(publicbk,publicms,info,auth,eems,email,name,eth){
    return await get("/regist_account", {
        publicbk,
		publicms,
		info,
		auth,
		eems,
		email,
		name,
		eth
    },{
        session:window.getCookie("session")
    });
}
export async function api_login_account(publicbk,nonce,sign){
    return await get("/login_account", {
        publicbk,
		nonce,
		sign
    },{
        session:window.getCookie("session")
    });
}
export async function api_encrypted_user_info(){
    return await get("/encrypted_user_info", {
        
    },{
        session:window.getCookie("session")
    });
}
export async function api_find_user_with_code(code){
    return await get("/find_user_with_code", {
        code
    },{
        session:window.getCookie("session")
    });
}