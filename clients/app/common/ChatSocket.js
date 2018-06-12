import Network from "../common/Network"

export default function handshake_network(){
    return new Promise((r)=>{
        Network.init();
        let io = Network.get()

        io.on("handshake:get:token",async()=>{
            let token = window.localStorage.getItem("handshake-token");
            return token
        })

        io.on("handshake:set:token",async(data)=>{
            window.localStorage.setItem("handshake-token",data);
            return true;
        })

        io.on("handshake:fin",function(){
            init_handler(io)
            r()
        })
    })
}
    
function init_handler(io){
    io.on("~~",console.log)
}