import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={};
	}

	componentDidMount(){
	}

	render() {
		return (<div className="default-page login-page">
            <div className="back-key">
                <div className="round-btn"><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
                <h1>로그인</h1>
                <div className="page">
                    <div className="column-300">
                        <div className="form-layout">
                            <div className="form-label"> ID </div>
                            <div className="form-input">
                                <input placeholder="ID를 입력해주세요." />
                            </div>
                            
                            <div className="form-label"> 비밀번호 </div>
                            <div className="form-input">
                                <input placeholder="비밀번호를 입력해주세요." />
                            </div>

                            <div className="form-submit">
                                <button> 다른 계정으로 로그인 </button>
                                <button className="border"> 로그인 </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>);
	}
}