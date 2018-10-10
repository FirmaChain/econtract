// ### WARNING ###
// THIS FILE IS AUTO GENERATED!!
// DO NOT MODIFIY THIS FILE DIRECTLY!!
// ### WARNING ###

import {post, get} from './Network.js';

export async function api_test(){
    return await get("/test", {
        
    });
}
export async function api_request_email_verification(email){
    return await get("/request_email_verification", {
        email
    });
}