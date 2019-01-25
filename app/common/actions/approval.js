import {
    api_new_approval,
} from "../../../gen_api"

import {
    aes_decrypt,
    aes_encrypt,
    generate_random,
    getMasterSeed,
    SeedToMasterKeyPublic,
} from "../../common/crypto_test"

import { sha256 } from 'js-sha256'


export function new_approval(name, order_list, corp_key, html = null){
    return async function(){
        if(!corp_key) return false;

        let encrypted_html = null
        if(html) 
            encrypted_html = aes_encrypt(html, Buffer.from(corp_key, 'hex'));

        let resp = await api_new_approval(name, JSON.stringify(order_list), encrypted_html)
        return resp
    }
}

export function list_approval(type, page = 0, display_count = 6, corp_key) {
    return async function() {
        if(!corp_key) return false;

        let resp = await api_list_approval(type, page, display_count);

        for(let v of resp.payload.list) {
            v.html = aes_decrypt(Buffer.from(v.html, 'hex'), Buffer.from(corp_key, 'hex'))
        }

        return resp.payload
    }
}