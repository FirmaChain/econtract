import {
    api_new_contract
} from "../../../gen_api"

import {
    getUserEntropy,
    makeAuth,
    makeSignData,
    decrypt_user_info,
} from "../../common/crypto_test"

import Web3 from "../Web3"

export function new_contract( subject, imgs, counterparties ){
    return async function(){
        return await api_new_contract( subject, imgs, counterparties.map(e=>JSON.stringify(e)) )
    }
}