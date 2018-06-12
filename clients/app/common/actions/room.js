import Network from "../Network"
import actions from "./creator"

export const MY_ROOM_LIST = "MY_ROOM_LIST"
export const ROOM_DETAIL = "ROOM_DETAIL"

export let MyRoomList = actions( MY_ROOM_LIST, async()=>{
    console.log("emit~~~")
    return await Network.get().emit("my:room:list")
})
 
export let RoomDetail = actions( ROOM_DETAIL, async (idx)=>{
    return await Network.get().emit("room:detail", idx )
})