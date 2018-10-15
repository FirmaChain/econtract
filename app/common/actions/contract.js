import {
    api_new_contract,
    api_load_contract,
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
    decrypt_user_info,
    aes_decrypt,
} from "../../common/crypto_test"

import Web3 from "../Web3"

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