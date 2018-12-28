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
export async function api_new_contract(subject,counterparties,counterparties_eckai,necessary_info_string){
    let __data = new FormData();

    __data.append('subject', subject);
	for(let k in counterparties){
        __data.append('counterparties:'+k,counterparties[k])
    }
    __data.append('counterparties',counterparties.length);
	for(let k in counterparties_eckai){
        __data.append('counterparties_eckai:'+k,counterparties_eckai[k])
    }
    __data.append('counterparties_eckai',counterparties_eckai.length);
	__data.append('necessary_info_string', necessary_info_string)

    return await post("/new_contract", __data,{
        session:window.getCookie("session")
    });
}
export async function api_get_contracts(type,status,page,display_count,sub_status,group_id){
    let __data = new FormData();

    __data.append('type', type);
	__data.append('status', status);
	__data.append('page', page);
	__data.append('display_count', display_count);
	__data.append('sub_status', sub_status);
	__data.append('group_id', group_id)

    return await post("/get_contracts", __data,{
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
export async function api_update_group_public_key(group_id,group_public_key){
    let __data = new FormData();

    __data.append('group_id', group_id);
	__data.append('group_public_key', group_public_key)

    return await post("/update_group_public_key", __data,{
        session:window.getCookie("session")
    });
}
export async function api_get_group_info(group_id,hidden,detail){
    let __data = new FormData();

    __data.append('group_id', group_id);
	__data.append('hidden', hidden);
	__data.append('detail', detail)

    return await post("/get_group_info", __data,{
        session:window.getCookie("session")
    });
}
export async function api_hide_group(group_id){
    let __data = new FormData();

    __data.append('group_id', group_id)

    return await post("/hide_group", __data,{
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
export async function api_remove_group_member(group_id,account_id){
    let __data = new FormData();

    __data.append('group_id', group_id);
	__data.append('account_id', account_id)

    return await post("/remove_group_member", __data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_group_member_all(group_id){
    let __data = new FormData();

    __data.append('group_id', group_id)

    return await post("/remove_group_member_all", __data,{
        session:window.getCookie("session")
    });
}
export async function api_consume_invitation(invite_code,data){
    let __data = new FormData();

    __data.append('invite_code', invite_code);
	__data.append('data', data)

    return await post("/consume_invitation", __data,{
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
export async function api_add_member_group(group_id,email,passphrase2,data,data_for_inviter){
    let __data = new FormData();

    __data.append('group_id', group_id);
	__data.append('email', email);
	__data.append('passphrase2', passphrase2);
	__data.append('data', data);
	__data.append('data_for_inviter', data_for_inviter)

    return await post("/add_member_group", __data,{
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
export async function api_get_corp_member_info(target_account_id){
    let __data = new FormData();

    __data.append('target_account_id', target_account_id)

    return await post("/get_corp_member_info", __data,{
        session:window.getCookie("session")
    });
}
export async function api_get_corp_member_info_all(){
    let __data = new FormData();

    

    return await post("/get_corp_member_info_all", __data,{
        session:window.getCookie("session")
    });
}
export async function api_all_invite_list(){
    let __data = new FormData();

    

    return await post("/all_invite_list", __data,{
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
export async function api_encrypted_user_info(){
    let __data = new FormData();

    

    return await post("/encrypted_user_info", __data,{
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
export async function api_update_user_public_info(encrypted_info){
    let __data = new FormData();

    __data.append('encrypted_info', encrypted_info)

    return await post("/update_user_public_info", __data,{
        session:window.getCookie("session")
    });
}