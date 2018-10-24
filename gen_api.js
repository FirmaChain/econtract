// ### WARNING ###
// THIS FILE IS AUTO GENERATED!!
// DO NOT MODIFIY THIS FILE DIRECTLY!!
// ### WARNING ###

import {post, get} from './Network.js';

export async function api_new_contract(subject,imgs,counterparties,counterparties_eckai){
    let data = new FormData();

    data.append('subject', subject);
	for(let k in imgs){
        data.append('imgs:'+k,imgs[k])
    }
    data.append('imgs',imgs.length);
	for(let k in counterparties){
        data.append('counterparties:'+k,counterparties[k])
    }
    data.append('counterparties',counterparties.length);
	for(let k in counterparties_eckai){
        data.append('counterparties_eckai:'+k,counterparties_eckai[k])
    }
    data.append('counterparties_eckai',counterparties_eckai.length)

    return await post("/new_contract", data,{
        session:window.getCookie("session")
    });
}
export async function api_update_epin(contract_id,epin){
    let data = new FormData();

    data.append('contract_id', contract_id);
	data.append('epin', epin)

    return await post("/update_epin", data,{
        session:window.getCookie("session")
    });
}
export async function api_load_contract_info(contract_id){
    return await get("/load_contract_info", {
        contract_id
    },{
        session:window.getCookie("session")
    });
}
export async function api_load_contract(contract_id){
    return await get("/load_contract", {
        contract_id
    },{
        session:window.getCookie("session")
    });
}
export async function api_recently_contracts(page){
    return await get("/recently_contracts", {
        page
    },{
        session:window.getCookie("session")
    });
}
export async function api_all_folders(page){
    return await get("/all_folders", {
        page
    },{
        session:window.getCookie("session")
    });
}
export async function api_folder_list(page){
    return await get("/folder_list", {
        page
    },{
        session:window.getCookie("session")
    });
}
export async function api_new_folder(name){
    return await get("/new_folder", {
        name
    },{
        session:window.getCookie("session")
    });
}
export async function api_remove_folder(idx){
    let data = new FormData();

    for(let k in idx){
        data.append('idx:'+k,idx[k])
    }
    data.append('idx',idx.length)

    return await post("/remove_folder", data,{
        session:window.getCookie("session")
    });
}
export async function api_move_to_folder(folder_id,contract_ids){
    let data = new FormData();

    data.append('folder_id', folder_id);
	for(let k in contract_ids){
        data.append('contract_ids:'+k,contract_ids[k])
    }
    data.append('contract_ids',contract_ids.length)

    return await post("/move_to_folder", data,{
        session:window.getCookie("session")
    });
}
export async function api_folder_in_contracts(folder_id,page){
    return await get("/folder_in_contracts", {
        folder_id,
		page
    },{
        session:window.getCookie("session")
    });
}
export async function api_edit_contract(contract_id,encrypt_data,edit){
    let data = new FormData();

    data.append('contract_id', contract_id);
	for(let k in encrypt_data){
        data.append('encrypt_data:'+k,encrypt_data[k])
    }
    data.append('encrypt_data',encrypt_data.length);
	data.append('edit', edit)

    return await post("/edit_contract", data,{
        session:window.getCookie("session")
    });
}
export async function api_send_chat(contract_id,msg){
    let data = new FormData();

    data.append('contract_id', contract_id);
	data.append('msg', msg)

    return await post("/send_chat", data,{
        session:window.getCookie("session")
    });
}
export async function api_fetch_chat(contract_id,cursor){
    let data = new FormData();

    data.append('contract_id', contract_id);
	data.append('cursor', cursor)

    return await post("/fetch_chat", data,{
        session:window.getCookie("session")
    });
}
export async function api_confirm_contract(contract_id){
    let data = new FormData();

    data.append('contract_id', contract_id)

    return await post("/confirm_contract", data,{
        session:window.getCookie("session")
    });
}
export async function api_reject_contract(contract_id,msg){
    let data = new FormData();

    data.append('contract_id', contract_id);
	data.append('msg', msg)

    return await post("/reject_contract", data,{
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
export async function api_regist_account(publicbk,publicms,publicmsc,info,auth,eems,email,name,eth){
    return await get("/regist_account", {
        publicbk,
		publicms,
		publicmsc,
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
export async function api_check_join_browser(publicbk){
    return await get("/check_join_browser", {
        publicbk
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