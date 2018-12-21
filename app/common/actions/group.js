import {
    api_invite_information,
    api_get_my_groups_info,
    api_get_group_info,
    api_get_group_members,
    api_create_group,
    api_remove_group,
    api_add_member_group,
    api_remove_member_group,
    api_remove_invite_group,
    api_change_group_title,
    api_new_corp,
} from "../../../gen_api"

import {
    aes_decrypt_async,
    aes_encrypt_async,
    hmac_sha256,
} from "../../common/crypto_test"

import Web3 from "../Web3"
import md5 from 'md5'

export const GROUP_HOME_OPEN_GROUP = "GROUP_HOME_OPEN_GROUP"
export const GROUP_HOME_CLOSE_GROUP = "GROUP_HOME_CLOSE_GROUP"
export const GET_MY_GROUPS_INFO = "GET_MY_GROUPS_INFO"
export const GET_GROUP_INFO = "GET_GROUP_INFO"
export const GET_GROUP_MEMBERS = "GET_GROUP_MEMBERS"

export const CREATE_GROUP = "CREATE_GROUP"
export const REMOVE_GROUP = "REMOVE_GROUP"
export const ADD_MEMBER_GROUP = "ADD_MEMBER_GROUP"
export const REMOVE_MEMBER_GROUP = "REMOVE_MEMBER_GROUP"
export const REMOVE_INVITE_GROUP = "REMOVE_INVITE_GROUP"

export function openGroup(group_id){
	return async function (dispatch){
		dispatch({ type:GROUP_HOME_OPEN_GROUP, payload:group_id })
	}
}

export function closeGroup(group_id){
	return async function (dispatch){
		dispatch({ type:GROUP_HOME_CLOSE_GROUP, payload:group_id })
	}
}

export function get_my_groups_info() {
    return async function(dispatch) {
        let infos = await api_get_my_groups_info();
        if(infos.code == 1 && infos.payload)
            dispatch({ type:GET_MY_GROUPS_INFO, payload:infos.payload})
        return infos.payload
    }
}

export function get_group_info(group_id) {
    return async function(dispatch) {
        let info = await api_get_group_info(group_id);
        console.log(info)
        return info.payload
    }
}

export function get_group_members(group_id) {
    return async function(dispatch) {
        let infos = await api_get_group_members(group_id);
        return infos.payload
    }
}

export function create_group(group_name) {
    return async function() {
        let resp = await api_create_group(group_name);
        return resp.payload
    }
}
export function remove_group(group_id) {
    return async function() {
        let resp = await api_remove_group(group_id);
        return resp.payload
    }
}

export function change_group_title(group_id, change_title) {
    return async function() {
        let resp = await api_change_group_title(group_id, change_title);
        return resp.payload
    }
}

export function add_member_group(group_id, email, data_plain) {
    return async function() {
        const possible = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        let passphrase2_length = 32;
        let passphrase2 = "";
        for (let i = 0; i < passphrase2_length; i++)
            passphrase2 += possible.charAt(Math.floor(Math.random() * possible.length));
        let key = hmac_sha256("", Buffer.from(email+passphrase2));
        let data_plain_buffered = Buffer.from(JSON.stringify({company_name: "company name", duns_number: "duns", company_ceo: "company_ceo", company_address: "addr"}));
        let data = Buffer.from((await aes_encrypt_async(data_plain_buffered, key)), 'binary').toString('hex');

        let resp = await api_add_member_group(group_id, email, passphrase2, data);
        return resp.payload
    }
}
export function remove_member_group(group_id, account_id) {
    return async function() {
        let resp = await api_remove_member_group(group_id, account_id);
        return resp.payload
    }
}

export function remove_invite_group(group_id, invite_id) {
    return async function() {
        let resp = await api_remove_invite_group(group_id, invite_id);
        return resp.payload
    }
}

export function invite_information(email, registration_code) {
    return async function(){
        let info = (await api_invite_information(registration_code)).payload;
        if (!info) return null;
        let email_hashed = md5(email+info.passphrase1);
        try {
            let passphrase2 = (await aes_decrypt_async(Buffer.from(info.encrypted_passphrase2, 'hex'), email_hashed));
            let key = hmac_sha256("", Buffer.from(email+passphrase2));
            let data = JSON.parse(await aes_decrypt_async(Buffer.from(info.encrypted_data, 'hex'), key));
            return data;
        } catch(e) {
            return null;
        }
    }
}

export function new_corp(data) {
    return async function() {
        let resp = await api_new_corp(data);
        return resp.payload;
    }
}

