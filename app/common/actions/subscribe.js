import {
    api_get_subscribe_plan,
} from "../../../gen_api"

export function get_subscribe_plan(){
    return async function(){
        return (await api_get_subscribe_plan()).payload;
    };
}

