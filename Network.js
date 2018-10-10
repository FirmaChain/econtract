let HOST = "http://127.0.0.1:6544";

export async function get(path,param={}){
    param = Object.keys(param).map(i=>`${encodeURIComponent(i)}=${encodeURIComponent(param[i])}`)
    try{
        let resp = await fetch(`${HOST}${path}${param.length > 0 ? `?${param.join("&")}` : ''}`,{
            method:"GET"
        })
        let blob = await resp.text()

        try{
            return JSON.parse(blob)
        }catch(err){
            return blob
        }
    }catch(err){
        console.log(err)
    }
    return null
}

export async function post(path,param={}){
    try{
        let isFormdata = param instanceof FormData
        console.log(path,param,isFormdata)
        let resp = await fetch(`${HOST}${path}`,{
            method:"POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': isFormdata ? 'multipart/form-data' : 'application/json'
            },
            body:param ? ( isFormdata ? param : JSON.stringify(param)) : null
        })

        let blob = await resp.text()

        try{
            return JSON.parse(blob)
        }catch(err){
        }

        return blob
    }catch(err){
        console.log(err)
    }
}