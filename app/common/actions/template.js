import {
    api_add_template,
    api_remove_template,
    api_get_template,
    api_list_template,
    api_update_template,
} from "../../../gen_api"

import {
    aes_decrypt,
    aes_encrypt,
    generate_random,
} from "../../common/crypto_test"

import { sha256 } from 'js-sha256'

export function list_template(){
    return async function(dispatch){
        let resp = await api_list_template()
        dispatch({
            type:"api_list_template",
            payload:resp.payload
        })
        return resp.payload
    }
}

export function add_template(subject, imgs){
    return async function(dispatch){
        let entropy = sessionStorage.getItem("entropy");
        imgs = imgs.map(e=>aes_encrypt(e,entropy))
        
        let resp = await api_add_template(subject, imgs)
        dispatch({
            type:"api_add_template",
            payload:resp.payload
        })
        return resp.payload
    }
}

export function get_template(template_id){
    return async function(dispatch){
        let entropy = sessionStorage.getItem("entropy");

        let resp = await api_get_template(template_id)
        if(resp.payload.html){
            try{
               resp.payload.html = JSON.parse(aes_decrypt(resp.payload.html,entropy))
            }catch(err){
            }
        }

        resp.payload.html = resp.payload.html || []

        for(let k in resp.payload.imgs){
            let bin = await fetch(`${window.HOST}/${resp.payload.imgs[k]}`,{encoding:null})
            resp.payload.imgs[k] = aes_decrypt(await bin.text(),entropy)
        }
        console.log(resp.payload)

        dispatch({
            type:"api_get_template",
            payload:resp.payload
        })
        return resp.payload
    }
}

export function update_template(template_id, html){
    return async function(dispatch){
        let entropy = sessionStorage.getItem("entropy");
        html = aes_encrypt(JSON.stringify(html),entropy)

        let resp = await api_update_template(template_id, html)
        dispatch({
            type:"api_update_template",
            payload:resp.payload
        })

        return resp.payload
    }
}

export function remove_template(template_ids){
    return async function(dispatch){
        let resp = await api_remove_template(JSON.stringify(template_ids))
        dispatch({
            type:"api_remove_template",
            payload:resp.payload
        })

        return resp.payload
    }
}
