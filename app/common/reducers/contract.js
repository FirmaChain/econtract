import {
    LOAD_FODLERS,
    GET_CONTRACTS
} from '../actions';

let _ = {
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
          default:
              return state;
      }
  }