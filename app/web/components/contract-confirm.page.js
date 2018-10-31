import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import {
    confirm_contract,
    reject_contract,
    load_contract,
    fetch_user_info,
    get_pin_from_storage,
    load_contract_info,
} from "../../common/actions"
import SignerSlot from "./signer-slot"
import moment from "moment"
import { sha256 } from 'js-sha256'

let mapStateToProps = (state)=>{
	return {
        user:state.user.info
	}
}

let mapDispatchToProps = {
    confirm_contract,
    reject_contract,
    load_contract,
    fetch_user_info,
    get_pin_from_storage,
    load_contract_info,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
        };
	}

	componentDidMount(){
        let contract_id = this.props.match.params.id;
        (async()=>{
            await window.showIndicator()
            await this.props.fetch_user_info()

            let contract_info = await this.props.load_contract_info(contract_id);
            if (contract_info) {

                let pin = await this.props.get_pin_from_storage(contract_id)
                if( pin ){
                    await this.load_contract(contract_id, pin)
                }else{
                    history.replace(`/contract-editor/${contract_id}`)
                }

            } else {
                alert("이 계약에 접근할 수 없습니다. 로그인 상태를 확인해주세요.");
                history.replace("/login")
            }
            await window.hideIndicator()
        })()
    }

    componentWillUnmount(){
    }

    getContractRaw(){
        let imgs = []
        for(let i in this.state.imgs){
            let objects = [ ...(this.state.html[i] || []) ]
            for(let c of this.state.counterparties){
                objects = (objects || []).concat(c.html[i])
            }
            imgs.push({
                img : this.state.imgs[i],
                objects : objects
            })
        }
        return imgs
    }

    getCounterpartiesEth(){
        return [this.state.author_eth_address, ...this.state.counterparties.map(e=>e.eth_address)]
    }

    async load_contract(contract_id, pin){
        let contract = await this.props.load_contract(contract_id,pin, null, false )
        if(!contract){
            alert("문서 로드에 실패했습니다.")
            return history.replace('/recently') 
        }

        if(contract.contract_id){
            await new Promise(r=>this.setState({
                ...contract,
                pin:pin,
            },r))

            if(this.state.status == 2){
                let byte = await window.pdf.gen( this.getContractRaw() )
                this.setState({
                    doc_hash : sha256(byte)
                })

                // let qq = {}
                // for(let v = 0;v < 100;v++){
                //     window.scroll(0,v)
                //     qq[v] = sha256(await window.pdf.gen( this.getContractRaw(), false ));
                // }
                // console.log("----------------", qq)
            }
        }else{
            alert("정상적으로 불러오지 못했습니다.")
        }
    }

    onClickConfirm = async()=>{
        if(await confirm("승인하기","계약을 승인하시겠습니까?")){
            await window.showIndicator()
            let docByte = await window.pdf.gen( this.getContractRaw() )
            let resp = await this.props.confirm_contract(this.state.contract_id, this.getCounterpartiesEth(), docByte)
            await window.hideIndicator()
            history.replace('/recently')
        }
    }

    onClickReject = async()=>{
        if(await confirm("승인하기","계약을 거절하시겠습니까?")){
            let str = prompt("거절 이유를 작성해주세요.")
            if( str ){
                await this.props.reject_contract(this.state.contract_id, str)
                history.replace('/recently')
            }else{
                alert("거절하시는 이유를 작성해주세요.")
            }
        }
    }

    onClickPrint = async()=>{
        await window.showIndicator()

        let v = await window.pdf.gen( this.getContractRaw(), true )
        console.log(v, sha256(v))

        let int32View = new Int32Array(v);
        console.log(int32View, sha256(int32View))

        await window.hideIndicator()
    }

    onClickValidation = async()=>{
        history.push(`/verification/${this.state.doc_hash}`)
    }

    render_status_text(){
        if(this.state.status == 0){
            return "배포 전"
        }else if(this.state.status == 1){
            return "서명 전"
        }else if(this.state.status == 2){
            return "서명 완료"
        }
    }

	render() {
        if(!this.state.contract_id || !this.props.user)
            return <div className="default-page"><div className="container">{/*<h1>로딩중..</h1>*/}</div></div>

        let alreadySelect = false;
        if (this.state.author_code == this.props.user.code) {
            alreadySelect = (this.state.author_confirm == 1) || (this.state.author_msg ? true : false)
        } else {
            let me = this.state.counterparties.filter((e, k)=>{
                return e.code == this.props.user.code
            })
            if (me.length == 0) {
                console.log("Impossible!");
                return "m";
            } else {
                alreadySelect = (me[0].confirm == 1) || (me[0].reject ? true : false);
            }
        }

        return (<div className="">
            <div className="default-page confirm-contract-page">
                <div className="logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
                </div>
                <div className="back-key">
                    <div className="round-btn" onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></div>
                </div>
                <div className="container">
                    <h1>계약 상세보기</h1>
                    <div className={'page bottom-no-border'}>
                        <div className="column-300">
                            <div className="form-layout">
                                <div className="form-label"> 계약명 </div>
                                <div className="form-info">
                                    {this.state.name}
                                </div>

                                <div className="form-label"> 계약 상태 </div>
                                <div className="form-info">
                                    {this.render_status_text()}
                                </div>

                                <div className="form-label"> 계약 등록일자 </div>
                                <div className="form-info">
                                    {moment(this.state.addedAt).format("YYYY-MM-DD HH:mm:ss")}
                                </div>

                                {this.state.status == 2 ? null : <div>
                                    <div className="form-label"> 계약 PIN </div>
                                    <div className="form-info">
                                        <div className="pin-box"> {this.state.pin} </div>
                                    </div>
                                </div>}

                                {this.state.status == 2 ? <div>
                                    <div className="form-label"> Transaction Hash </div>
                                    <div className="form-info">
                                        {[{
                                            name:this.state.author_name,
                                            transaction:this.state.author_transaction,
                                            original:this.state.author_original,
                                        },...this.state.counterparties].map((e,k)=>(<div key={k}>
                                            {e.name} : {e.transaction}
                                        </div>))}
                                    </div>
                                </div> : null}
                                
                                {this.state.status == 2 ? <div>
                                    <div className="form-label"> Document Hash </div>
                                    <div className="form-info">
                                        {this.state.doc_hash ? this.state.doc_hash : "계산중.."}
                                    </div>
                                </div> : null}

                                {/*this.state.status == 2 ? null : [
                                    <div key={1} className="form-label bold"> 확인하기 </div>,
                                    <div key={2} className="form-submit">
                                        <button className="border confirm-btn" onClick={this.onClickConfirm}>승인</button>
                                        <button className="border reject-btn" onClick={this.onClickReject}>거절</button>
                                    </div>
                                ]*/}
                            </div>
                        </div>
                        <div className="column-300">
                            <div className="form-layout">
                                <div className="form-label"> 서명자 </div>
                                <div className="form-info">
                                    <SignerSlot 
                                        code={this.state.author_code}
                                        name={this.state.author_name}
                                        eth_address={this.state.author_eth_address}
                                        reject={this.state.author_confirm == 1 ? null : this.state.author_msg}
                                        confirm={this.state.author_confirm == 1}
                                        me={this.state.author_code == this.props.user.code}
                                    />
                                    {this.state.counterparties.map((e,k)=>{
                                        return <SignerSlot 
                                            key={k}
                                            code={e.code}
                                            name={e.name}
                                            eth_address={e.eth_address}
                                            me={e.code == this.props.user.code}
                                            confirm={e.confirm == 1}
                                            reject={e.confirm == 1 ? null : e.reject}
                                        />
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.status == 2 || alreadySelect ? [
                        <button className="left-friendly-button" onClick={this.onClickPrint}> 출 력 </button>,
                        <button className="right-friendly-button" onClick={this.onClickValidation}> 검 증 </button>
                    ] : [
                        <button className="left-friendly-button" onClick={this.onClickConfirm}> 승 인 </button>,
                        <button className="right-friendly-button" onClick={this.onClickReject}> 거 절 </button>
                    ]
                    }
                </div>
            </div>
		</div>);
	}
}
