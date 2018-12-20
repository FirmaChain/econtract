import { combineReducers } from 'redux';
import user from "./user"
import document from "./document"
import contract from "./contract"
import group from "./group"
import template from "./template"

export default function createStore(reducers){
    return combineReducers({
        user,
        document,
        contract,
        group,
        template,
        ...reducers
    })
}
