import {
    api_legal_register,
    api_legal_login,
    api_legal_get_my_info,
} from "../../../gen_api"

export const LEGAL_RELOAD_USERINFO = "LEGAL_RELOAD_USERINFO"
export const LEGAL_SUCCESS_LOGIN = "LEGAL_SUCCESS_LOGIN"


export function get_my_info() {
	return async function(dispatch) {

		let result = await api_legal_get_my_info();
		
        dispatch({
            type:LEGAL_RELOAD_USERINFO,
            payload:result.payload
        })

        return result;
	}
}

export function legal_register(email, password, phone_number, verification_number) {
	return async function(dispatch) {
		return await api_legal_register(email, password, phone_number, verification_number);
	}
}


export function login_account(email, password, continue_login = false){
    return async function(dispatch){

        let resp = await api_legal_login(email, password)

        if(resp.code == 1){
            if(continue_login) {
                window.setCookie("session", resp.payload.session, 60)
                window.setCookie("session_update", Date.now(), 60)
            } else {
                window.setCookie("session", resp.payload.session)
                window.setCookie("session_update", Date.now())
            }
            
			let result = await api_legal_get_my_info();
			
		    dispatch({
		        type:LEGAL_RELOAD_USERINFO,
		        payload:result.payload
		    })

            /*dispatch({
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