import {
    SET_GOOGLE_ACCESSTOKEN,
    SET_USERINFO,
    UPDATE_USERINFO,
    UPDATE_FRIENDINFO
} from '../actions';

export default function loading(state={}, action){
        switch (action.type) {
            case SET_GOOGLE_ACCESSTOKEN:
                return {
                    ...state,
                    platform: "google",
                    access_token : action.payload
                };
            case SET_USERINFO:
                return {
                    ...state,
                    name:action.payload.name,
                    email:action.payload.email,
                }
            case UPDATE_USERINFO:
                return {
                    ...state,
                    phone: action.payload.phone || state.phone
                }

            case UPDATE_FRIENDINFO:
                return {
                    ...state,
                    friend: action.payload.list
                }
          default:
              return state;
      }
  }