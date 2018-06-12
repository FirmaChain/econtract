import { combineReducers } from 'redux';
import test from "./test"
import room from "./room"

export default function createStore(reducers){
    return combineReducers({
        test,
        room,
        ...reducers
    })
}
