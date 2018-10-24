import {
    api_new_contract,
    api_load_contract,
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
    api_all_folders
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
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

async function parse_html(account, contract_id, html, pin){
    try{
        html = aes_decrypt(html, pin)
        html = JSON.parse(html)
        for(let page of html){
            for(let k in page){
                let obj = page[k]
                if (obj.type == "img") {
                    let resp = await fetch(`${window.HOST}/${contract_id}-${account.id}-${obj.data}`,{encoding:null})
                    obj.data = aes_decrypt(await resp.text() , pin)
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

async function fetch_img(name, pin){
    let resp = await fetch(`${window.HOST}/${name}`,{encoding:null})
    let text = await resp.text();
    console.log(text.length, pin)
    return aes_decrypt(text , pin)
}

export function new_contract( subject, imgs, counterparties, publickey_contract_list){
    return async function(dispatch){
        let pin = genPIN();
        for(let k in imgs){
            await new Promise(r=>setTimeout(r,100))
            imgs[k] = aes_encrypt(imgs[k], pin)
        }

        let counterparties_eckai = ['cafebabe', 'deadbeef'];
        let shared_key = generate_random(31);
        counterparties_eckai.unshift(publickey_contract_list[0].toString('hex'));

        let resp = (await api_new_contract( subject, imgs, counterparties, counterparties_eckai )).payload
        if(resp){
            localStorage.setItem(`contract:${resp}`, pin)
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
        return localStorage.getItem(`contract:${contract_id}`) 
    }
}

export function load_contract(contract_id, pin, load_listener = null){
    return async function(){
        try{
            let contract = (await api_load_contract(contract_id)).payload
            
            contract.html = await parse_html({
                id:contract.account_id,
                code:contract.author_code,
                name:contract.author_name
            }, contract_id, contract.html, pin)

            try{ contract.author_msg = aes_decrypt(contract.author_msg, pin) }catch(err){}
            
            for(let counterparty of contract.counterparties){
                counterparty.html = await parse_html({
                    id:counterparty.account_id,
                    code:counterparty.code,
                    name:counterparty.name
                }, contract_id, counterparty.html, pin)
                
                try{ counterparty.reject = aes_decrypt(counterparty.reject, pin) }catch(err){}
            }

            let img_base64 = []
            let i = 0;
            for(let img of contract.imgs ){
                img_base64.push(await fetch_img(img, pin))
                i++;
                if(load_listener != null)
                    load_listener(i, contract.imgs.length)
            }

            contract.imgs = img_base64;
            localStorage.setItem(`contract:${contract_id}`, pin)
            console.log("contract",contract)
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
        for(let page of edit){
            for(let k in page){
                let obj = page[k]
                if(obj.type == "img"){
                    await new Promise(r=>setTimeout(r,100))
                    encrypt_data.push(aes_encrypt(obj.data, pin))
                    obj.data = encrypt_data.length - 1
                }
            }
        }

        let encrypt_edit = aes_encrypt(JSON.stringify(edit), pin)
        return (await api_edit_contract(contract_id, encrypt_data, encrypt_edit)).payload
    }
}

export function send_chat(contract_id, msg){
    return async function(dispatch){
        let pin = localStorage.getItem(`contract:${contract_id}`);
        if(pin){
            let encrypt_msg = aes_encrypt(msg || "  ", pin)
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
        let pin = localStorage.getItem(`contract:${contract_id}`);
        if(pin){
            let resp = (await api_fetch_chat(contract_id, cursor)).payload
            for(let chat of resp){
                try{
                    if(Number(chat.msg) == chat.msg){
                        chat.msg = {
                            type:Number(chat.msg)
                        }
                    }else{
                        chat.msg = aes_decrypt(chat.msg, pin)
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
        let pin = localStorage.getItem(`contract:${contract_id}`) 
        msg = aes_encrypt(msg, pin)

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
