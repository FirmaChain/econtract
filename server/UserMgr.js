const sql = require("./sql")

class UserMgr {
    constructor(io,express){
        this.io = io
        this.express = express

        this.io.set("authorization",this.authorization.bind(this))
    }
    
    async authorization( handshake, accept ){
        accept(null,true)
    }

    registEvent(token,socket){
        // socket.on("room:detail", async (idx)=>{
        //     chatting[idx] = chatting[idx] || []
        //     for(let o of RAW){
        //         if(o.id == idx){
        //             return {
        //                 ...o,
        //                 chat:chatting[idx]
        //             }
        //         }
        //     }
        //     return null
        // })
        socket.on("my:room:list", async ()=>{
            let rooms = await sql.getRooms(token);
            return rooms;
        })
    }
} 

module.exports = UserMgr