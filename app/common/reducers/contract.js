import {
    LOAD_FODLERS,
    GET_CONTRACTS,
    FOLDER_LIST_CONTRACT,
} from '../actions';

let _ = {
  folders:[]
}

export default function (state=_, action){
        switch (action.type) {
            case LOAD_FODLERS:
                return {
                    ...state,
                    folders: action.payload
                }
            case GET_CONTRACTS:
                return {
                    ...state,
                    contracts: action.payload
                }
            case FOLDER_LIST_CONTRACT:
                return {
                    ...state,
                    folders: action.payload
                }
          default:
              return state;
      }
  }