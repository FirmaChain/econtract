import {
    MY_ROOM_LIST,
    ROOM_DETAIL
} from '../actions';

let initialState={
    roomList : null,
    roomInfo : null
}

export default function room(state=initialState, action){
    switch (action.type) {
        case MY_ROOM_LIST:
            return {
                ...state,
                roomList:action.payload
            };
        case ROOM_DETAIL:
            return {
                ...state,
                roomInfo:action.payload
            };
        default:
            return state;
    }
}