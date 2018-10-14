import {
    api_request_email_verification,
    api_check_email_verification_code,
    api_request_phone_verification_code,
    api_check_phone_verification_code,
    api_regist_account,
    api_login_account,
    api_encrypted_user_info,
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
    decrypt_user_info,
} from "../../common/crypto_test"

// export const REQUEST_EMAIL ="";
export const RELOAD_USERINFO = "RELOAD_USERINFO"
export const SUCCESS_LOGIN = "SUCCESS_LOGIN"

export function fetch_user_info(){
    return async function(dispatch){
        let entropy = sessionStorage.getItem("entropy")
        if(entropy){
            let resp = await api_encrypted_user_info()
            if(resp.payload){
                let user_info = decrypt_user_info(entropy, new Buffer(resp.payload.data) )

                dispatch({
                    type:RELOAD_USERINFO,
                    payload:user_info
                })

                return true;
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

export function regist_new_account(account, info, email){
    return async function(dispatch){
        return (await api_regist_account(
            account.browserKey.publicKey.toString('hex'),
            account.masterKeyPublic.toString('hex'),
            info,
            account.auth.toString('hex'),
            account.encryptedMasterSeed,
            email
        )).payload
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
        )).payload

        if(resp.eems){
            window.setCookie("session", resp.session, 365)

            let entropy = getUserEntropy(auth, resp.eems)
            sessionStorage.setItem("entropy", entropy)

            dispatch({
                type:SUCCESS_LOGIN,
                paylaod:{
                    session: resp.session,
                    entropy: entropy
                }
            })
        }

        return resp;
    }
}