import {
    api_get_subscribe_plan,
    api_get_current_subscription,
    api_get_current_onetime_ticket,
    api_get_current_total_ticket,
    api_input_payment_info,
} from "../../../gen_api"

export function get_subscribe_plan(){
    return async function(){
        return (await api_get_subscribe_plan()).payload;
    };
}

export function get_current_subscription(){
    return async function(){
        return (await api_get_current_subscription()).payload;
    };
}

export function get_current_onetime_ticket(){
    return async function(){
        return (await api_get_current_onetime_ticket()).payload;
    };
}

export function get_current_total_ticket(){
    return async function(){
        return (await api_get_current_total_ticket()).payload;
    };
}

export function input_payment_info(data, preview_data){
    return async function(){
        return (await api_input_payment_info(data, preview_data)).payload;
    };
}

