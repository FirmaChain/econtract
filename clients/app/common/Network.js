import IO from 'socket.io-client';

export default class Network{
    static singletone = null
    constructor(host="localhost",port="3000",protocol = "http",opt={}){
        this.io = IO(`${protocol}://${host}:${port}`,{
            ...opt
        })

        

    }

    static init(host,port,protocol,opt){
        if(Network.singletone == null){
            Network.singletone = new Network(host, port, protocol, opt);
        }
        return Network.singletone
    }

    static get(){
        return Network.singletone;
    }

    on(msg,func){
        this.io.on(msg,async function(data,ack){
            let ret = await func(data)
            ack && ack(ret)
        })
    }

    async emit(msg,data){
        return new Promise((resolve)=>{
            this.io.emit(msg,data,resolve)
        })
    }
}