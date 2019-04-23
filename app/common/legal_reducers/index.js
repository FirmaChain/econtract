import { combineReducers } from 'redux';
import user from "./user"

export default function createStore(reducers){
    return combineReducers({
        user,
        ...reducers
    })
}
