import { combineReducers } from 'redux';
import user from "./user"
import document from "./document"

export default function createStore(reducers){
    return combineReducers({
        user,
        document,
        ...reducers
    })
}
