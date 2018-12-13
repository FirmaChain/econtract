export const GROUP_HOME_OPEN_GROUP = "GROUP_HOME_OPEN_GROUP"
export const GROUP_HOME_CLOSE_GROUP = "GROUP_HOME_CLOSE_GROUP"

export function openGroup(group_id){
	return async function (dispatch){
		dispatch({ type:GROUP_HOME_OPEN_GROUP, payload:group_id })
	}
}

export function closeGroup(group_id){
	return async function (dispatch){
		dispatch({ type:GROUP_HOME_CLOSE_GROUP, payload:group_id })
	}
}
