import {
    api_get_subscribe_plan,
} from "../../../gen_api"

export const GET_CONTRACTS = "GET_CONTRACTS";
export const FOLDER_LIST_CONTRACT = "FOLDER_LIST_CONTRACT";
const DUMMY_CORP_ID = 0;

export function get_subscribe_plan(){
    return async function(){
        return (await api_get_subscribe_plan());
    };
}

