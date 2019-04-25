import {
    api_legal_register,
} from "../../../gen_api"

export const RELOAD_USERINFO = "RELOAD_USERINFO"
export const SUCCESS_LOGIN = "SUCCESS_LOGIN"


export function fetch_user_info() {
	return async function(dispatch) {
		
	}
}

export function legal_register(email, password, phone_number, verification_number) {
	return async function(dispatch) {
		return await api_legal_register(email, password, phone_number, verification_number);
	}
}
