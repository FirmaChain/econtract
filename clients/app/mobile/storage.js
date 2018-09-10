import { Platform } from 'react-native';
import AndroidAsyncStorage from 'react-native-safe-async-storage-af'
import { AsyncStorage } from 'react-native';

let PlatformStorage
if(Platform.OS == "android") {
    PlatformStorage = AndroidAsyncStorage
} else {
    PlatformStorage = AsyncStorage
}


window.Storage = {
    setItem:async (k,v)=>{
        if(Platform.OS == "android") {
            await PlatformStorage.setItem([k, JSON.stringify(v)])
        } else {
            await PlatformStorage.setItem(k, JSON.stringify(v))
        }
    },
    getItem:async (k, defaultValue = null)=>{
        let v
        try {
            v = await PlatformStorage.getItem(k) || defaultValue
        } catch(Err) {
            v = defaultValue
        }
        
        try{
            return JSON.parse(v)
        }catch(Err){
        }
        return v
    },
    appendItem:async (k,v,chk)=>{
        let _ = await window.Storage.getItem(k, []);
        console.log(k,v,chk,_)
        if(chk){
            for(let o of _){
                if(chk(o) == false)
                    return _
            }
        }
        
        _.push(v)
        await window.Storage.setItem(k, _)

        return _
    },
    removeItem:async (k,func)=>{
        let _ = await window.Storage.getItem(k, []);

        let __ = []
        
        for(let o of _) {
            if(!func(o)) {
                __.push(o)
            }
        }

        await window.Storage.setItem(k, __)

        return _
    },

    changeItem:async (k,func)=>{
        let _ = await window.Storage.getItem(k, []);

        for(let i in _) {
            let ret = func(_[i])
            if(ret)
                _[i] = ret
        }

        await window.Storage.setItem(k, _)
        
        return _
    }
}



