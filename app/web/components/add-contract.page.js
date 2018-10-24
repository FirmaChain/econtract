import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom'
import SignerSlot from "./signer-slot"
import history from '../history';
import pdfjsLib from "pdfjs-dist"
import {
    find_user_with_code,
    fetch_user_info,
    new_contract
} from "../../common/actions"

let mapStateToProps = (state)=>{
	return {
        user_info: state.user.info
	}
}

let mapDispatchToProps = {
    find_user_with_code,
    fetch_user_info,
    new_contract
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            counterparties:[]
        };
        this.blockFlag = true
	}

	componentDidMount(){
        this.blockFlag = true
        if(!this.props.user_info){
            (async()=>{
                await window.showIndicator()
                await this.props.fetch_user_info()
                await window.hideIndicator()
            })()
        }

        this.unblock = history.block(targetLocation => {
            if(window._confirm("계약 절차를 중단하고 현재 페이지를 나가시겠습니까?")){
                return true;
            }else{
                return false;
            }
        })
    }

    componentWillUnmount(){
        if(this.blockFlag)
            this.unblock();
    }

    componentWillReceiveProps(props){
        if(props.user_info === false){
            history.replace("/login")
        }
    }

    onClickNext = async ()=>{
        let counterparties = this.state.counterparties
        let imgs = this.state.imgs
        let subject= this.state.contract_name
        if(!subject){
            return alert("제목을 입력해주세요")
        }
        if(imgs == null || imgs.length == 0){
            return alert("파일 혹은 템플릿을 선택해주세요.")
        }
        await window.showIndicator()
        let resp = await this.props.new_contract( subject, imgs, (counterparties || []).map(e=>e.code) );
        if(resp){
            //this.unblock();
            this.blockFlag = false;
            history.replace(`/contract-editor/${resp}`)
        }else{
            alert("계약서 생성에 문제가 발생했습니다!")
        }
        await window.hideIndicator();
    }

    onClickUploadFile = async (e)=>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsBinaryString(file)

        reader.onload = async()=>{
            await window.showIndicator()
            try{
                let pdf = await pdfjsLib.getDocument({data: reader.result}).promise;
                let imgs = []
                for(let i=1; i <= pdf.numPages;i++){
                    let page = await pdf.getPage(i)
                    let viewport = page.getViewport(1.5);
        
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
        
                    let renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
        
                    await page.render(renderContext);
                    let v = canvas.toDataURL("image/png")
                    imgs.push(v);
                }

                this.setState({
                    file: file,
                    imgs: imgs
                })
            }catch(err){
                console.log(err)
                window.alert("PDF 형식이 아닙니다.")
            }
            await window.hideIndicator()
        }
    }

    onClickAddCounterparty = async _=>{
        let email = this.state.counterparty_email;
        let code = this.state.counterparty_code;
        if(!code)
            return alert("초대 코드를 입력해주세요.")
        if(!email)
            return alert("메일을 입력해주세요.")
        if(this.state.counterparties.findIndex(e=>code==e.code) >= 0)
            return alert("이미 추가된 서명자입니다.")
        if(this.props.user_info.code == code)
            return alert("본인의 초대코드입니다.")
    
        await window.showIndicator()
        let user = await this.props.find_user_with_code(code);
        await window.hideIndicator()

        if(user){
            this.setState({
                counterparty_email:"",
                counterparty_code:"",
                counterparties:[
                    ...this.state.counterparties,
                    {
                        code,
                        email,
                        ...user
                    }
                ]
            })
        }else{
            alert("존재하지 않는 유저입니다.")
        }
    }

    onClickDeleteCounterparty = (code)=>{
        let counterparties = [...this.state.counterparties]
        let idx = this.state.counterparties.findIndex(e=>code==e.code);
        if(idx >= 0){
            counterparties.splice(idx,1)
            this.setState({
                counterparties:counterparties
            })
        }
    }

	render() {
        if(!this.props.user_info)
            return <div/>

        return (<div className="default-page add-contract-page">
            <div className="back-key">
                <div className="round-btn" onClick={()=>history.goBack()}><i className="fas fa-arrow-left"></i></div>
            </div>
            <div className="container">
                <h1>계약 등록</h1>
                <div className="page bottom-no-border">
                    <div className="column-300">
                        <div className="form-layout">
                            <div className="form-label"> 계약명 </div>
                            <div className="form-input">
                                <input placeholder="계약서의 이름을 작성해주세요." value={this.state.contract_name || ""} onChange={e=>this.setState({contract_name:e.target.value})} />
                            </div>
                            
                            <div className="form-label"> 계약 파일 업로드 </div>
                            {this.state.file ? <div className="selected-file">
                                <div className="filename">{this.state.file.name}</div>
                                <div className="del-btn" onClick={()=>this.setState({file:null,imgs:[]})}>삭제</div>
                            </div> : <div className="upload-form">
                                <button className="file-upload-btn" onClick={()=>this.refs.file.click()}> <i className="fas fa-file-archive"></i> 파일 업로드 </button>
                                <div className="or"> OR </div>
                                <select>
                                    <option>템플릿 선택</option>
                                </select>
                                <input ref="file" type="file" onChange={this.onClickUploadFile} style={{display:"none"}}/>
                            </div>}

                            <div style={{height:20}} />
                            <div className="form-label"> 서명자 </div>
                            <SignerSlot 
                                me={true}
                                code={this.props.user_info.code}
                                name={this.props.user_info.username}
                                email={this.props.user_info.email}
                                eth_address={this.props.user_info.eth_address} 
                            />
                            {this.state.counterparties.map((e,k)=>{
                                return <SignerSlot key={k} onDelete={this.onClickDeleteCounterparty} {...e} />
                            })}

                            <div style={{height:20}} />
                            <div className="form-label"> 서명자 이메일 </div>
                            <div className="form-input">
                                <input placeholder="서명하실 분의 이메일을 입력해주세요." value={this.state.counterparty_email || ""} onChange={e=>this.setState({counterparty_email:e.target.value})} />
                            </div>

                            <div className="form-label"> 서명자 초대코드 </div>
                            <div className="form-input">
                                <input placeholder="서명하실 분에게 초대코드를 요청하여 입력하세요." value={this.state.counterparty_code || ""} onChange={e=>this.setState({counterparty_code:e.target.value})} />
                            </div>

                            <button className="add-button" onClick={this.onClickAddCounterparty}>
                                <i className="fas fa-user"></i>
                                서명자 추가
                            </button>
                        </div>
                    </div>
                    <div className="column-300">
                        <div className="right-desc"> 
                            <div>* 20MB 이하의 파일만 업로드 가능합니다.</div>
                            <div>자주 쓰는 계약은 [내 탬플릿] 기능을 사용하여 손쉽게 불러올 수 있습니다.<br/> [내 계약] > [내 탬플릿] > [탬플릿 추가]</div>

                            <div style={{marginTop:"110px",color:"red"}}>* 한번 계약을 등록한 경우, 서명자를 변경하실 수 없습니다.<br/>등록 전에 서명자의 정보가 맞는지 확인해주세요.</div>

                            <div>* 계약 당사자들의 초대 코드와 이메일을 받아 입력한 뒤 [서명자 추가] 기능을 통해 서비스에 초대하실 수 있습니다.</div>
                        </div>
                    </div>
                </div>
                <button className="big-friendly-button top-no-border" onClick={this.onClickNext}> 다음 단계로 </button>
            </div>
		</div>);
	}
}