import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import SignerSlot from "./signer-slot"
import history from '../history';
import pdfjsLib from "pdfjs-dist"
import translate from "../../common/translate"
import {
    fetch_user_info,
    list_template,
    select_userinfo_with_email
} from "../../common/actions"
import CheckBox2 from "./checkbox2"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    fetch_user_info,
    list_template,
    select_userinfo_with_email
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
        super();
        this.roles = [
            "생성자",
            "서명자",
            "참관"
        ]
		this.state={
            target_list:[],
            indivisual:[{
                deletable:false,
                title:"성함",
                force:true
            },{
                deletable:false,
                title:"이메일",
                force:true
            },{
                deletable:false,
                title:"주소",
                force:true
            },{
                deletable:false,
                title:"휴대폰 번호",
                checked:false
            },{
                deletable:false,
                title:"주민등록 번호",
                checked:false
            }],
            cooperation:[{
                deletable:false,
                title:"기업명",
                force:true
            },{
                deletable:false,
                title:"사업자등록번호",
                force:true
            },{
                deletable:false,
                title:"주소",
                force:true
            },{
                deletable:false,
                title:"대표자 성함",
                checked:false
            },{
                deletable:false,
                title:"담당자 성함",
                checked:false
            },{
                deletable:false,
                title:"담당자 성함",
                checked:false
            },{
                deletable:false,
                title:"담당자 이메일",
                checked:false
            },{
                deletable:false,
                title:"담당자 휴대전화",
                checked:false
            }]
        };
	}

	componentDidMount(){
        (async()=>{
            let user = await this.props.fetch_user_info();
            this.setState({
                template_list:await this.props.list_template(),
                target_list:[{
                    username:user.username,
                    email:user.email,
                    role:0
                }]
            })
        })()
    }

    componentWillUnmount(){
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }
    }

    onClickBack = ()=>{
        history.goBack();
    }

    onClickAdd = async()=>{
        if(!this.state.add_email)
            return alert("이메일을 입력해주세요.")
        if(!this.state.add_role)
            return alert("룰을 선택해주세요.")

        let resp = await this.props.select_userinfo_with_email(this.state.add_email)

        if(resp){
            this.setState({
                target_list:[...this.state.target_list, {
                    username:resp.username,
                    email:resp.email,
                    role:this.state.add_role
                }],
                add_email:""
            })
        }else{
            return alert("이메일에 일치하는 가입자가 없습니다.")
        }
    }

    onToggleSignInfo = (name, k)=>{
        this.state[name][k].checked = !this.state[name][k].checked;
        this.setState({
            [name]:[...this.state[name]]
        })
    }

    onClickAddCooperation = ()=>{
        if(!this.state.add_cooperation_info){
            return alert("항목의 이름을 입력해주세요.")
        }

        this.setState({
            cooperation:[...this.state.cooperation,{
                title:this.state.add_cooperation_info,
                checked:false,
                deletable:true
            }],
            add_cooperation_info:""
        })
    }

    onClickRegist = ()=>{
        let contract_name = this.state.contract_name;
        let sign_target_me = !!this.state.target_me
        let sign_target_other = !!this.state.target_other
        let counterparties = this.state.target_list
        let indivisual_info = this.state.indivisual.filter(e=>e.force||e.checked).map(e=>e.title)
        let cooperation_info = this.state.cooperation.filter(e=>e.force||e.checked).map(e=>e.title)

        console.log(
            contract_name,
            sign_target_me,
            sign_target_other,
            counterparties,
            indivisual_info,
            cooperation_info,
        )
    }

    onClickAddIndivisual = ()=>{
        if(!this.state.add_indivisual_info){
            return alert("항목의 이름을 입력해주세요.")
        }

        this.setState({
            indivisual:[...this.state.indivisual,{
                title:this.state.add_indivisual_info,
                checked:false,
                deletable:true
            }],
            add_indivisual_info:""
        })
    }

    onClickRemoveCounterparty = (k)=>{
        this.state.target_list.splice(k,1)
        this.setState({
            target_list:[]
        })
    }

    onClickRemoveSignInfo = (name, k)=>{
        this.state[name].splice(k,1);
        this.setState({
            [name]:[...this.state[name]]
        })

    }

	render() {
        if(!this.props.user_info)
            return <div></div>

        return (<div className="default-page add-contract-page">
            <div className="header">
                <div className="close" onClick={this.onClickBack}>
                    <i className="fas fa-times"></i>
                </div>
                <div className="title">계약서</div>
                <div className="profile">
                    <div>{this.props.user_info.username}</div>
                    <div>{this.props.user_info.email}</div>
                </div>
            </div>
            <div className="content">
                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">계약명 입력</div>
                        <div className="desc-content">해당 계약명을 입력해주세요</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">계약명</div>
                            <div className="form-input"><input type="text" value={this.state.contract_name || ""} onChange={e=>this.setState({contract_name:e.target.value})}/></div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">서명 대상</div>
                        <div className="desc-content">계약에 서명하는 대상에 본인 포함 여부를 선택할 수 있습니다</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">서명 대상</div>
                            <div className="form-input">
                                <CheckBox2 on={this.state.target_me} onClick={()=>this.setState({target_me:!this.state.target_me})}/> 본인({this.props.user_info.username})
                                <CheckBox2 on={this.state.target_other} onClick={()=>this.setState({target_other:!this.state.target_other})}/> 타 서명자
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">서명자 추가</div>
                        <div className="desc-content">계약에 서명할 사용자를 추가합니다</div>
                        <div className="desc-link">서비스 미가입자도 서명할 수 있나요?</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">서명자 이메일</div>
                            <div className="form-input">
                                <input type="text" value={this.state.add_email || ""} onChange={e=>this.setState({add_email:e.target.value})}/>
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-head">서명자 역할</div>
                            <div className="form-input">
                                <select onChange={e=>this.setState({add_role:e.target.value})}>
                                    <option value="">선택</option>
                                    {this.roles.map((e,k)=>{
                                        if(k == 0)return null
                                        return <option value={k}>{e}</option>
                                    })}
                                </select>
                                <button onClick={this.onClickAdd}>추가</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="left-desc">
                    </div>

                    <div className="right-form">
                        <table>
                            <tr>
                                <th>이름</th>
                                <th>이메일</th>
                                <th>역할</th>
                                <th></th>
                            </tr>
                            {this.state.target_list.map((e,k)=>{
                                return <tr key={k}>
                                    <td>{e.username}</td>
                                    <td>{e.email}</td>
                                    <td>{this.roles[e.role]}</td>
                                    <td>
                                        {k == 0 ?
                                            null:
                                            <button onClick={this.onClickRemoveCounterparty.bind(this, k)}>삭제</button>
                                        }
                                    </td>
                                </tr>
                            })}
                        </table>
                    </div>
                </div>

                <div className="row">
                    <div className="left-desc">
                        <div className="desc-head">서명 정보</div>
                        <div className="desc-content">전자 서명시 계약에 들어갈 정보들을 선택합니다</div>
                    </div>
                    <div className="right-form">
                        <div className="column">
                            <div className="form-head">개인 서명자 정보</div>
                            <div className="form-input">
                                {this.state.indivisual.map((e,k)=>{
                                    return <div key={k}>
                                        <CheckBox2 on={e.force || e.checked} onClick={this.onToggleSignInfo.bind(this,"indivisual",k)}/>
                                        {e.title}
                                        {e.deletable ? <button onClick={this.onClickRemoveSignInfo.bind(this,"indivisual", k)}>삭제</button> : null}
                                    </div>
                                })}
                                <div>
                                    <input type="text" value={this.state.add_indivisual_info || ""} onChange={e=>this.setState({add_indivisual_info:e.target.value})}/>
                                    <button onClick={this.onClickAddIndivisual}>추가</button>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-head">기업 서명자 정보</div>
                            <div className="form-input">
                                {this.state.cooperation.map((e,k)=>{
                                    return <div key={k}>
                                        <CheckBox2 on={e.force || e.checked} onClick={this.onToggleSignInfo.bind(this,"cooperation",k)}/>
                                        {e.title}
                                        {e.deletable ? <button onClick={this.onClickRemoveSignInfo.bind(this,"cooperation", k)}>삭제</button> : null}
                                    </div>
                                })}
                                <div>
                                    <input type="text" value={this.state.add_cooperation_info || ""} onChange={e=>this.setState({add_cooperation_info:e.target.value})}/>
                                    <button onClick={this.onClickAddCooperation}>추가</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={this.onClickRegist}>등 록</button>
                </div>
            </div>
		</div>);
	}
}
