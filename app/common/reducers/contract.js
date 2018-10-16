import {
    LOAD_FODLERS,
    LOAD_RECENTLY_CONTRACTS
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
            case LOAD_RECENTLY_CONTRACTS:
                return {
                    ...state,
                    recently: action.payload
                }
          default:
              return state;
      }
  }