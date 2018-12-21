// ### WARNING ###
// THIS FILE IS AUTO GENERATED!!
// DO NOT MODIFIY THIS FILE DIRECTLY!!
// ### WARNING ###

import {post, get} from './Network.js';

export async function api_convert_doc(file){
    let __data = new FormData();

    __data.append('file', file)

    return await post("/convert_doc", __data,{
        session:window.getCookie("session")
    });
}
export async function api_new_contract(subject,counterparties,counterparties_eckai){
    let __data = new FormData();

    __data.append('subject', subject);
	for(let k in counterparties){
        __data.append('counterparties:'+k,counterparties[k])
    }
    __data.append('counterparties',counterparties.length);
	for(let k in counterparties_eckai){
        __data.append('counterparties_eckai:'+k,counterparties_eckai[k])
    }
    __data.append('counterparties_eckai',counterparties_eckai.length)

    return await post("/new_contract", __data,{
        session:window.getCookie("session")
    });
}
export async function api_update_epin(contract_id,epin){
    let __data = new FormData();

    __data.append('contract_id', contract_id);
	__data.append('epin', epin)

    return await post("/update_epin", __data,{
        session:window.getCookie("session")
    });
}
export async function api_clear_epin(contract_id){
    let __data = new FormData();

    __data.append('contract_id', contract_id)

    return await post("/clear_epin", __data,{
        session:window.getCookie("session")
    });
}
export async function api_load_contract_info(contract_id){
    let __data = new FormData();

    __data.append('contract_id', contract_id)

    return await post("/load_contract_info", __data,{
        session:window.getCookie("session")
    });
}
export async function api_load_contract(contract_id){
    let __data = new FormData();

    __data.append('contract_id', contract_id)

    return await post("/load_contract", __data,{
        session:window.getCookie("session")
    });
}
export async function api_recently_contracts(page){
    let __data = new FormData();

    __data.append('page', page)

    return await post("/recently_contracts", __data,{
        session:window.getCookie("session")
    });
}
export async function api_all_folders(page){
    let __data = new FormData();

    __data.append('page', page)

    return await post("/all_folders", __data,{
        session:window.getCookie("session")
    });
}
export async function api_folder_list(page){
    let __data = new FormData();

    __data.append('page', page)

    return await post("/folder_list", __data,{
        session:window.getCookie("session")
    });
}
export async function api_new_folder(name){
    let __data = new FormData();

    __data.append('name', name)

    return await post("/new_folder", __data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_folder(idx){
    let __data = new FormData();

    for(let k in idx){
        __data.append('idx:'+k,idx[k])
    }
    __data.append('idx',idx.length)

    return await post("/remove_folder", __data,{
        session:window.getCookie("session")
    });
}
export async function api_move_to_folder(folder_id,contract_ids){
    let __data = new FormData();

    __data.append('folder_id', folder_id);
	for(let k in contract_ids){
        __data.append('contract_ids:'+k,contract_ids[k])
    }
    __data.append('contract_ids',contract_ids.length)

    return await post("/move_to_folder", __data,{
        session:window.getCookie("session")
    });
}
export async function api_folder_in_contracts(folder_id,page){
    let __data = new FormData();

    __data.append('folder_id', folder_id);
	__data.append('page', page)

    return await post("/folder_in_contracts", __data,{
        session:window.getCookie("session")
    });
}
export async function api_edit_contract(contract_id,encrypt_data,edit){
    let __data = new FormData();

    __data.append('contract_id', contract_id);
	for(let k in encrypt_data){
        __data.append('encrypt_data:'+k,encrypt_data[k])
    }
    __data.append('encrypt_data',encrypt_data.length);
	__data.append('edit', edit)

    return await post("/edit_contract", __data,{
        session:window.getCookie("session")
    });
}
export async function api_send_chat(contract_id,msg){
    let __data = new FormData();

    __data.append('contract_id', contract_id);
	__data.append('msg', msg)

    return await post("/send_chat", __data,{
        session:window.getCookie("session")
    });
}
export async function api_fetch_chat(contract_id,cursor){
    let __data = new FormData();

    __data.append('contract_id', contract_id);
	__data.append('cursor', cursor)

    return await post("/fetch_chat", __data,{
        session:window.getCookie("session")
    });
}
export async function api_confirm_contract(contract_id,original,signTx,revision,encrypt){
    let __data = new FormData();

    __data.append('contract_id', contract_id);
	__data.append('original', original);
	__data.append('signTx', signTx);
	__data.append('revision', revision);
	__data.append('encrypt', encrypt)

    return await post("/confirm_contract", __data,{
        session:window.getCookie("session")
    });
}
export async function api_reject_contract(contract_id,msg,revision){
    let __data = new FormData();

    __data.append('contract_id', contract_id);
	__data.append('msg', msg);
	__data.append('revision', revision)

    return await post("/reject_contract", __data,{
        session:window.getCookie("session")
    });
}
export async function api_invite_information(registration_code){
    let __data = new FormData();

    __data.append('registration_code', registration_code)

    return await post("/invite_information", __data,{
        session:window.getCookie("session")
    });
}
export async function api_new_corp(data){
    let __data = new FormData();

    __data.append('data', data)

    return await post("/new_corp", __data,{
        session:window.getCookie("session")
    });
}
export async function api_create_group(title){
    let __data = new FormData();

    __data.append('title', title)

    return await post("/create_group", __data,{
        session:window.getCookie("session")
    });
}
export async function api_get_group_info(group_id){
    let __data = new FormData();

    __data.append('group_id', group_id)

    return await post("/get_group_info", __data,{
        session:window.getCookie("session")
    });
}
export async function api_get_group_members(group_id){
    let __data = new FormData();

    __data.append('group_id', group_id)

    return await post("/get_group_members", __data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_group(group_id){
    let __data = new FormData();

    __data.append('group_id', group_id)

    return await post("/remove_group", __data,{
        session:window.getCookie("session")
    });
}
export async function api_change_group_title(group_id,change_title){
    let __data = new FormData();

    __data.append('group_id', group_id);
	__data.append('change_title', change_title)

    return await post("/change_group_title", __data,{
        session:window.getCookie("session")
    });
}
export async function api_add_member_group(group_id,email,passphrase2,data){
    let __data = new FormData();

    __data.append('group_id', group_id);
	__data.append('email', email);
	__data.append('passphrase2', passphrase2);
	__data.append('data', data)

    return await post("/add_member_group", __data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_member_group(group_id,account_id){
    let __data = new FormData();

    __data.append('group_id', group_id);
	__data.append('account_id', account_id)

    return await post("/remove_member_group", __data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_invite_group(group_id,invite_id){
    let __data = new FormData();

    __data.append('group_id', group_id);
	__data.append('invite_id', invite_id)

    return await post("/remove_invite_group", __data,{
        session:window.getCookie("session")
    });
}
export async function api_update_corp_info(encrypted_corp_info){
    let __data = new FormData();

    __data.append('encrypted_corp_info', encrypted_corp_info)

    return await post("/update_corp_info", __data,{
        session:window.getCookie("session")
    });
}
export async function api_add_template(subject,folder_id,html){
    let __data = new FormData();

    __data.append('subject', subject);
	__data.append('folder_id', folder_id);
	__data.append('html', html)

    return await post("/add_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_update_template(template_id,folder_id,subject,html){
    let __data = new FormData();

    __data.append('template_id', template_id);
	__data.append('folder_id', folder_id);
	__data.append('subject', subject);
	__data.append('html', html)

    return await post("/update_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_template(template_ids){
    let __data = new FormData();

    __data.append('template_ids', template_ids)

    return await post("/remove_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_get_template(template_id){
    let __data = new FormData();

    __data.append('template_id', template_id)

    return await post("/get_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_list_template(folder_id,page){
    let __data = new FormData();

    __data.append('folder_id', folder_id);
	__data.append('page', page)

    return await post("/list_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_folder_list_template(){
    let __data = new FormData();

    

    return await post("/folder_list_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_add_folder_template(name){
    let __data = new FormData();

    __data.append('name', name)

    return await post("/add_folder_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_folder_template(folder_ids){
    let __data = new FormData();

    __data.append('folder_ids', folder_ids)

    return await post("/remove_folder_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_change_folder_template(folder_id,name){
    let __data = new FormData();

    __data.append('folder_id', folder_id);
	__data.append('name', name)

    return await post("/change_folder_template", __data,{
        session:window.getCookie("session")
    });
}
export async function api_request_email_verification(email){
    let __data = new FormData();

    __data.append('email', email)

    return await post("/request_email_verification", __data,{
        session:window.getCookie("session")
    });
}
export async function api_check_email_verification_code(email,code){
    let __data = new FormData();

    __data.append('email', email);
	__data.append('code', code)

    return await post("/check_email_verification_code", __data,{
        session:window.getCookie("session")
    });
}
export async function api_request_phone_verification_code(phone){
    let __data = new FormData();

    __data.append('phone', phone)

    return await post("/request_phone_verification_code", __data,{
        session:window.getCookie("session")
    });
}
export async function api_check_phone_verification_code(phone,code){
    let __data = new FormData();

    __data.append('phone', phone);
	__data.append('code', code)

    return await post("/check_phone_verification_code", __data,{
        session:window.getCookie("session")
    });
}
export async function api_register_account(publicbk,publicms,publicmsc,info,auth,eems,email,name,eth,account_type){
    let __data = new FormData();

    __data.append('publicbk', publicbk);
	__data.append('publicms', publicms);
	__data.append('publicmsc', publicmsc);
	__data.append('info', info);
	__data.append('auth', auth);
	__data.append('eems', eems);
	__data.append('email', email);
	__data.append('name', name);
	__data.append('eth', eth);
	__data.append('account_type', account_type)

    return await post("/register_account", __data,{
        session:window.getCookie("session")
    });
}
export async function api_recover_account(publicbk,publicms,auth,eems,email){
    let __data = new FormData();

    __data.append('publicbk', publicbk);
	__data.append('publicms', publicms);
	__data.append('auth', auth);
	__data.append('eems', eems);
	__data.append('email', email)

    return await post("/recover_account", __data,{
        session:window.getCookie("session")
    });
}
export async function api_check_join_browser(publicbk){
    let __data = new FormData();

    __data.append('publicbk', publicbk)

    return await post("/check_join_browser", __data,{
        session:window.getCookie("session")
    });
}
export async function api_check_join_publickey(publicms){
    let __data = new FormData();

    __data.append('publicms', publicms)

    return await post("/check_join_publickey", __data,{
        session:window.getCookie("session")
    });
}
export async function api_login_account(publicbk,nonce,sign){
    let __data = new FormData();

    __data.append('publicbk', publicbk);
	__data.append('nonce', nonce);
	__data.append('sign', sign)

    return await post("/login_account", __data,{
        session:window.getCookie("session")
    });
}
export async function api_encrypted_user_info(){
    let __data = new FormData();

    

    return await post("/encrypted_user_info", __data,{
        session:window.getCookie("session")
    });
}
export async function api_find_user_with_code_email(email){
    let __data = new FormData();

    __data.append('email', email)

    return await post("/find_user_with_code_email", __data,{
        session:window.getCookie("session")
    });
}
export async function api_select_userinfo_with_email(email){
    let __data = new FormData();

    __data.append('email', email)

    return await post("/select_userinfo_with_email", __data,{
        session:window.getCookie("session")
    });
}
export async function api_update_user_info(encrypted_info){
    let __data = new FormData();

    __data.append('encrypted_info', encrypted_info)

    return await post("/update_user_info", __data,{
        session:window.getCookie("session")
    });
}
export async function api_update_corp_info(encrypted_corp_info){
    let __data = new FormData();

    __data.append('encrypted_corp_info', encrypted_corp_info)

    return await post("/update_corp_info", __data,{
        session:window.getCookie("session")
    });
}