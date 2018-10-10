import {
    api_request_email_verification
} from "../../../gen_api"

// export const REQUEST_EMAIL ="";

export function request_email_verification_code(email){
    return async function(dispatch){
        let resp = await api_request_email_verification(email)
        console.log(resp)
        return resp.payload;
    }
}