import {
    api_request_email_verification,
    api_check_email_verification_code,
    api_request_phone_verification_code,
    api_check_phone_verification_code,
    api_regist_account,
    api_login_account,
} from "../../../gen_api"

// export const REQUEST_EMAIL ="";

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

export function login_account(publicbk,nonce,sign){
    return async function(dispatch){
        return (await api_login_account(
            publicbk.toString('hex'),
            nonce,
            sign
        )).payload
    }
}