import {
	GROUP_HOME_OPEN_GROUP,
	GROUP_HOME_CLOSE_GROUP,
} from '../actions';

let _ = {
	isOpenGroupList:[]
}

export default function (state=_, action){
	switch (action.type) {
		case GROUP_HOME_OPEN_GROUP: {
			let list = [...state.isOpenGroupList]
			for(let i in list) {
				if(list[i] == action.payload) {
					return {...state}
				}
			}
			list.push(action.payload)
			return {
				...state,
				isOpenGroupList:list
			}
		}
		case GROUP_HOME_CLOSE_GROUP: {
			let list = [...state.isOpenGroupList]
			for(let i in list) {
				if(list[i] == action.payload) {
					list.splice(i, 1)
				}
			}
			return {
				...state,
				isOpenGroupList: list
			}
		}
		default:
			return state;
	}
}