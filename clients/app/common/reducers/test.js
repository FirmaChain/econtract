import {
    TEST_ACTION,
    AJAX_TEST_ACTION,
} from '../actions';

export default function loading(state={}, action){
        switch (action.type) {
          case TEST_ACTION:
              return {
                  ...state,
                  v:!state.v,
              };
          case AJAX_TEST_ACTION:
              return {
                  ...state,
                  c:!state.c,
              };
          default:
              return state;
      }
  }