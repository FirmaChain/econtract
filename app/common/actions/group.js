import {
    api_invite_sub_account,
    api_invite_information,
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

export function invite_sub_account(group_id, email, data_plain) {
    return async function(){
        const possible = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        let passphrase2_length = 32;
        let passphrase2 = "";
        for (let i = 0; i < passphrase2_length; i++)
          passphrase2 += possible.charAt(Math.floor(Math.random() * possible.length));
        let key = hmac_sha256("", Buffer.from(email+passphrase2));
        let data_plain_buffered = Buffer.from(JSON.stringify({company_name: "company name", duns_number: "duns", company_ceo: "company_ceo", company_address: "addr"}));
        let data = Buffer.from((await aes_encrypt_async(data_plain_buffered, key)), 'binary').toString('hex');
        return (await api_invite_sub_account(group_id,email,passphrase2,data)).payload;
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

