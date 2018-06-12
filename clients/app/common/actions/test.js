export const TEST_ACTION = "SYNC_ACTION"
export const AJAX_TEST_ACTION = "AJAX_TEST_ACTION"

export function TestAction(){
	return async function (dispatch){
        dispatch({type:TEST_ACTION})
	}
}

export function AjaxTestAction(){
	return async function (dispatch){
        setTimeout(()=>{
            dispatch({type:AJAX_TEST_ACTION})
        },500)
	}
}
