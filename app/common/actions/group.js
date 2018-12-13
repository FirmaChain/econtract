import {
    api_invite_sub_account,
} from "../../../gen_api"

import Web3 from "../Web3"

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

// TODO: Separate corp user actions
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