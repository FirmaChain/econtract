import {
    api_new_approval,
    api_list_approval,
    api_get_approval,
    api_send_approval_chat,
    api_get_approval_chats,
    api_update_approval_model,
} from "../../../gen_api"

import {
    aes_decrypt,
    aes_encrypt,
    generate_random,
    getMasterSeed,
    SeedToMasterKeyPublic,
} from "../../common/crypto_test"

import { sha256 } from 'js-sha256'

export const GET_APPROVALS = "GET_APPROVALS";

export function new_approval(name, order_list, corp_key, html = null){
    return async function() {
        if(!corp_key) return false;

        let encrypted_html = null;
        if(html) 
            encrypted_html = aes_encrypt(html, Buffer.from(corp_key, 'hex'));

        let resp = await api_new_approval(name, JSON.stringify(order_list), encrypted_html);
        return resp;
    }
}

export function list_approval(type, page = 0, search_text = "", display_count = 6, corp_key) {
    return async function(dispatch) {
        if(!corp_key) return false;

        let resp = await api_list_approval(type, page, display_count, search_text);
        for(let v of resp.payload.list) {
            if(v.html) v.html = aes_decrypt(Buffer.from(v.html, 'hex'), Buffer.from(corp_key, 'hex'));
        }

        dispatch({
            type:GET_APPROVALS,
            payload:resp.payload
        })

        return resp.payload;
    }
}

export function get_approval(approval_id, corp_key) {
    return async function() {
        let resp = await api_get_approval(approval_id);

        if(resp.payload.approval.html) resp.payload.approval.html = aes_decrypt(Buffer.from(resp.payload.approval.html, 'hex'), Buffer.from(corp_key, 'hex'));
        
        for(let v of resp.payload.order_list) {
            if(v.public_info) v.public_info = JSON.parse(aes_decrypt(Buffer.from(v.public_info, 'hex'), Buffer.from(corp_key, 'hex')));
        }

        return resp;
    }
}


export function send_approval_chat(approval_id, entity_id, corp_id, message){
    return async function(){
        return (await api_send_approval_chat(approval_id, entity_id, corp_id, message));
    };
}

export function get_approval_chats(approval_id, page = 0, display_count = 20, last_chat_id = 0){
    return async function(){
        return (await api_get_approval_chats(approval_id, page, display_count, last_chat_id));
    };
}

export function update_approval_model(approval_id, model, corp_key){
    return async function(){
        let encrypted_model = aes_encrypt(model, Buffer.from(corp_key, 'hex'))
        return (await api_update_approval_model(approval_id, encrypted_model));
    };
}

