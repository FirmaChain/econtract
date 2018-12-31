import {
    api_new_contract,
    api_get_contracts,
    api_update_epin_account,
    api_update_epin_group,
    api_get_contract,
    api_add_counterparties,
/*    api_load_contract,
    api_load_contract_info,
    api_folder_list,
    api_recently_contracts,
    api_edit_contract,
    api_send_chat,
    api_fetch_chat,
    api_confirm_contract,
    api_reject_contract,
    api_new_folder,
    api_remove_folder,
    api_move_to_folder,
    api_folder_in_contracts,
    api_all_folders,
    api_update_epin,
    api_clear_epin,
    api_convert_doc,*/
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
    getContractKey,
    sealContractAuxKey,
    unsealContractAuxKey,
    unsealContractAuxKeyGroup,
    get256bitDerivedPublicKey,
    encryptPIN,
    decryptPIN,
    encryptPINAux,
    decryptPINAux,
    decrypt_user_info,
    aes_decrypt,
    aes_encrypt,
    aes_decrypt_async,
    aes_encrypt_async,
    generate_random,
} from "../../common/crypto_test"

import { sha256 } from 'js-sha256'
import Web3 from "../Web3"
/*
export const LOAD_FODLERS = "LOAD_FODLERS"
export const LOAD_CONTRACT_LIST = "LOAD_CONTRACT_LIST"*/

export const GET_CONTRACTS = "GET_CONTRACTS";
const DUMMY_CORP_ID = 0;

export function select_subject(infos, groups = [], account_id, corp_id) {
    groups = groups ? groups : []
    let my_infos = infos.filter(e=>e.corp_id == DUMMY_CORP_ID && e.entity_id == account_id || e.corp_id == corp_id);
    let group_ids = groups.map(e=>e.group_id)
    let my_info = my_infos.find(e=>e.corp_id == DUMMY_CORP_ID) || my_infos.find(e=>group_ids.indexOf(e.entity_id) != -1);
    my_info = my_info ? my_info : null;
    return {
        my_info,
        isAccount: my_info && my_info.corp_id == DUMMY_CORP_ID,
    };
}

export function genPIN(digit=6) {
    let text = "";
    let possible = "0123456789";
  
    for (let i = 0; i < digit; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

function getGroupKey(user_info, group_id) {
    if (user_info.account_type == 1) {
        return get256bitDerivedPublicKey(Buffer.from(user_info.corp_master_key, 'hex'), "m/0'/"+group_id+"'").toString('hex');
    } else {
        return user_info.group_keys[group_id];
    }
}

export function new_contract(subject, counterparties, set_pin, necessary_info, can_edit_account_id, is_pin_used = false) {
    return async function(dispatch){
        let pin = set_pin ? set_pin : genPIN();
        let shared_key = generate_random(31);
        let the_key = getContractKey(pin, shared_key);
        let counterparties_mapped = counterparties.map(e=>{
            return {
                user_type: e.user_type,
                entity_id: e.user_type == 2 ? e.group_id : e.account_id,
                corp_id: e.user_type == 2 ? e.corp_id : DUMMY_CORP_ID,
                role: e.role,
                eckai: sealContractAuxKey(e.public_key, shared_key),
                user_info: aes_encrypt(JSON.stringify(e), the_key),
            };
        });

        let resp = await api_new_contract(subject, JSON.stringify(counterparties_mapped), JSON.stringify(necessary_info), can_edit_account_id, is_pin_used);
        if(resp.code == 1){
            sessionStorage.setItem(`contract:${resp.payload.contract_id}`, encryptPIN(pin));
        }
        return resp;
    }
}

export function get_contracts(type, status, page, display_count = 10, sub_status = -1, group_id = -1, user_info, groups = []) {
    return async function(dispatch) {
        let resp = await api_get_contracts(type, status, page, display_count, sub_status, group_id)
        if(resp.code == 1) {

            for(let v of resp.payload.list) {
                v.user_infos = v.user_infos.split(window.SEPERATOR).map( e => {
                    let corp_id = user_info.corp_id || -1
                    let infos = [{
                        entity_id:v.entity_id,
                        corp_id:v.corp_id,
                        epin:v.epin,
                        eckai:v.eckai,
                    }]
                    let subject = select_subject(infos, groups, user_info.account_id, corp_id);
                    if (!subject.my_info) return

                    let shared_key;
                    let pin = "000000";
                    if(subject.isAccount) {
                        let entropy = sessionStorage.getItem("entropy");
                        if (!entropy) return null;
                        if (resp.payload.is_pin_used) {
                            pin = decryptPIN(Buffer.from(subject.my_info.epin, 'hex').toString('hex'));
                        }
                        shared_key = unsealContractAuxKey(entropy, Buffer.from(subject.my_info.eckai, 'hex').toString('hex'));
                    } else {
                        if (resp.payload.is_pin_used) {
                            //TODO: necessary to decryptPIN for group key
                            pin = pin;
                        }
                        shared_key = unsealContractAuxKeyGroup(getGroupKey(user_info, subject.my_info.entity_id), Buffer.from(subject.my_info.eckai, 'hex').toString('hex'));
                    }
                    let the_key = getContractKey(pin, shared_key);

                    let result;
                    try{
                        result = JSON.parse(aes_decrypt(e/*Buffer.from(e, 'hex').toString('hex')*/, the_key))
                    } catch(err) {
                        result = {
                            err:"not decrypt",
                            text:subject.my_info
                        }
                    }
                    return result
                })
            }
            dispatch({
                type:GET_CONTRACTS,
                payload:resp.payload
            })
        }
        return resp
    }
}

export function get_contract(contract_id, user_info, groups = []) {
    return async function(dispatch) {
        let resp = await api_get_contract(contract_id)
        if(resp.code == 1) {
            let corp_id = user_info.corp_id || -1;
            let subject = select_subject(resp.payload.infos, groups, user_info.account_id, corp_id);
            if (!subject.my_info) return null;

            let shared_key;
            let pin = "000000";

            if(subject.isAccount) {
                let entropy = sessionStorage.getItem("entropy");
                if (!entropy) return null;
                if (resp.payload.contract.is_pin_used) {
                    pin = decryptPIN(Buffer.from(subject.my_info.epin, 'hex').toString('hex'));
                }
                shared_key = unsealContractAuxKey(entropy, Buffer.from(subject.my_info.eckai, 'hex').toString('hex'));
            } else {
                if (resp.payload.contract.is_pin_used) {
                    //TODO: necessary to decryptPIN for group key
                    pin = pin;
                }
                shared_key = unsealContractAuxKeyGroup(getGroupKey(user_info, subject.my_info.entity_id), Buffer.from(subject.my_info.eckai, 'hex').toString('hex'));
            }
            let the_key = getContractKey(pin, shared_key);

            resp.payload.infos = resp.payload.infos.map( (e) => {
                return {
                    ...e,
                    user_info : JSON.parse(aes_decrypt(Buffer.from(e.user_info, 'hex').toString('hex'), the_key)),
                }
            })
            resp.payload.contract.necessary_info = JSON.parse(resp.payload.contract.necessary_info)
        }
        return resp
    }
}

export function add_counterparties(contract_id, counterparties, groups, user_info, infos, is_pin_used) {
    return async function() {
        let corp_id = user_info.corp_id || -1;
        let subject = select_subject(infos, groups, user_info.account_id, corp_id);
        if (!subject.my_info) return null;

        let shared_key;
        let pin = "000000";
        if(subject.isAccount) {
            let entropy = sessionStorage.getItem("entropy");
            if (!entropy) return null;
            if (is_pin_used) {
                pin = decryptPIN(Buffer.from(subject.my_info.epin, 'hex').toString('hex'));
            }
            shared_key = unsealContractAuxKey(entropy, Buffer.from(subject.my_info.eckai, 'hex').toString('hex'));
        } else {
            if (resp.payload.is_pin_used) {
                //TODO: necessary to decryptPIN for group key
                pin = pin;
            }
            shared_key = unsealContractAuxKeyGroup(getGroupKey(user_info, subject.my_info.entity_id), Buffer.from(subject.my_info.eckai, 'hex').toString('hex'));
        }
        let the_key = getContractKey(pin, shared_key);

        let counterparties_mapped = counterparties.map(e=>{
            return {
                user_type: e.user_type,
                entity_id: e.user_type == 2 ? e.group_id : e.account_id,
                corp_id: e.user_type == 2 ? e.corp_id : DUMMY_CORP_ID,
                role: e.role,
                eckai: sealContractAuxKey(e.public_key, shared_key),
                user_info: aes_encrypt(JSON.stringify(e), the_key),
            };
        });
        let res = await api_add_counterparties( contract_id, JSON.stringify(counterparties_mapped) )
        return res
    }
}

export function update_epin_account(contract_id, pin){
    return async function(){
        let epin = encryptPIN(pin);
        return (await api_update_epin_account(contract_id, epin)).payload;
    };
}

export function update_epin_group(corp_id, group_id, contract_id, user_info, pin){
    return async function(){
        //group용 encrypt PIN
        let group_key = getGroupKey(user_info, group_id);
        let epin = encryptPINAux(pin, group_key);
        return (await api_update_epin_group(corp_id, group_id, contract_id, epin)).payload;
    };
}



// function removePIN(contract_id){
//     sessionStorage.removeItem(`contract:${contract_id}`);
// }
/*
async function getPIN(contract_id) {
    let epin = sessionStorage.getItem(`contract:${contract_id}`);
    if (!epin) {
        let contract_info = (await api_load_contract_info(contract_id)).payload;
        if (contract_info && contract_info.epin) {
            epin = contract_info.epin.slice(0, 32);
        } else {
            return null;
        }
    }
    return decryptPIN(epin);
}

async function getTheKey(contract_id, pin) {
    let contract_info = (await api_load_contract_info(contract_id)).payload;
    let entropy = sessionStorage.getItem("entropy");
    if (!contract_info || !entropy) return null;
    let shared_key = unsealContractAuxKey(entropy, contract_info.eckai);
    let the_key = getContractKey(pin, shared_key);
    return the_key;
}

async function parse_html(account, contract_id, html, the_key){
    try{
        html = aes_decrypt(html, the_key)
        html = JSON.parse(html)
        for(let page of html){
            for(let k in page){
                let obj = page[k]
                if (obj.type == "img") {
                    let resp = await fetch(`${window.HOST}/${contract_id}-${account.id}-${obj.data}`,{encoding:null})
                    obj.data = aes_decrypt(await resp.text() , the_key)
                }
                obj.account_id = account.id
                obj.name = account.name
                obj.code = account.code
            }
        }

        return html
    }catch(err){
        
    }

    return []
}

async function fetch_img(name, the_key){
    let resp = await fetch(`${window.HOST}/${name}`,{encoding:null})
    let text = await resp.text();
    console.log(text.length, the_key)
    let buffered = await aes_decrypt_async(text, the_key, true);
    var blob = new Blob([buffered], {type: 'image/png'});
    var url = URL.createObjectURL(blob);
    return url;
}
export function get_pin_from_storage(contract_id){
    return async function(){
        return await getPIN(contract_id);
    }
}

export function load_contract_info(contract_id){
    return async function(){
        return (await api_load_contract_info(contract_id)).payload;
    };
}

export function load_contract(contract_id, pin, load_listener = null){
    return async function(){
        try{
            let the_key = await getTheKey(contract_id, pin);
            let contract = (await api_load_contract(contract_id)).payload;

            contract.html = await parse_html({
                id:contract.account_id,
                code:contract.author_code,
                name:contract.author_name
            }, contract_id, contract.html, the_key)

            try{ contract.author_msg = aes_decrypt(contract.author_msg, the_key) }catch(err){}
            
            for(let counterparty of contract.counterparties){
                counterparty.html = await parse_html({
                    id:counterparty.account_id,
                    code:counterparty.code,
                    name:counterparty.name
                }, contract_id, counterparty.html, the_key)
                
                try{ counterparty.reject = aes_decrypt(counterparty.reject, the_key) }catch(err){}
            }

            let img_base64 = []
            let i = 0;
            for(let img of contract.imgs ) {
                img_base64.push(await fetch_img(img, the_key))
                i++;
                if(load_listener != null)
                    load_listener(i, contract.imgs.length)
            }
            contract.imgs = img_base64;

            // if(contract.ipfs){
            //     let payload = await window.ipfs_download(contract.ipfs);
            //     contract.pdf = aes_decrypt(payload, the_key)
            //     console.log(contract.pdf)
            // }
            
            sessionStorage.setItem(`contract:${contract_id}`, encryptPIN(pin))
            //localStorage.setItem(`contract:${contract_id}`, pin)
            return contract
        }catch(err){
            console.log(err)
            // removePIN(contract_id);
        }
        return null;
    }
}

export function all_folders(){
    return async function(dispatch){
        return (await api_all_folders()).payload
    }
}

export function folder_list(page=0){
    return async function(dispatch){
        let list = (await api_folder_list(page)).payload
        dispatch({
            type:LOAD_FODLERS,
            payload:list
        })
        return list
    }
}

export function folder_in_contracts(folder_id,page=0){
    return async function(dispatch){
        let folder = (await api_folder_in_contracts(folder_id,page)).payload
        dispatch({
            type:LOAD_CONTRACT_LIST,
            payload:folder
        })
        return folder
    }
}

export function recently_contracts(page=0){
    return async function(dispatch){
        let list = (await api_recently_contracts(page)).payload
        dispatch({
            type:LOAD_CONTRACT_LIST,
            payload:list
        })
        return list
    }
}

export function edit_contract(contract_id, pin, edit){
    return async function(dispatch){
        let encrypt_data = []
        let the_key = await getTheKey(contract_id, pin);
        for(let page of edit){
            for(let k in page){
                let obj = page[k]
                if(obj.type == "img"){
                    await new Promise(r=>setTimeout(r,100))
                    encrypt_data.push(aes_encrypt(obj.data, the_key))
                    obj.data = encrypt_data.length - 1
                }
            }
        }

        let encrypt_edit = aes_encrypt(JSON.stringify(edit), the_key)
        return (await api_edit_contract(contract_id, encrypt_data, encrypt_edit)).payload
    }
}

export function send_chat(contract_id, msg){
    return async function(dispatch){
        let pin = await getPIN(contract_id);
        if(pin){
            let the_key = await getTheKey(contract_id, pin);
            let encrypt_msg = aes_encrypt(msg || "  ", the_key)
            let resp = (await api_send_chat(contract_id, encrypt_msg)).payload
            if(resp){
                return true
            }
        }
        return false
    }
}

export function fetch_chat(contract_id, cursor=0){
    return async function(dispatch){
        let pin = await getPIN(contract_id);
        if(pin){
            let the_key = await getTheKey(contract_id, pin);
            let resp = (await api_fetch_chat(contract_id, cursor)).payload
            for(let chat of resp){
                try{
                    if(Number(chat.msg) == chat.msg){
                        chat.msg = {
                            type:Number(chat.msg)
                        }
                    }else{
                        chat.msg = aes_decrypt(chat.msg, the_key)
                    }
                }catch(err){}
            }
            return resp
        }
        return null
    }
}

export function confirm_contract(contract_id, counterparties, docByte, revision){
    return async function(dispatch){
        let pin = await getPIN(contract_id);
        let thekey = await getTheKey(contract_id, pin)
        let encrypt = aes_encrypt(new Buffer(docByte), thekey)


        let original = sha256(docByte)
        let signTx = await Web3.signed_newOrSignContract(original,counterparties)

        console.log(JSON.stringify(signTx))

        return (await api_confirm_contract( contract_id, original, JSON.stringify(signTx), revision, encrypt)).payload
    }
}

export function reject_contract(contract_id, msg, revision){
    return async function(dispatch){
        let pin = await getPIN(contract_id);
        let the_key = await getTheKey(contract_id, pin);
        msg = aes_encrypt(msg, the_key)

        return (await api_reject_contract(contract_id, msg, revision)).payload
    }
}

export function new_folder(name){
    return async function(dispatch){
        let resp = await api_new_folder(name)
        console.log(resp)
        return resp.payload
    }
}

export function remove_folder(folder_ids){
    return async function(dispatch){
        return (await api_remove_folder(folder_ids)).payload
    }
}

export function move_to_folder(folder_id,contract_ids){
    return async function(dispatch){
        return (await api_move_to_folder(folder_id,contract_ids)).payload
    }
}

export function clear_epin(contract_id){
    return async function(){
        return (await api_clear_epin(contract_id)).payload;
    };
}

export function gen_pin(digit=6) {
    return async function() {
        return genPIN(digit);
    };
}

export function eth_transaction(){
    return async function(){
    }
}

export function convert_doc(file){
    return async function(){
        return await api_convert_doc(file)
    }
}

export function decrypt_contract_hexstring(contract_id, hexstring){
    return async function(dispatch){
        let pin = await getPIN(contract_id);
        let thekey = await getTheKey(contract_id, pin);
        let decrypted = aes_decrypt(hexstring, thekey, true);
        return decrypted;
    }
}*/

