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
} from "../../common/actions"
import SignerSlot from "./signer-slot"
import moment from "moment"
import html2canvas from "html2canvas"

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

            let pin = await this.props.get_pin_from_storage(contract_id)
            if( pin ){
                await this.load_contract(contract_id, pin)
            }else{
                history.replace(`/contract-editor/${contract_id}`)
            }
            await window.hideIndicator()
        })()
    }

    componentWillUnmount(){
    }

    async load_contract(contract_id, pin){
        let contract = await this.props.load_contract(contract_id,pin, null, )
        if(contract.contract_id){
            console.log(contract)
            this.setState({
                ...contract,
                pin:pin,
            })
        }else{
            alert("정상적으로 불러오지 못했습니다.")
        }
    }

    onClickConfirm = async()=>{
        if(await confirm("승인하기","계약을 승인하시겠습니까?")){
            let resp = await this.props.confirm_contract(this.state.contract_id)
            //location.reload()
            history.replace('/recently')
        }
    }

    onClickReject = async()=>{
        if(await confirm("승인하기","계약을 거절하시겠습니까?")){
            let str = prompt("거절 이유를 작성해주세요.")
            if( str ){
                await this.props.reject_contract(this.state.contract_id, str)
                //location.reload()
                history.replace('/recently')
            }else{
                alert("거절하시는 이유를 작성해주세요.")
            }
        }
    }

    onClickPrint = async()=>{
        await window.showIndicator()
        let pdfs = []
        for(let i in this.state.imgs){
            let div = document.createElement("div")
            div.style.width=800;
            div.style.display="inline-block";
            div.style.position="relative";

            document.body.append(div);

            let img = document.createElement("img")
            img.src = this.state.imgs[i]
            img.width=800;
            div.appendChild(img)
            
            let objects = [ ...(this.state.html[i] || []) ]
            for(let c of this.state.counterparties){
                objects = (objects || []).concat(c.html[i])
            }
            objects = objects.filter(e=>e)
            for(let o of objects){
                let element = null 
                if(o.type == "img"){
                    let img = element = document.createElement("img")
                    img.src = o.data
                }

                element.width=o.width;
                element.height=o.height;
                element.style.left=o.x;
                element.style.top=o.y;
                element.style.position="absolute";
                div.appendChild(element)

            }

            let canvas = await html2canvas(div)
            pdfs.push({img:canvas.toDataURL("png")})
            div.remove();
        }
        window.pdf.make( pdfs )
        await window.hideIndicator()

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
                return "mang";
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
                    <div className={this.state.status == 2 || alreadySelect ? "page" : 'page bottom-no-border'}>
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
                                    <div className="form-label"> 트랜젝션 Hash </div>
                                    <div className="form-info">
                                        0xasdasdasdasdasdasdasdas
                                    </div>
                                </div> : null}

                                {this.state.status == 2 ? <div>
                                    <div className="form-label"> 출력 </div>
                                    <div className="form-info">
                                        <button onClick={this.onClickPrint}>프린트하기</button>
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
                    {this.state.status == 2 || alreadySelect ? null : [
                        <button className="left-friendly-button" onClick={this.onClickConfirm}> 승 인 </button>,
                        <button className="right-friendly-button" onClick={this.onClickReject}> 거 절 </button>]
                    }
                </div>
            </div>
		</div>);
	}
}
