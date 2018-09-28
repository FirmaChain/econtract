import Web3 from "../Web3"

export const SET_GOOGLE_ACCESSTOKEN = "SET_GOOGLE_ACCESSTOKEN"
export const SET_USERINFO = "SET_USERINFO"
export const UPDATE_USERINFO = "UPDATE_USERINFO"
export const UPDATE_FRIENDINFO = "UPDATE_FRIENDINFO"

export function TryGoogleLogin(token){
	return async function (dispatch){
        const user = await window.googleSignin();
        dispatch({type:SET_GOOGLE_ACCESSTOKEN, payload:user.accessToken})
	}
}

export function TryGoogleAccessToken(token){
	return async function (dispatch){
        const user = await window.googleSignInSilently();
        if(user){
            dispatch({type:SET_GOOGLE_ACCESSTOKEN, payload:user.accessToken})
            dispatch({type:SET_USERINFO, payload:{
                name:`${user.user.name}`,
                email:`${user.user.email}`
            }})
        }
	}
}

export function SaveUserInfo(data){
    return async function (dispatch){
        let wallets = await window.Storage.getItem("wallets", [])
        wallets.push(data.pk)

        await window.Storage.setItem("wallets", wallets)
        await window.Storage.setItem("phone", data.phone)
        
        dispatch({type:UPDATE_USERINFO, payload:{
            phone:data.phone
        }})
	}
}

export function SaveCounterpartyOnDeeplink(raw){
    return async function (dispatch){
        let data = decodeURIComponent(escape(atob( raw )));

        let arr = data.split("/")
        let name = arr[0]
        let email = arr[1]
        let ether = arr[2]

        let ret = await window.Storage.appendItem("friends", {
            name:name,
            email:email,
            ether:ether
        },function(e){
            return true
        })

        dispatch({type:UPDATE_FRIENDINFO, payload:{
            list:ret
        }})
    }
}

export function SaveCounterparty(data) {
    return async function (dispatch){
        let name = data.name
        let email = data.email
        let ether = data.ether

        let ret = await window.Storage.appendItem("friends", {
            name:name,
            email:email,
            ether:ether
        },function(e){
            return true
        })

        dispatch({type:UPDATE_FRIENDINFO, payload:{
            list:ret
        }})
    }
}

export function ModifyCounterparty(prevData, changeData) {
    return async function (dispatch) {
        let ret = await window.Storage.changeItem("friends", function(o) {
            if(o.name == prevData.name &&
                o.email == prevData.email &&
                o.ether == prevData.ether) {
                return {
                    name :changeData.name,
                    email :changeData.email,
                    ether :changeData.ether
                }
            }
            return false
        })

        dispatch({type:UPDATE_FRIENDINFO, payload:{
            list:ret
        }})
    }
}

export function UpdateFriendInfo(){
    return async function (dispatch){
        dispatch({type:UPDATE_FRIENDINFO, payload:{
            list:await window.Storage.getItem("friends", [])
        }})
    }
}

export function LoadUserInfo(){
    return async function (dispatch){
        let wallets = await window.Storage.getItem("wallets", [])
        
        for(let w of wallets){
            Web3.addAccount(w);
        }
        
        let phone = await window.Storage.getItem("phone", "")
        dispatch({type:UPDATE_USERINFO, payload: {
            phone:phone
        }})
	}
}