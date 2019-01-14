import _ from './text.json'

export default function(ID, params = []){
    if(_[ID] == null)
        return ID + " is null"
    let language = 0
    switch(global.LANG) {
        case "KR":
            language = 0
            break;
        case "EN":
            language = 1
            break;
        case "CN":
            language = 2
            break;
    }
    let text = _[ID][language]
    text = text.replace(/\\\\n/, '\\n')
    params.map( (e, k) => {
        let regex = new RegExp(`\\{${k}\\}`, "g")
        text = text.replace(regex, e)
    })
    return text 
}