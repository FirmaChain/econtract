import {
    api_new_contract,
    api_load_contract,
    api_folder_list,
    api_recently_contracts
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
    decrypt_user_info,
    aes_decrypt,
} from "../../common/crypto_test"

import Web3 from "../Web3"

export const LOAD_FODLERS = "LOAD_FODLERS"
export const LOAD_RECENTLY_CONTRACTS = "LOAD_RECENTLY_CONTRACTS"

async function fetch_img(name, pin){
    let resp = await fetch(`${window.HOST}/${name}`,{encoding:null})
    let text = await resp.text();
    return aes_decrypt(text , pin)
}

export function new_contract( subject, imgs, counterparties ){
    return async function(){
        return (await api_new_contract( subject, imgs, counterparties )).payload
    }
}

export function load_contract(contract_id){
    return async function(){
        let contract = (await api_load_contract(contract_id)).payload
        let img_base64 = []
        for(let img of contract.imgs ){
            img_base64.push(await fetch_img(img, contract.pin))
        }
        contract.imgs = img_base64;
        return contract
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

export function recently_contracts(contract_id){
    return async function(dispatch){
        let list = (await api_recently_contracts(contract_id)).payload
        dispatch({
            type:LOAD_RECENTLY_CONTRACTS,
            payload:list
        })
        return list
    }
}
