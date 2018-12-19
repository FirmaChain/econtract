// ### WARNING ###
// THIS FILE IS AUTO GENERATED!!
// DO NOT MODIFIY THIS FILE DIRECTLY!!
// ### WARNING ###

import {post, get} from './Network.js';

export async function api_convert_doc(file){
    let data = new FormData();

    data.append('file', file)

    return await post("/convert_doc", data,{
        session:window.getCookie("session")
    });
}
export async function api_new_contract(subject,counterparties,counterparties_eckai){
    let data = new FormData();

    data.append('subject', subject);
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
export async function api_clear_epin(contract_id){
    let data = new FormData();

    data.append('contract_id', contract_id)

    return await post("/clear_epin", data,{
        session:window.getCookie("session")
    });
}
export async function api_load_contract_info(contract_id){
    let data = new FormData();

    data.append('contract_id', contract_id)

    return await post("/load_contract_info", data,{
        session:window.getCookie("session")
    });
}
export async function api_load_contract(contract_id){
    let data = new FormData();

    data.append('contract_id', contract_id)

    return await post("/load_contract", data,{
        session:window.getCookie("session")
    });
}
export async function api_recently_contracts(page){
    let data = new FormData();

    data.append('page', page)

    return await post("/recently_contracts", data,{
        session:window.getCookie("session")
    });
}
export async function api_all_folders(page){
    let data = new FormData();

    data.append('page', page)

    return await post("/all_folders", data,{
        session:window.getCookie("session")
    });
}
export async function api_folder_list(page){
    let data = new FormData();

    data.append('page', page)

    return await post("/folder_list", data,{
        session:window.getCookie("session")
    });
}
export async function api_new_folder(name){
    let data = new FormData();

    data.append('name', name)

    return await post("/new_folder", data,{
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
    let data = new FormData();

    data.append('folder_id', folder_id);
	data.append('page', page)

    return await post("/folder_in_contracts", data,{
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
export async function api_confirm_contract(contract_id,original,signTx,revision,encrypt){
    let data = new FormData();

    data.append('contract_id', contract_id);
	data.append('original', original);
	data.append('signTx', signTx);
	data.append('revision', revision);
	data.append('encrypt', encrypt)

    return await post("/confirm_contract", data,{
        session:window.getCookie("session")
    });
}
export async function api_reject_contract(contract_id,msg,revision){
    let data = new FormData();

    data.append('contract_id', contract_id);
	data.append('msg', msg);
	data.append('revision', revision)

    return await post("/reject_contract", data,{
        session:window.getCookie("session")
    });
}
export async function api_invite_information(registration_code){
    let data = new FormData();

    data.append('registration_code', registration_code)

    return await post("/invite_information", data,{
        session:window.getCookie("session")
    });
}
export async function api_new_corp(data){
    let data = new FormData();

    data.append('data', data)

    return await post("/new_corp", data,{
        session:window.getCookie("session")
    });
}
export async function api_get_my_groups_info(){
    let data = new FormData();

    

    return await post("/get_my_groups_info", data,{
        session:window.getCookie("session")
    });
}
export async function api_get_group_info(group_id){
    let data = new FormData();

    data.append('group_id', group_id)

    return await post("/get_group_info", data,{
        session:window.getCookie("session")
    });
}
export async function api_get_group_members(group_id){
    let data = new FormData();

    data.append('group_id', group_id)

    return await post("/get_group_members", data,{
        session:window.getCookie("session")
    });
}
export async function api_create_group(group_name){
    let data = new FormData();

    data.append('group_name', group_name)

    return await post("/create_group", data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_group(group_id){
    let data = new FormData();

    data.append('group_id', group_id)

    return await post("/remove_group", data,{
        session:window.getCookie("session")
    });
}
export async function api_change_group_title(group_id,change_title){
    let data = new FormData();

    data.append('group_id', group_id);
	data.append('change_title', change_title)

    return await post("/change_group_title", data,{
        session:window.getCookie("session")
    });
}
export async function api_add_member_group(group_id,email,passphrase2,data){
    let data = new FormData();

    data.append('group_id', group_id);
	data.append('email', email);
	data.append('passphrase2', passphrase2);
	data.append('data', data)

    return await post("/add_member_group", data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_member_group(group_id,account_id){
    let data = new FormData();

    data.append('group_id', group_id);
	data.append('account_id', account_id)

    return await post("/remove_member_group", data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_invite_group(group_id,invite_id){
    let data = new FormData();

    data.append('group_id', group_id);
	data.append('invite_id', invite_id)

    return await post("/remove_invite_group", data,{
        session:window.getCookie("session")
    });
}
export async function api_add_template(subject,folder_id,html){
    let data = new FormData();

    data.append('subject', subject);
	data.append('folder_id', folder_id);
	data.append('html', html)

    return await post("/add_template", data,{
        session:window.getCookie("session")
    });
}
export async function api_update_template(template_id,html){
    let data = new FormData();

    data.append('template_id', template_id);
	data.append('html', html)

    return await post("/update_template", data,{
        session:window.getCookie("session")
    });
}
export async function api_remove_template(template_ids){
    let data = new FormData();

    data.append('template_ids', template_ids)

    return await post("/remove_template", data,{
        session:window.getCookie("session")
    });
}
export async function api_get_template(template_id){
    let data = new FormData();

    data.append('template_id', template_id)

    return await post("/get_template", data,{
        session:window.getCookie("session")
    });
}
export async function api_list_template(folder_id){
    let data = new FormData();

    data.append('folder_id', folder_id)

    return await post("/list_template", data,{
        session:window.getCookie("session")
    });
}
export async function api_request_email_verification(email){
    let data = new FormData();

    data.append('email', email)

    return await post("/request_email_verification", data,{
        session:window.getCookie("session")
    });
}
export async function api_check_email_verification_code(email,code){
    let data = new FormData();

    data.append('email', email);
	data.append('code', code)

    return await post("/check_email_verification_code", data,{
        session:window.getCookie("session")
    });
}
export async function api_request_phone_verification_code(phone){
    let data = new FormData();

    data.append('phone', phone)

    return await post("/request_phone_verification_code", data,{
        session:window.getCookie("session")
    });
}
export async function api_check_phone_verification_code(phone,code){
    let data = new FormData();

    data.append('phone', phone);
	data.append('code', code)

    return await post("/check_phone_verification_code", data,{
        session:window.getCookie("session")
    });
}
export async function api_register_account(publicbk,publicms,publicmsc,info,auth,eems,email,name,eth,account_type){
    let data = new FormData();

    data.append('publicbk', publicbk);
	data.append('publicms', publicms);
	data.append('publicmsc', publicmsc);
	data.append('info', info);
	data.append('auth', auth);
	data.append('eems', eems);
	data.append('email', email);
	data.append('name', name);
	data.append('eth', eth);
	data.append('account_type', account_type)

    return await post("/register_account", data,{
        session:window.getCookie("session")
    });
}
export async function api_recover_account(publicbk,publicms,auth,eems,email){
    let data = new FormData();

    data.append('publicbk', publicbk);
	data.append('publicms', publicms);
	data.append('auth', auth);
	data.append('eems', eems);
	data.append('email', email)

    return await post("/recover_account", data,{
        session:window.getCookie("session")
    });
}
export async function api_check_join_browser(publicbk){
    let data = new FormData();

    data.append('publicbk', publicbk)

    return await post("/check_join_browser", data,{
        session:window.getCookie("session")
    });
}
export async function api_check_join_publickey(publicms){
    let data = new FormData();

    data.append('publicms', publicms)

    return await post("/check_join_publickey", data,{
        session:window.getCookie("session")
    });
}
export async function api_login_account(publicbk,nonce,sign){
    let data = new FormData();

    data.append('publicbk', publicbk);
	data.append('nonce', nonce);
	data.append('sign', sign)

    return await post("/login_account", data,{
        session:window.getCookie("session")
    });
}
export async function api_encrypted_user_info(){
    let data = new FormData();

    

    return await post("/encrypted_user_info", data,{
        session:window.getCookie("session")
    });
}
export async function api_find_user_with_code_email(email){
    let data = new FormData();

    data.append('email', email)

    return await post("/find_user_with_code_email", data,{
        session:window.getCookie("session")
    });
}
export async function api_select_userinfo_with_email(email){
    let data = new FormData();

    data.append('email', email)

    return await post("/select_userinfo_with_email", data,{
        session:window.getCookie("session")
    });
}
export async function api_update_user_info(info){
    let data = new FormData();

    data.append('info', info)

    return await post("/update_user_info", data,{
        session:window.getCookie("session")
    });
}