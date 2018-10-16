import { combineReducers } from 'redux';
import user from "./user"
import document from "./document"
import contract from "./contract"

export default function createStore(reducers){
    return combineReducers({
        user,
        document,
        contract,
        ...reducers
    })
}
