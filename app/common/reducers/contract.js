import {
    LOAD_FODLERS,
    LOAD_CONTRACT_LIST
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
            case LOAD_CONTRACT_LIST:
                return {
                    ...state,
                    board: action.payload
                }
          default:
              return state;
      }
  }