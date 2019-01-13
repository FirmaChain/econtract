import {
    api_get_subscribe_plan,
    api_get_current_subscription,
    api_get_current_onetime_ticket,
    api_get_current_total_ticket,
    api_input_payment_info,
    api_get_payment_info,
    api_select_subscription_plan,
    api_make_yearly_commitment,
    api_make_monthly_commitment,
    api_increase_account,
    api_get_payment_log,
    api_get_current_subscription_payment,
    api_get_maximum_member_count,
} from "../../../gen_api"

export function get_subscribe_plan(){
    return async function(){
        return (await api_get_subscribe_plan())
    };
}

export function get_current_subscription(){
    return async function(){
        return (await api_get_current_subscription())
    };
}

export function get_current_onetime_ticket(){
    return async function(){
        return (await api_get_current_onetime_ticket())
    };
}

export function get_current_total_ticket(){
    return async function(){
        return (await api_get_current_total_ticket())
    };
}

export function input_payment_info(data, preview_data){
    return async function(){
        return (await api_input_payment_info(data, preview_data));
    };
}

export function get_payment_info(){
    return async function(){
        return (await api_get_payment_info())
    };
}

export function get_payment_log(){
    return async function(){
        return (await api_get_payment_log())
    };
}

export function select_subscription_plan(plan_id) {
    return async function(){
        return (await api_select_subscription_plan(plan_id))
    };
}

export function make_yearly_commitment(plan_id) {
    return async function(){
        return (await api_make_yearly_commitment(plan_id))
    };
}

export function make_monthly_commitment(plan_id) {
    return async function(){
        return (await api_make_monthly_commitment(plan_id))
    };
}

export function increase_account(account_count){
    return async function(){
        return (await api_increase_account(account_count));
    };
}

export function get_current_subscription_payment(){
    return async function(){
        return (await api_get_current_subscription_payment());
    };
}

export function get_maximum_member_count(){
    return async function(){
        return (await api_get_maximum_member_count());
    };
}

