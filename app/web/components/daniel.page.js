import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import CheckBox2 from "./checkbox2"
import translate from "../../common/translate"
import Pager from "./pager"
import history from '../history';
import moment from "moment"
import queryString from "query-string"


import {
    get_daniel_list,
    get_daniel_count,
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = {
    get_daniel_list,
    get_daniel_count,
}

const LIST_DISPLAY_COUNT = 6

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
        }
	}

	componentDidMount(){
        (async()=>{
            await window.showIndicator()
            let list = await this.props.get_daniel_list();
            let count = await this.props.get_daniel_count();
            console.log(list)
            console.log(count)
            await window.hideIndicator()
        })()
    }

	render() {
        return <div>
            
        </div>
	}
}
