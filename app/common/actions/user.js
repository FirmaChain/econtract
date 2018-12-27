import {
    api_request_email_verification,
    api_check_email_verification_code,
    api_request_phone_verification_code,
    api_check_phone_verification_code,
    api_register_account,
    api_login_account,
    api_encrypted_user_info,
    api_find_user_with_code_email,
    api_check_join_publickey,
    api_recover_account,
    api_select_userinfo_with_email,
    api_update_user_info,
    api_update_corp_info,
    api_update_user_public_info,
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
    decrypt_user_info,
    decrypt_corp_info,
    SeedToEthKey,
    getMasterSeed,
    entropyToMnemonic,
} from "../../common/crypto_test"

import Web3 from "../Web3"

// export const REQUEST_EMAIL ="";
export const RELOAD_USERINFO = "RELOAD_USERINFO"
export const SUCCESS_LOGIN = "SUCCESS_LOGIN"

export function fetch_user_info(){
    return async function(dispatch){
        let entropy = sessionStorage.getItem("entropy")
        if(entropy){
            let resp = await api_encrypted_user_info()
            if(resp.payload){
                let user_info = decrypt_user_info(entropy, new Buffer(resp.payload.info.data) )
                let corp_info = {}, public_info = {}
                if(resp.payload.account_type != 0)
                    corp_info = decrypt_corp_info(Buffer.from(user_info.corp_key, 'hex'), new Buffer(resp.payload.corp_info.data) )
                if(!!resp.payload.public_info)
                    public_info = decrypt_corp_info(Buffer.from(user_info.corp_key, 'hex'), new Buffer(resp.payload.public_info.data) )
                let seed = getMasterSeed();
                let keyPair = SeedToEthKey(seed, "0'/0/0");
                let privateKey = "0x"+keyPair.privateKey.toString('hex');

                Web3.addAccount(privateKey)
                let wallet = Web3.walletWithPK(privateKey)
                let _ = {
                    ...user_info,
                    ...corp_info, // It should be removed and the following line is used
                    ...public_info,
                    eth_address: wallet.address,
                    account_id: resp.payload.account_id,
                    publickey_contract: resp.payload.publickey_contract,
                    account_type: resp.payload.account_type,
                }
                dispatch({
                    type:RELOAD_USERINFO,
                    payload:_
                })

                return _;
            }
        }

        dispatch({
            type:RELOAD_USERINFO,
            payload:false
        })
        return false;
    }
}

export function request_email_verification_code(email){
    return async function(dispatch){
        let resp = await api_request_email_verification(email)
        return resp.payload;
    }
}

export function check_email_verification_code(email, code){
    return async function(dispatch){
        let resp = await api_check_email_verification_code(email, code)
        return resp.payload;
    }
}

export function request_phone_verification_code(phone){
    return async function(dispatch){
        let resp = await api_request_phone_verification_code(phone)
        return resp.payload;
    }
}

export function check_phone_verification_code(phone, code){
    return async function(dispatch){
        let resp = await api_check_phone_verification_code(phone, code)
        return resp.payload;
    }
}

export function register_new_account(account, info, email, name, eth, type){
    return async function(dispatch){
        let resp = (await api_register_account(
            account.browserKey.publicKey.toString('hex'),
            account.masterKeyPublic.toString('hex'),
            account.masterKeyPublicContract.toString('hex'),
            info,
            account.auth.toString('hex'),
            account.encryptedMasterSeed,
            email, 
            name, 
            eth,
            type
        )).payload;
        if (type != 0) {
            let auth = account.auth;
            let eems = Buffer.from(account.encryptedMasterSeed, 'hex').toString('base64');
            window.setCookie("session", resp.session, 0.125)
            window.setCookie("session_update", Date.now(), 0.125)
            let entropy = getUserEntropy(auth, eems)
            sessionStorage.setItem("entropy", entropy)
        }
        return resp;
    }
}

export function get_mnemonic(user_id, password){
    return async function(dispatch){

        let nonce = Date.now();
        let auth = makeAuth(user_id, password);
        let sign = makeSignData("FirmaChain Login", auth, nonce);

        let resp = (await api_login_account(
            sign.publicKey.toString('hex'),
            nonce,
            sign.payload
        )).payload

        if(resp.eems){
            window.setCookie("session", resp.session, 0.125)
            window.setCookie("session_update", Date.now(), 0.125)
            return entropyToMnemonic(getUserEntropy(auth, resp.eems))
        } else {
            return false;
        }
    }
}

export function login_account(user_id, password){
    return async function(dispatch){

        let nonce = Date.now();
        let auth = makeAuth(user_id, password);
        let sign = makeSignData("FirmaChain Login", auth, nonce);

        let resp = (await api_login_account(
            sign.publicKey.toString('hex'),
            nonce,
            sign.payload
        ))

        resp = {
            code:resp.code,
            ...resp.payload
        }

        if(resp.eems){
            window.setCookie("session", resp.session, 0.125)
            window.setCookie("session_update", Date.now(), 0.125)

            let entropy = getUserEntropy(auth, resp.eems)
            sessionStorage.setItem("entropy", entropy)
            sessionStorage.setItem("login_id", user_id)
/*
            dispatch({
                type:SUCCESS_LOGIN,
                paylaod:{
                    session: resp.session,
                    entropy: entropy
                }
            })*/
        }

        return resp;
    }
}

export function find_user_with_code_email(code, email){
    return async function(){
        return (await api_find_user_with_code_email(code, email)).payload
    }
}

export function check_join_publickey(publicms){
    return async function(){
        return (await api_check_join_publickey(publicms)).payload
    }
}

export function recover_account(publicbk, publicms, auth, eems, email){
    return async function(){
        return (await api_recover_account(publicbk, publicms, auth, eems, email))
    }
}

export function select_userinfo_with_email(email){
    return async function(){
        return (await api_select_userinfo_with_email(email)).payload
        // return {
        //     email:email,
        //     username:"윤대현"+(Math.floor(Math.random()*30))
        // }
    }
}

export function update_user_info(encrypted_info){
    return async function(){
        return (await api_update_user_info(encrypted_info)).payload
    }
}

export function update_user_public_info(encrypted_info) {
    return async function(){
        return (await api_update_user_public_info(encrypted_info)).payload
    }
}

export function update_corp_info(encrypted_corp_info){
    return async function(){
        return (await api_update_corp_info(encrypted_corp_info)).payload
    }
}

