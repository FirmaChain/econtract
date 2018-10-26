import {
    api_new_contract,
    api_load_contract,
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
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
    getContractKey,
    sealContractAuxKey,
    unsealContractAuxKey,
    encryptPIN,
    decryptPIN,
    decrypt_user_info,
    aes_decrypt,
    aes_encrypt,
    generate_random,
} from "../../common/crypto_test"

import Web3 from "../Web3"

export const NEW_CONTRACT = "NEW_CONTRACT"
export const LOAD_FODLERS = "LOAD_FODLERS"
export const LOAD_CONTRACT_LIST = "LOAD_CONTRACT_LIST"

function genPIN(digit=6) {
    let text = "";
    let possible = "0123456789";
  
    for (let i = 0; i < digit; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

async function getPIN(contract_id) {
    let epin = sessionStorage.getItem(`contract:${contract_id}`);
    if (!epin) {
        let contract_info = (await api_load_contract_info(contract_id)).payload;
        if (contract_info.epin) {
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
    return aes_decrypt(text , the_key)
}

export function new_contract( subject, imgs, counterparties, publickey_contract_list){
    return async function(dispatch){
        let pin = genPIN();
        let counterparties_eckai = [];
        let shared_key = generate_random(31);
        let the_key = getContractKey(pin, shared_key);

        for (let i = 0; i < publickey_contract_list.length; i++) {
            counterparties_eckai.push(sealContractAuxKey(publickey_contract_list[i], shared_key));
        }

        for(let k in imgs){
            await new Promise(r=>setTimeout(r,100))
            imgs[k] = aes_encrypt(imgs[k], the_key)
        }

        let resp = (await api_new_contract( subject, imgs, counterparties, counterparties_eckai )).payload
        if(resp){
            sessionStorage.setItem(`contract:${resp}`, encryptPIN(pin))
            //localStorage.setItem(`contract:${resp}`, pin)
            dispatch({
                type:NEW_CONTRACT,
                payload:{
                    subject, 
                    imgs, 
                    counterparties,
                    counterparties_eckai,
                    pin
                }
            })
        }
        return resp
    }
}

export function get_pin_from_storage(contract_id){
    return async function(){
        return getPIN(contract_id);
    }
}

export function load_contract_info(contract_id){
    return async function(){
        return (await api_load_contract_info(contract_id)).payload;
    };
}

export function load_contract(contract_id, pin, load_listener = null, only_info_load=false){
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

            if(!only_info_load) {
                
                let img_base64 = []
                let i = 0;
                for(let img of contract.imgs ) {
                    img_base64.push(await fetch_img(img, the_key))
                    i++;
                    if(load_listener != null)
                        load_listener(i, contract.imgs.length)
                }

                contract.imgs = img_base64;
            }
            sessionStorage.setItem(`contract:${contract_id}`, encryptPIN(pin))
            //localStorage.setItem(`contract:${contract_id}`, pin)
            return contract
        }catch(err){
            console.log(err)
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
        let pin = getPIN(contract_id);
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
        let pin = getPIN(contract_id);
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

export function confirm_contract(contract_id){
    return async function(dispatch){
        return (await api_confirm_contract(contract_id)).payload
    }
}

export function reject_contract(contract_id, msg){
    return async function(dispatch){
        let pin = getPIN(contract_id);
        let the_key = await getTheKey(contract_id, pin);
        msg = aes_encrypt(msg, the_key)

        return (await api_reject_contract(contract_id, msg)).payload
    }
}


export function new_folder(name){
    return async function(dispatch){
        return (await api_new_folder(name)).payload
    }
}

export function remove_folder(folder_ids){
    return async function(dispatch){
        console.log(folder_ids)
        return (await api_remove_folder(folder_ids)).payload
    }
}

export function move_to_folder(folder_id,contract_ids){
    return async function(dispatch){
        console.log(folder_id,contract_ids)
        return (await api_move_to_folder(folder_id,contract_ids)).payload
    }
}

export function update_epin(contract_id, pin){
    return async function(){
        let epin = encryptPIN(pin);
        return (await api_update_epin(contract_id, epin)).payload;
    };
}

export function gen_pin(digit=6) {
    return async function() {
        return genPIN(digit);
    };
}
