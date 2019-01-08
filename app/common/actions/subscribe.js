import {
    api_get_subscribe_plan,
    api_get_current_regular_subscription,
    api_get_current_onetime_ticket,
    api_get_current_ticket,
} from "../../../gen_api"

export function get_subscribe_plan(){
    return async function(){
        return (await api_get_subscribe_plan()).payload;
    };
}

export function get_current_regular_subscription(){
    return async function(){
        return (await api_get_current_regular_subscription()).payload;
    };
}

export function get_current_onetime_ticket(){
    return async function(){
        return (await api_get_current_onetime_ticket()).payload;
    };
}

export function get_current_ticket(){
    return async function(){
        return (await api_get_current_ticket()).payload;
    };
}

