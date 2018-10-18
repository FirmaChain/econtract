import {
    api_new_contract,
    api_load_contract,
    api_folder_list,
    api_recently_contracts,
    api_edit_contract,
    api_send_chat,
    api_fetch_chat,
    api_confirm_contract
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
    decrypt_user_info,
    aes_decrypt,
    aes_encrypt,
} from "../../common/crypto_test"

import Web3 from "../Web3"

export const NEW_CONTRACT = "NEW_CONTRACT"
export const LOAD_FODLERS = "LOAD_FODLERS"
export const LOAD_RECENTLY_CONTRACTS = "LOAD_RECENTLY_CONTRACTS"

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
                let resp = await fetch(`${window.HOST}/${contract_id}-${account.id}-${obj.data}`,{encoding:null})
                obj.data = aes_decrypt(await resp.text() , pin)
                obj.account_id = account.id
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
    return aes_decrypt(text , pin)
}

export function new_contract( subject, imgs, counterparties ){
    return async function(dispatch){
        let pin = genPIN();
        for(let k in imgs){
            await new Promise(r=>setTimeout(r,100))
            imgs[k] = aes_encrypt(imgs[k], pin)
        }

        let resp = (await api_new_contract( subject, imgs, counterparties )).payload
        if(resp){
            localStorage.setItem(`contract:${resp}`, pin)
            dispatch({
                type:NEW_CONTRACT,
                payload:{
                    subject, 
                    imgs, 
                    counterparties,
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

export function load_contract(contract_id, pin){
    return async function(){
        try{
            let contract = (await api_load_contract(contract_id)).payload
            
            contract.html = await parse_html({
                id:contract.account_id,
                code:contract.author_code
            }, contract_id, contract.html, pin)
            
            for(let counterparty of contract.counterparties){
                counterparty.html = await parse_html({
                    id:counterparty.account_id,
                    code:counterparty.code
                }, contract_id, counterparty.html, pin)
            }

            let img_base64 = []
            for(let img of contract.imgs ){
                img_base64.push(await fetch_img(img, pin))
            }

            contract.imgs = img_base64;
            localStorage.setItem(`contract:${contract_id}`, pin)
            return contract
        }catch(err){
            console.log(err)
        }
        return null;
    }
}

export function folder_list(contract_id){
    return async function(dispatch){
        let list = (await api_folder_list(contract_id)).payload
        dispatch({
            type:LOAD_FODLERS,
            payload:list
        })
        return list
    }
}

export function recently_contracts(page=0){
    return async function(dispatch){
        let list = (await api_recently_contracts(page)).payload
        dispatch({
            type:LOAD_RECENTLY_CONTRACTS,
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