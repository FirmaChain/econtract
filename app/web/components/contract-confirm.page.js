import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import {
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user:state.user.info
	}
}

let mapDispatchToProps = {
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
        };
	}

	componentDidMount(){
    }

    componentWillUnmount(){
    }

	render() {
        return (<div className="default-page confirm-contract-page">
            <div className="back-key" onClick={()=>history.goBack()}>
                <div className="round-btn"><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
                <h1>계약 상세보기</h1>
                <div className="page">
                    <div className="column-300">
                        <div className="form-layout">
                            <div className="form-label"> 계약명 </div>
                            <div className="form-info">
                                ㅁㅁㄴㅁㄴㅇㅁㄴㅇ
                            </div>

                            <div className="form-label"> 계약 상태 </div>
                            <div className="form-info">
                                ㅁㅁㄴㅁㄴㅇㅁㄴㅇ
                            </div>

                            <div className="form-label"> 계약 등록일자 </div>
                            <div className="form-info">
                                ㅁㅁㄴㅁㄴㅇㅁㄴㅇ
                            </div>

                            <div className="form-label"> 계약 PIN </div>
                            <div className="form-info">
                                ㅁㅁㄴㅁㄴㅇㅁㄴㅇ
                            </div>
                        </div>
                    </div>
                    <div className="column-300">
                        <div className="form-layout">

                            <div className="form-label"> 계약명 </div>
                            <div className="form-info">
                                ㅁㅁㄴㅁㄴㅇㅁㄴㅇ
                            </div>
                            <div className="form-label"> 계약명 </div>
                            <div className="form-info">
                                ㅁㅁㄴㅁㄴㅇㅁㄴㅇ
                            </div>
                            <div className="form-label"> 계약명 </div>
                            <div className="form-info">
                                ㅁㅁㄴㅁㄴㅇㅁㄴㅇ
                            </div>
                        </div>
                    </div>
                    <div className="column-300">
                        <div className="form-layout">
                            <div className="form-label"> 계약명 </div>
                            <div className="form-info">
                                ㅁㅁㄴㅁㄴㅇㅁㄴㅇ
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>);
	}
}