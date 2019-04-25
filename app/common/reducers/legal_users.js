import {
    LEGAL_SUCCESS_LOGIN,
    LEGAL_RELOAD_USERINFO
} from '../actions';

let _ = {
    info:null
}

export default function (state=_, action){
        switch (action.type) {
            case LEGAL_SUCCESS_LOGIN:
                return {
                    ...state,
                    login: action.payload
                }
            case LEGAL_RELOAD_USERINFO:
                return {
                    ...state,
                    info: action.payload
                }
          default:
              return state;
      }
  }