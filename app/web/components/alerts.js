import React from "react"
import ReactDOM from "react-dom"
import {modal} from "./modalmanager"
import SignerSlot from "./signer-slot"
import history from '../history';
import translate from "../../common/translate"
import moment from "moment"

import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'
/*
@modal
class AddFolder extends React.Component{
    constructor(){
        super()
        this.state = {}
    }
    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClick = ()=>{
        if(!this.state.name)
            return alert("폴더 이름을 입력해주세요!")

        this.props.onClick && this.props.onClick( this.state.name )
        this.closeSelf()
    }

    render(){
        return <div className="default-modal">
            <div className="contents">
                <div className="title">폴더 추가</div>
                <div className="form-label">폴더 이름</div>
                <div className="form-input">
                    <input type="text" placeholder="폴더이름을 입력해주세요" value={this.state.name || ""} onChange={e=>this.setState({name:e.target.value})} />
                </div>
            </div>
            <div className="buttons">
                <button onClick={this.onClick}>확인</button>
                <button onClick={this.closeSelf}>취소</button>
            </div>
        </div>
    }
}*/

@modal
class AddCommonModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text:""
        }
    }

    componentDidMount() {
        this.setState({
            text: this.props.text || ""
        })
    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    onConfirm = () => {
        this.props.onConfirm && this.props.onConfirm(this.state.text.trim())
        this.closeSelf()
    }

    render() {
        let cancelable = this.props.cancelable == undefined ? true : this.props.cancelable
        return <div className="add-common-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className={this.props.icon}></i></div>
                <div className="title">{this.props.title}</div>
                <div className="text-box">
                    <div className="sub-title">{this.props.subTitle}</div>
                    <input type="text" className="common-textbox"
                        onChange={(e)=>this.setState({text:e.target.value})}
                        value={this.state.text}
                        placeholder={this.props.placeholder}/>
                </div>
                <div className="button">
                    <div className="confirm" onClick={this.onConfirm}>{this.props.confirmText || "생성"}</div>
                    { cancelable ? <div className="cancel" onClick={this.closeSelf}>취소</div> : null }
                </div>
            </div>
        </div>
    }
}

@modal
class RemoveCommonModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    onDelete = () => {
        this.props.onDelete && this.props.onDelete()
        this.closeSelf()
    }

    render() {
        return <div className="remove-common-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className={this.props.icon}></i></div>
                <div className="title">{this.props.title}</div>
                <div className="sub-title" dangerouslySetInnerHTML={{__html:this.props.subTitle}}>
                </div>
                <div className="button">
                    <div className="confirm" onClick={this.onDelete}>{this.props.deleteText || "삭제"}</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class OneAddModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    onConfirm = (e) => {
        this.props.onConfirm && this.props.onConfirm(e)
        this.closeSelf();
    }

    onCancel = () => {
        this.props.onCancel && this.props.onCancel()
        this.closeSelf()
    }

    render() {
        return <div className="one-add-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className={this.props.icon}></i></div>
                <div className="title">{this.props.title}</div>
                <div className="sub-title">{this.props.subTitle}</div>
                <div className="content">
                {this.props.data.map( (e, k) => {
                    return <div className="item" key={k} onClick={this.onConfirm.bind(this, e)}>
                        {e.title}
                    </div>
                })}
                </div>
                <div className="desc" dangerouslySetInnerHTML={{__html:this.props.desc}}>
                </div>
                <div className="button">
                    
                    <div className="cancel" onClick={this.onCancel}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class CommonModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    render() {
        return <div className="common-modal default-modal-container">
            <div className="container">
                <div className="data">
                    <div className="icon"><i className={this.props.icon}></i></div>
                    <div className="desc-container">
                        <div className="place">
                            <div className="title">{this.props.title}</div>
                            <div className="sub-title">{this.props.subTitle}</div>
                        </div>
                        <div className="desc" dangerouslySetInnerHTML={{__html:this.props.desc}}>
                        </div>
                    </div>
                </div>
                <div className="button">
                    <div onClick={this.closeSelf}>확인</div>
                </div>
            </div>
        </div>
    }
}

@modal
class CardInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            expiration_month_options: [],
            expiration_year_options: [],
            selected_expiration_month: 0,
            selected_expiration_year: 0,
            selected_expiration_month_label: "",
            selected_expiration_year_label: "",
            card_number: "",
            social_number_front: "",
        };
    }

    componentDidMount() {
        let expiration_month_options = [];
        let expiration_year_options = [];
        for (let i = 1; i <= 12; i++) {
            expiration_month_options.push({value: i, label: i+"월"});
        }
        for (let i = 2019; i <= 2028; i++) {
            expiration_year_options.push({value: i, label: i+"년"});
        }
        let selected_expiration_month = this.props.selected_expiration_month || expiration_month_options[0].value;
        let selected_expiration_year = this.props.selected_expiration_year || expiration_year_options[0].value;
        let selected_expiration_month_label = expiration_month_options.find(e => e.value == selected_expiration_month).label;
        let selected_expiration_year_label = expiration_year_options.find(e => e.value == selected_expiration_year).label;
        this.setState({
            expiration_month_options,
            expiration_year_options,
            selected_expiration_month,
            selected_expiration_year,
            selected_expiration_month_label,
            selected_expiration_year_label,
        });
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onResponse = () => {
        // Input validation check
        this.props.onResponse && this.props.onResponse({
            card_number: this.state.card_number,
            cvc: this.state.cvc,
            month: this.state.selected_expiration_month,
            year: this.state.selected_expiration_year,
            id_number: this.state.social_number_front,
        });
        this.closeSelf();
    }

    render() {
        return <div className="card-info-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className="far fa-credit-card"></i></div>
                <div className="title">결제 정보 입력 / 변경</div>
                <div className="text-box">
                    <div className="sub-title">카드 번호</div>
                    <input type="number" className="common-textbox"
                        onChange={(e)=>this.setState({card_number:e.target.value})}
                        value={this.state.card_number}
                        placeholder="카드 번호를 입력해주세요."/>
                </div>
                <div className="text-box">
                    <div className="sub-title">CVC</div>
                    <input type="number" className="common-textbox"
                        onChange={(e)=>this.setState({cvc:e.target.value})}
                        value={this.state.cvc}
                        placeholder="카드 뒷면의 세자리 CVC 번호를 입력해주세요."/>
                </div>
                <div className="text-box">
                    <div className="sub-title">유효기간</div>
                    <Dropdown className="common-select"
                        controlClassName="control"
                        menuClassName="item"
                        options={this.state.expiration_month_options}
                        onChange={e=>{this.setState({selected_expiration_month:e.value, selected_expiration_month_label:e.label})}}
                        value={this.state.selected_expiration_month_label} placeholder="월" />
                    <Dropdown className="common-select"
                        controlClassName="control"
                        menuClassName="item"
                        options={this.state.expiration_year_options}
                        onChange={e=>{this.setState({selected_expiration_year:e.value, selected_expiration_year_label:e.label})}}
                        value={this.state.selected_expiration_year_label} placeholder="년도" />
                </div>
                <div className="text-box">
                    <div className="sub-title">주민등록번호 앞자리</div>
                    <input type="number" className="common-textbox"
                        onChange={(e)=>this.setState({social_number_front:e.target.value})}
                        value={this.state.social_number_front}
                        placeholder="주민번호 앞자리를 입력해주세요."/>
                </div>
                <div className="button">
                    <div className="submit" onClick={this.onResponse}>확인</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class PurchaseGroupMemberAdd extends React.Component {
    constructor() {
        super();
        this.state = {
            give_count:10
        };
    }

    componentDidMount() {

    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onResponse = () => {
        this.props.onResponse && this.props.onResponse()
        this.closeSelf();
    }

    render() {
        return <div className="purchase-group-member-add default-modal-container">
            <div className="container">
                <div className="icon"><i className="fal fa-ticket-alt"></i></div>
                <div className="title">그룹 계정 추가</div>
                <div className="sub-title">그룹 계정을 추가로 등록하는데는 1계정당 2,000원/월 의 추가 비용이 청구됩니다.</div>

                <div className="text-box">
                    <div className="sub-title">추가할 그룹 계정 수</div>
                    <input type="number" className="common-textbox"
                        onChange={(e)=>this.setState({give_count:e.target.value})}
                        value={this.state.give_count}
                        placeholder="추가할 그룹 계정 수를 입력해주세요."/>
                </div>
                <div className="sub-title">현재 계정 수 : 마스터 계정 1 + 서브 계정 5</div>
                <div className="sub-desc">
                    추가하신 인원은 바로 등록이 가능하며, 결제는 등록하신 결제 정보로 다음달 결제일에 진행됩니다
                </div>
                <div className="button">
                    <div className="submit" onClick={this.onResponse}>추가</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class PurchaseTicket extends React.Component {
    constructor() {
        super();
        this.state = {
            give_count:10
        };
    }

    componentDidMount() {

    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onResponse = () => {
        this.props.onResponse && this.props.onResponse()
        this.closeSelf();
    }

    render() {
        return <div className="purchase-ticket default-modal-container">
            <div className="container">
                <div className="icon"><i className="fal fa-ticket-alt"></i></div>
                <div className="title">건별 이용권 구매</div>
                <div className="sub-title">건별로 이용권을 구매해서 사용하실 수 있습니다.</div>
                <div className="content">{"1500".number_format()}<span className="last">원 / 건당</span></div>

                <div className="text-box">
                    <div className="sub-title">구매하실 이용권 건수</div>
                    <input type="number" className="common-textbox"
                        onChange={(e)=>this.setState({give_count:e.target.value})}
                        value={this.state.give_count}
                        placeholder="구매하실 이용권 건수를 입력해주세요."/>
                </div>
                <div className="result">
                    금액 : <span className="price">{(this.state.give_count * 1500).number_format()}</span> 원
                </div>
                <div className="button">
                    <div className="submit" onClick={this.onResponse}>구매</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class PurchaseRegularPayment extends React.Component {
    constructor() {
        super();
        this.state = {
            monthly_id: 0,
            yearly_id: 0,
            select_monthly_plan: {data:{title:null}},
            select_yearly_plan: {data:{title:null}},
            select_period: 0,
        };
    }

    componentDidMount() {
        let monthly_id = this.props.selectedMonthlyIndex;
        let yearly_id = this.props.selectedYearlyIndex;
        let select_monthly_plan = this.props.planMonthly.filter(e=>e.plan_id==monthly_id)[0];
        let select_yearly_plan = this.props.planYearly.filter(e=>e.plan_id==yearly_id)[0];
        let select_period = this.props.selectPeriod;
        this.setState({
            monthly_id,
            yearly_id,
            select_monthly_plan,
            select_yearly_plan,
            select_period,
        });
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onResponse = () => {
        this.props.onResponse && this.props.onResponse(this.state.select_period == 0 ? this.state.monthly_id : this.state.yearly_id);
        this.closeSelf();
    }

    render() {
        return <div className="purchase-regular-payment-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className="fas fa-credit-card"></i></div>
                <div className="title">정기 결제 이용권 선택</div>
                <div className="sub-title">월간, 연간 이용권 선택해서 구매하실 수 있습니다.</div>
                <div className="btn-container">
                    <div className="btn">
                        <div className="title">월간 정기 결제</div>
                        <div className="give-count">
                            <Dropdown className="common-select"
                                controlClassName="control"
                                menuClassName="item"
                                options={this.props.planMonthlyOptions}
                                onChange={e=>{this.setState({select_monthly_plan:this.props.planMonthly.filter(f=>e.value==f.plan_id)[0], select_period:0})}}
                                value={this.state.select_monthly_plan.data.title} placeholder="건수" />
                            <span className="last"> 건 사용 / 월</span>
                        </div>
                        <div className="price-info">{(this.state.select_monthly_plan.total_price ? this.state.select_monthly_plan.total_price : 0).number_format()}<span className="last">원 / 월</span></div>
                        <div className="sub">
                        {(this.state.select_monthly_plan.total_price ? this.state.select_monthly_plan.total_price : 0) / (this.state.select_monthly_plan.ticket_count ? this.state.select_monthly_plan.ticket_count : 1)} 원 / 건당<br/>
                            + 마스터 계정 1명, 서브 계정 4명
                        </div>
                    </div>
                    <div className="btn">
                        <div className="title">연간 정기 결제</div>
                        <div className="give-count">
                            <Dropdown className="common-select"
                                controlClassName="control"
                                menuClassName="item"
                                options={this.props.planYearlyOptions}
                                onChange={e=>{this.setState({select_yearly_plan:this.props.planYearly.filter(f=>e.value==f.plan_id)[0], select_period:1})}}
                                value={this.state.select_yearly_plan.data.title} placeholder="건수" />
                            <span className="last"> 건 사용 / 월</span>
                        </div>
                        <div className="price-info">{(this.state.select_yearly_plan.total_price ? this.state.select_yearly_plan.total_price : 0).number_format()}<span className="last">원 / 년</span></div>
                        <div className="sub">
                            {(this.state.select_yearly_plan.total_price ? this.state.select_yearly_plan.total_price : 0) / (this.state.select_yearly_plan.ticket_count ? this.state.select_yearly_plan.ticket_count : 1)} 원 / 건당<br/>
                            + 마스터 계정 1명, 서브 계정 4명
                        </div>
                    </div>
                </div>
                <div className="button">
                    <div className="submit" onClick={this.onResponse}>변경</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }

}

@modal
class StartContract extends React.Component{
    constructor(){
        super()
        this.state = {}
    }
    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClick = (type)=>{

        this.props.onClick && this.props.onClick( type )
        this.closeSelf()
    }

    render(){
        return <div className="start-contract-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className="fal fa-file-code"></i></div>
                <div className="title">시작하기</div>
                <div className="btn-container">
                    <div className="btn" onClick={this.onClick.bind(this, 1)}>
                        <i className="fal fa-comment-alt-edit"></i>
                        <div className="btn-desc">
                            <div className="title">웹 에디터 사용하기</div>
                            <div className="sub">계약 내용을 직접 추가하고 수정할 수 있습니다.<br/>내용이 확정되면 서명 또는 도장을 추가하여 작업을 완료할 수 있습니다.</div>
                        </div>
                    </div>
                    <div className="btn" onClick={this.onClick.bind(this, 2)}>
                        <i className="fal fa-paste"></i>
                        <div className="btn-desc">
                            <div className="title">템플릿 사용하기</div>
                            <div className="sub">기존에 생성한 템플릿을 바로 사용하실 수 있습니다.<br/>기존 내용을 수정하거나 서명 또는 도장을 추가할 수 있습니다.</div>
                        </div>
                    </div>
                </div>
                <div className="cancel" onClick={this.closeSelf}>취소</div>
            </div>
        </div>
    }
}

@modal
class BrowserNotVerified extends React.Component{
    constructor(){
        super()
        this.state = {}
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    render(){
        return <div className="browser-not-verified-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className="fal fa-browser"></i></div>
                <div className="title">브라우저 미인증이란?</div>
                <div className="sub-title">E-Contract 서비스는 회원가입시 발급되는 마스터 키워드를 기반으로 로그인 하실 수 있습니다.</div>
                <div className="desc-container">
                    <div className="place">
                        <i className="fal fa-sign-in"></i>
                        <div className="title">회원가입</div>
                        <div className="sub">전자 계약 진행시 신원을 확인 할 수 있는 정보를 입력하여 가입합니다.</div>
                    </div>
                    <div className="place">
                        <i className="fal fa-key"></i>
                        <div className="title">마스터 키워드 발급</div>
                        <div className="sub">발급받은 마스터 키워드는 접속하고 있는 브라우저에 자동으로 저장됩니다.</div>
                    </div>
                    <div className="place">
                        <i className="fal fa-money-check"></i>
                        <div className="title">마스터 키워드 인증</div>
                        <div className="sub">서비스에 접속시 브라우저에 저장된 마스터 키워드를 기반으로 인증이 진행되며, 가입시 입력한 이메일과 비밀번호로 로그인이 가능합니다</div>
                    </div>
                </div>
                <div className="button">
                    <div onClick={this.closeSelf}>확인</div>
                </div>
            </div>
        </div>
    }
}

@modal
class Confirm extends React.Component{

    clickOk = ()=>{
        this.props.resolve && this.props.resolve(true)
        this.closeSelf();
    }

    clickNo = ()=>{
        this.props.resolve && this.props.resolve(false)
        this.closeSelf();
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    render(){
        return <div className="confirm-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className="fal fa-user-check"></i></div>
                <div className="title" dangerouslySetInnerHTML={{__html:this.props.title||"타이틀"}}></div>
                <div className="sub-title" dangerouslySetInnerHTML={{__html:this.props.msg||"메세지"}}></div>

                <div className="button">
                    <div className="confirm" onClick={this.clickOk}>{this.props.right_btn || "확인"}</div>
                    <div className="cancel" onClick={this.clickNo}>{this.props.left_btn || "취소"}</div>
                </div>
            </div>
        </div>
    }
}

@modal
class MoveCanEditAccount extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            select:null
        }
    }

    componentDidMount() {
    }

    closeSelf = () => {
        window.closeModal(this.props.modalId)
    }

    onConfirm = () => {
        if(!this.state.select)
            return alert("권한을 넘길 사용자를 선택해주세요.")

        this.props.onConfirm && this.props.onConfirm(this.state.select)
        this.closeSelf();
    }

    onSelect = (e) => {
        this.setState({select:e})
    }

    render() {
        return <div className="move-can-edit-account-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className="fas fa-arrow-alt-right"></i></div>
                <div className="title">수정 권한 넘기기</div>
                <div className="sub-title">계약서 수정 권한을 타인에게 넘깁니다.</div>
                <div className="content">
                {this.props.user_infos.map( (e, k) => {
                    if(e.privilege != 1 || this.props.my_account_id == e.entity_id)
                        return

                    return <div className={"item" + (this.state.select == e ? " enable" : "")} key={k} onClick={this.onSelect.bind(this, e)}>
                        <div className="name">{e.user_info.username ? e.user_info.username : e.user_info.title}</div>
                        <div className="email">{e.user_info.email ? e.user_info.email : e.user_info.company_name}</div>
                    </div>
                })}
                </div>
                <div className="button">
                    <div className="confirm" onClick={this.onConfirm}>수정 권한 넘기기</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>        
    }
}


@modal
class TypingPin extends React.Component{
    constructor(){
        super()
        this.state = { 
            value : ""
        }
    }
    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClickOK = ()=>{
        if(this.state.value.length == 6){
            this.props.onFinish && this.props.onFinish(this.state.value)
            this.closeSelf()
        } else {
            alert("핀번호는 6자리입니다. 정확히 입력해주세요.")
        }
    }

    onClickCancel = () => {
        this.props.onFinish && this.props.onFinish(false)
        this.closeSelf()
    }

    keydown = (e)=>{
        if(e.key == "Backspace") {
            this.setState({
                value: this.state.value.slice(0,this.state.value.length-1)
            })
        } else if(e.key == "Enter" || e.keyCode == 13) {
            this.onClickOK()
        }
        let key = Number(e.key)
        if( 0 <= key && key <= 9 ){
            if(this.state.value.length < 6){
                this.setState({
                    value: this.state.value + "" + key
                })
            }
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.keydown);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keydown);
    }

    render(){
        return <div className="default-modal type-pin-modal default-modal-container">
            <div className="contents">
                <div className="title">PIN을 입력해주세요</div>
                <div className="pin-box">
                    {this.state.value}
                </div>
            </div>
            <div className="buttons">
                <button onClick={this.onClickCancel}>취소</button>
                <button onClick={this.onClickOK}>확인</button>
            </div>
        </div>
    }
}


@modal
class DrawSign extends React.Component{
    constructor(props) {
        super(props);
        
        this.first_drawing = false
        this.isImage = false

        this.state = {};
    }

    componentDidMount(){
    }

    finishDraw = ()=>{
        if(!this.first_drawing)
            return alert("서명을 그려주세요.")

        let dataUrl = this.refs.canvas.toDataURL("image/png")
        this.props.onFinish(dataUrl)
        window.closeModal(this.props.modalId)
    }

    dataURItoBlob(dataURI) {
        let byteString = atob(dataURI.split(',')[1]);
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++)
        {
            ia[i] = byteString.charCodeAt(i);
        }

        let bb = new Blob([ab], { "type": mimeString });
        return bb;
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onUploadSignImage = async (e) => {
        let file = e.target.files[0];
        if(!file) {
            console.log("no file")
            return
        }

        await window.showIndicator()

        let names = file.name.split(".");
        let ext = names[names.length - 1];

        let reader = new FileReader();
        reader.onload = () => {
            console.log("asdasd")
            let img = new Image()
            img.onload = () => {
                let ctx = this.refs.canvas.getContext('2d');

                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
                ctx.restore();

                let max = Math.max(img.width / 490, img.height / 240)
                let width = img.width / max
                let height = img.height / max

                ctx.drawImage(img, 500 / 2 - width / 2, 250 / 2 - height / 2, width, height);
                this.isDrawing = false
                this.isImage = true
                this.first_drawing = true
            }
            img.src = reader.result
        }
        reader.readAsDataURL(file);

        await window.hideIndicator()
    }

    onClear = (e) => {
        e.stopPropagation()
        let ctx = this.refs.canvas.getContext('2d');
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
        ctx.restore();
        this.isImage = false
        this.isDrawing = false
        this.first_drawing = false
    }
    
    onmousedown = (e)=>{
        if(this.isImage)
            return;

        let ctx = this.refs.canvas.getContext('2d');

        this.isDrawing = true;
        ctx.moveTo(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
        ctx.beginPath()
    }

    onmousemove = (e)=>{
        if(this.isImage)
            return;

        let ctx = this.refs.canvas.getContext('2d');

        if (this.isDrawing) {
            ctx.lineTo(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
            ctx.stroke();
        }
    }

    onmouseup = ()=>{
        if(this.isImage)
            return;

        this.isDrawing = false;
        let ctx = this.refs.canvas.getContext('2d');
        ctx.closePath()

        if(!this.first_drawing)
            this.first_drawing = true
    }

    render(){
        return <div className="draw-sign-modal default-modal-container">
            <div className="container">

                <div className="icon"><i className="far fa-file-signature"></i></div>
                <div className="title">서명 그리기</div>
                <div className="desc">다른 사람들이 모두 서명을 했다면 계약이 완료됩니다.<br/>서명을 하기전에 신중하게 계약서 내용을 검토해주세요.</div>
                
                <div className="canvas">
                    <div className="clear" onClick={this.onClear}>초기화</div>
                </div>
                <canvas ref="canvas" 
                    width="500"
                    height="250"
                    onMouseDown={this.onmousedown} 
                    onMouseMove={this.onmousemove}
                    onMouseUp={this.onmouseup} />

                <div className="image-upload">
                    <div className="button" onClick={()=>{
                        this.refs['sign-image'].value = ""
                        this.refs['sign-image'].click()
                    }}>이미지 업로드</div>
                    <input ref="sign-image" type="file" accept=".png, .jpg, .jpeg" onChange={this.onUploadSignImage} style={{display:"none"}}/>
                </div>

                <div className="button">
                    <div className="submit" onClick={this.finishDraw}>서명</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class MoveToFolder extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClickMove = ()=>{
        if(!this.state.select_folder_id) {
            return alert("계약이 이동될 폴더를 지정해주세요")
        }
        
        this.props.onClickMove && this.props.onClickMove(this.state.select_folder_id)
        this.closeSelf()
    }

    render(){
        return <div className="move-folder default-modal-container">
            <div className="container">
                <div className="icon"><i className="far fa-folder"></i></div>
                <div className="title">폴더 지정</div>
                
                <div className="select">
                    <Dropdown className="folder-dropdown"
                        controlClassName="control"
                        menuClassName="item"
                        options={this.props.folders.map(e=>{ return {value:e.folder_id, label:e.subject} })}
                        onChange={e=>{this.setState({select_folder_id:e.value, select_folder_title:e.label})}}
                        value={this.state.select_folder_title} placeholder="이동할 폴더 선택" />
                </div>

                <div className="msg"><b>{this.props.contract_ids.length}</b>건의 계약이 선택하신 폴더로 이동합니다.</div>

                <div className="button">
                    <div className="submit" onClick={this.onClickMove}>이동</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>

            </div>
        </div>
    }
}

@modal
class ContractListModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onConfirm = ()=>{
        this.props.onConfirm && this.props.onConfirm()
        this.closeSelf()
    }

    onMoveContract = (contract_id) => {
        history.push("/contract-info/"+contract_id)
    }


    render() {
        return <div className="contract-list-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className={this.props.icon}></i></div>
                <div className="title">{this.props.title}</div>
                <div className="desc" dangerouslySetInnerHTML={{__html:this.props.desc}}></div>

                <div className="list">
                    {this.props.list.map( (e, k) => {
                        return <div className="item" key={k} onClick={this.onMoveContract.bind(this, e.contract_id)}>
                            {e.name}
                        </div>
                    })}
                </div>

                <div className="button">
                    <div className="submit" onClick={this.onConfirm}>삭제</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }
}

@modal
class AddGroupMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email:"",
            selected_group:null
        };
    }

    componentDidMount() {

    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onConfirm = ()=>{
        if(!this.state.selected_group)
            return alert("그룹을 선택해주세요.")

        let result = false
        if(this.props.onConfirm)
            result = this.props.onConfirm(this.state.email, this.state.selected_group)

        if(result) this.closeSelf()
    }

    render() {
        return <div className="add-group-member-modal default-modal-container">
            <div className="container">
                <div className="icon"><i className="fas fa-users"></i></div>
                <div className="title">직원 계정 추가하기</div>
                <div className="desc">직원 계정을 추가합니다.<br/>이미 직원인 계정을 추가하면 지정하신 그룹에 할당됩니다.</div>

                <div className="text-box">
                    <div className="sub-title">이메일</div>
                    <input type="text" className="common-textbox"
                        onChange={(e)=>this.setState({email:e.target.value})}
                        value={this.state.email}
                        placeholder="초대하실 이메일을 입력해주세요."/>
                </div>
                <div className="text-box">
                    <div className="sub-title">그룹</div>
                    <Dropdown className="common-select"
                        controlClassName="control"
                        menuClassName="item"
                        options={this.props.list}
                        onChange={e=>{this.setState({selected_group:e, selected_group_label:e.label})}}
                        value={this.state.selected_group_label} placeholder="그룹" />
                </div>
                

                <div className="button">
                    <div className="submit" onClick={this.onConfirm}>추가</div>
                    <div className="cancel" onClick={this.closeSelf}>취소</div>
                </div>
            </div>
        </div>
    }

}


























@modal
class RegistContract extends React.Component{

    constructor() {
        super()
        this.state = {
            isPinSaved : false
        }
    }

    componentDidMount() {
        this.setState({
            isPinSaved: this.props.is_pin_saved
        })
    }

    closeSelf = ()=>{
        window.closeModal(this.props.modalId)
    }

    onClickOK = ()=>{
        this.state.isPinSaved ? this.props.updatePIN() : this.props.clearPIN()
        this.props.onOK && this.props.onOK()
        this.closeSelf()
    }

    pinCheckChange = (e) => {
        this.setState({
            isPinSaved: e.target.checked
        });
    }

    render(){
        let author = this.props.author
        let user_code = this.props.login_user_code
        return <div className="default-modal register-contract-modal">
            <div className="contents">
                <div className="title">계약 등록</div>
                <div className="form-content">
                    <div>
                        <div className="label">계약명</div>
                        <div className="info">{this.props.subject}</div>

                        <div className="label">계약 PIN</div>
                        <div className="info">
                            <div className="pin-box">
                                {this.props.pin}
                            </div>
                        </div>
                        
                        <div className="checkbox">
                            <input
                                type="checkbox" 
                                onChange={this.pinCheckChange}
                                defaultChecked={this.props.is_pin_saved}/> PIN 번호 저장하기
                        </div>

                        <div className="desc"> * 해당 PIN번호는 암호화되어 저장되어 본인만 열람이 가능합니다.</div>
                    </div>
                    <div>
                        <div className="label">서명자</div>
                        <SignerSlot me={user_code == author.code} code={author.code} name={author.name} eth_address={author.eth_address}  />
                        {this.props.counterparties.map((e,k)=>{
                            return <SignerSlot 
                                key={k}
                                me={user_code == e.code} 
                                code={e.code}
                                name={e.name}
                                eth_address={e.eth_address}  />
                        })}
                        
                    </div>
                </div>
            </div>
            <div className="buttons">
                <button onClick={this.onClickOK}>확인</button>
                <button onClick={this.closeSelf}>취소</button>
            </div>
        </div>
    }
}

@modal
class Loading extends React.Component{
    render(){
        return <div style={{color:"#fff",textAlign:"center"}}>
            <div className="loader"></div>
            <div style={{marginTop:"20px"}}>{this.props.text || "로딩 중"}</div>
        </div>
    }
}


@modal
class RefreshSession extends React.Component{
    constructor(){
        super()
        this.state = {}
    }
    componentDidMount(){
        this.interval = setInterval(this.update, 1000)
        this.update()
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    digit = (o)=>{
        o = o.toString()
        if(o.length == 1){
            return "0"+o
        }
        return o
    }

    update = ()=>{
        let t = window.getCookie("session_update");
        if(t){
            let day = 60 * 60 * 3;

            let left_time = day - ((Date.now()-t)/1000);
            let left_hour = Math.floor(left_time/60/60)
            let left_min = Math.floor(left_time/60%60)
            let left_sec = Math.floor(left_time%60)

            this.setState({
                hour:this.digit(left_hour),
                min:this.digit(left_min),
                sec:this.digit(left_sec),
            })
        }
    }

    onClickRenewal= ()=>{
        let session = window.getCookie("session");
        if(session){
            window.setCookie("session", session, 0.125)
            window.setCookie("session_update", Date.now(), 0.125)
        }

        window.closeModal(this.props.modalId)
        this.props.onClose && this.props.onClose()
    }
    
    onClickLogout = ()=>{
        window.eraseCookie("session")
        window.eraseCookie("session_update")
        
        location.reload(true)
    }

    render(){
        try{
            return <div className="default-modal session-expired-warning-modal">
                <div className="title">
                    세션이 {this.state.hour}시간 {this.state.min}분 {this.state.sec}초 후 만료됩니다.
                </div>
                <div className="content">
                    세션 만료 후에는 재로그인을 해야합니다.<br />
                    세션 만료를 연장하시겠습니까?
                </div>
                <div className="btns">
                    <button onClick={this.onClickRenewal}>연장</button>
                    <button onClick={this.onClickLogout}>로그아웃</button>
                </div>
            </div>
        }catch(err){
            return <div />
        }
    }
}

window._confirm = window.confirm;
window.confirm = (title, msg, left, right)=>{
    return new Promise(r=>{
        window.openModal("Confirm",{
            title:title, 
            msg:msg, 
            left_btn:left, 
            right_btn:right,
            resolve:r
        })
    })
}

let indicator_idx = 0;
window.showIndicator = async (text)=>{
    if(indicator_idx)
        if(await window.updateModal(indicator_idx, {text}))
            return ;

    indicator_idx = await window.openModal("Loading",{
        text:text
    })
}

window.hideIndicator = ()=>{
    window.closeModal(indicator_idx)
    indicator_idx = null
}

let refesh_modal_idx = null
setInterval(()=>{
    let t = window.getCookie("session_update");
    if(t){
        let day = 60 * 60 * 3;

        let left_time = day - ((Date.now()-t)/1000);

        if(left_time < 0){
            window.eraseCookie("session")
            window.eraseCookie("session_update")
            
            location.reload(true)
        }

        if(left_time < 60 * 5 && !refesh_modal_idx){
            refesh_modal_idx = window.openModal("RefreshSession",{
                onClose:()=>{
                    refesh_modal_idx = null
                }

            })
        }
    }else{
        let exclude = [
            "/",
            '/login',
            '/register',
            '/recover'
        ]
        if( exclude.indexOf(location.pathname) == -1 ){
            location.href="/"
        }
    }
},1000)
