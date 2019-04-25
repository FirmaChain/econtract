import {
    LEGAL_SUCCESS_LOGIN,
    LEGAL_RELOAD_USERINFO
} from '../legal_actions';

let _ = {
    info:false
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