import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import {
    request_email_verification_code,
    check_email_verification_code,
    request_phone_verification_code,
    check_phone_verification_code,
    register_new_account,
} from "../../common/actions"
import Web3 from "../../common/Web3"

import {
    makeAuth,
    makeMnemonic,
    showMnemonic,
    mnemonicToSeed,
    SeedToMasterKeyPublic,
    SeedToMasterKeyPublicContract,
    SeedToEthKey,
    BrowserKeyBIP32,
    makeSignData,
    aes_encrypt,
    ecdsa_verify,
    new_account
} from "../../common/crypto_test"

let mapStateToProps = (state)=>{
	return {
	}
}

let mapDispatchToProps = {
    request_email_verification_code,
    check_email_verification_code,
    request_phone_verification_code,
    check_phone_verification_code,
    register_new_account,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
		this.state={
            step:0,
            step1:0,
            sort_test:[]
        };
        {
            this.info1 = `E-Contract 이용약관 v0.0.1
E-Contract 이용약관(버전 0.0.1)
<제1장 총칙>
제1조 (목적)
본 약관은 주식회사 피르마 솔루션즈(이하 회사라 함)이 제공하는 E-Contract 이용과 관련하여, 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
제2조 (용어의 정의)
①본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
서비스 : 블록체인 기반 전자계약 플랫폼 E-contract을 말합니다. (URL : http://e-contract.io)
이용자 : 서비스를 이용하는 회원 또는 비회원을 말합니다.
회원 : 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
비회원 : 서비스에 가입하지 않고 서비스가 제공하는 정보 및 서비스를 이용하는 자를 말합니다.
개인정보 : 서비스를 이용하기 위해 회원이 입력하여 서비스에 기재되는 이메일, 이름, 휴대폰 번호, 주소, 롭스텐 이더리움 프라이빗 키 등 회원의 개인정보를 말합니다.
서명 요청자: 서명 참여자에게 문서에 대한 전자서명을 요청하는 회원을 말합니다.
서명 참여자 : 서명 요청자로부터 전자서명을 요청받은 문서에 전자서명을 하는 이용자를 말합니다.
② 이 약관에서 사용하는 용어의 정의는 제1항에서 정하는 것을 제외하고는 관련법령에서 정하는 바에 의하며, 관련 법령에서 정하지 않는 것은 일반적인 상관례에 의합니다.
제3조 (약관의 게시와 개정)
① 회사는 이 약관의 내용과 상호, 대표자의 성명, 사업자등록번호, 연락처 등을 이용자가 알 수 있도록 서비스 초기화면에 게시하거나 기타의 방법으로 회원에게 공지합니다.
② 회사는 약관의 규제에 관한 법률, 전기통신기본법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 개정약관의 적용일자 7일전부터 적용일자 전일까지 회원의 이메일 주소로 공지합니다. 단 회원의 권리, 의무에 중대한 영향을 주는 변경의 경우에는 적용일자 30일 전부터 공지하도록 합니다. 회원의 이메일 주소 변경 등으로 인하여 개별 통지가 어려운 경우, 회원의 이메일 주소로 공지를 하였음에도 반송된 경우 이 약관에 의한 공지를 함으로써 개별 통지한 것으로 간주합니다.
④ 회원은 변경된 약관에 대해 거부할 권리가 있습니다. 회사가 제3항의 공지 또는 통보를 하면서 개정 약관의 적용/시행일까지 회원이 거부 의사를 표시하지 아니할 경우 약관의 개정에 동의한 것으로 간주한다는 내용을 고지하였으나, 회원이 명시적으로 약관 변경에 대한 거부의사를 표시하지 아니하면, 회사는 회원이 적용/시행일자 부로 변경 약관에 동의한 것으로 간주합니다. 개정/변경 약관에 대하여 거부의사를 표시한 회원은 계약의 해지 또는 회원 탈퇴를 선택할 수 있습니다.
제4조 (약관의 해석)
① 회원이 회사와 개별계약을 체결하여 서비스를 이용하는 경우 회사는 개별 서비스에 대한 이용약관 또는 운영정책 등(이하 운영정책 등)을 둘 수 있으며, 해당 내용이 본 약관과 상충되는 경우 개별서비스에 대한 운영정책 등이 우선합니다.
② 이 약관에서 규정하지 않은 사항에 관해서는 약관의 규제에 관한 법률, 전기통신기본법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등의 관계법령에 따릅니다.
제5조 (이용계약의 성립)
① 회사와 회원 사이의 서비스 이용계약(이하 이용계약이라 함)은 서비스를 이용하고자 하는 자(이하 가입신청자라 함)의 회원가입의 이용신청 및 본 약관과 개인정보 처리방침의 내용에 대한 동의에 대한 회사의 이용승낙으로 성립합니다.
② 본 약관 및 개인정보처리방침에 대한 동의의 의사표시는 가입신청자가 가입신청 당시 회원가입 버튼을 누름으로써 성립합니다. 이와 동시에 위 가입신청자가 본 약관 및 개인정보처리방침에 대하여 동의한 것으로 간주합니다.
③ 회사는 가입신청자의 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다. 다만, 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
실명이 아니거나 타인의 명의를 이용한 가입신청의 경우
허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우
만 14세 미만 아동이 정보통신망 이용촉진 및 정보보호 등에 관한 법률에서 정한 개인정보 입력 시 법정대리인의 동의를 얻지 아니한 경우
가입신청자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며 신청하는 경우
④ 회사는 서비스관련설비의 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우에는 승낙을 유보할 수 있습니다.
⑤ 회사가 제2항, 제3항 및 제5항에 따라 회원가입신청을 승낙하지 아니하거나 유보한 경우, 회사는 원칙적으로 그 사실을 가입신청자에게 알리도록 합니다.
⑥ 이용계약의 성립 시기는 회사가 가입완료를 신청절차 상에서 표시한 시점으로 합니다.
⑦ 회사는 회원에 대해 회사정책에 따라 등급별로 구분하여 이용시간, 이용횟수, 서비스 메뉴 등을 세분하여 이용에 차등을 둘 수 있습니다.
⑧ 이 약관은 회원이 이 약관에 동의한 날로부터 회원 탈퇴 시까지 적용하는 것을 원칙으로 합니다. 단, 이 약관의 일부 조항은 회원이 탈퇴 후에도 유효하게 적용될 수 있습니다.
제6조 (이용자 정보의 제공)
① 회원으로 가입하여 서비스를 이용하고자 하는 이용자는 이메일, 이름, 휴대폰 번호, 주소등 정보를 제공하고, 이메일 인증을 하여야 합니다.
② 이용자가 제1항에서 정한 인증을 거치지 않은 경우 서비스 이용이 제한될 수 있으며, 실명으로 등록하지 않은 이용자 또는 회원은 일체의 권리를 주장할 수 없습니다.
③ 타인의 명의를 도용하여 이용신청을 한 회원의 모든 ID는 삭제되며, 관계법령에 따라 처벌을 받을 수 있습니다.
제7조 (개인 정보의 보호 및 관리)
① 회사는 관계 법령이 정하는 바에 따라 계정정보를 포함한 회원의 개인정보를 보호하기 위하여 노력합니다. 회원의 개인정보 보호 및 사용에 대해서는 회사가 별도로 고지하는 개인정보 처리방침에 따릅니다. 다만, 회사가 제공하는 공식 서비스 사이트 이외의 링크된 사이트에서는 회사의 개인정보처리방침이 적용되지 않습니다.
② 회사는 회원의 귀책사유로 인하여 노출된 회원의 계정정보를 포함한 모든 정보에 대해서는 일체의 책임을 지지 않습니다.
제8조 (회원의 계정 및 비밀번호)
① 회원은 서비스의 원활한 이용 및 회원의 정보보호, 서비스 이용안내 등의 편의를 위하여 이용자가 선정한 ID를 계정으로 사용합니다. 다만, 회사는 회원의 계정이 반사회적이거나 미풍양속을 해치거나 또는 운영자로 오인할 우려가 있는 경우 등에는 해당 계정의 사용을 거부하거나 제한할 수 있습니다
② 회사는 계정정보를 통하여 당해 회원의 서비스 이용가능여부 등 제반 이용자 관리 업무를 수행합니다.
③ 회원은 자신의 계정정보를 선량한 관리자로서의 주의의무를 다하여 관리 하여야 합니다. 회원이 본인의 계정정보를 소홀히 관리하거나 제3자에게 이용을 승낙함으로써 발생하는 손해에 대하여는 회원에게 책임이 있습니다.
④ 회원은 회사가 정한 기준을 충족하는 범위 내에서 자유롭게 비밀번호를 정할 수 있으며, 정해진 비밀번호는 회원이 원하는 경우 언제든지 변경이 가능합니다.
⑤ 회원은 서비스의 이용을 위하여 사용하는 비밀번호에 대한 보호 및 관리 책임을 부담합니다. 다만, 회사는 보안 등을 이유로 회원에게 정기적 또는 비정기적으로 비밀번호의 변경을 권고할 수 있습니다.
제9조 (회원에 대한 통지)
① 회사가 회원에 대한 통지를 하는 경우 본 약관에 별도 규정이 없는 한 회원이 계정으로 사용하는 이메일 주소로 할 수 있습니다.
② 회사는 회원 전체에 대한 통지의 경우 7일 이상 회사의 홈페이지 또는 공지사항 게시판에 게시함으로써 제1항의 통지에 갈음할 수 있습니다.
제10조 (서비스의 제공시간 및 중지)
① 회사는 회원의 회원가입을 승낙한 때부터 서비스를 개시합니다. 단, 일부 서비스의 경우, 회사의 필요에 따라 지정된 일자부터 서비스를 제공할 수 있습니다.
② 제2항 단서의 경우 회사는 그 내용 및 시간을 홈페이지에 공지합니다. 다만, 회사가 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.
③ 회사는 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검시간은 서비스 제공화면에 공시한 바에 따릅니다.
제11조 (서비스의 내용 및 변경)
① 회원은 회사가 제공하는 서비스를 이 약관, 운영정책 등 회사가 정한 규칙에 따라 이용할 수 있습니다.
② 회사가 회원에게 제공하는 서비스에 대하여 회사는 제작, 변경, 유지, 보수에 관한 포괄적인 권한을 가집니다.
③ 회사는 새로운 서비스 내용, 각종 버그 패치 등 서비스의 운영상 또는 기술상의 필요한 경우, 제공하고 있는 서비스의 전부 또는 일부를 상시적으로 수정, 추가, 폐지 등 변경할 수 있습니다.
④ 회사는 무료로 제공되는 서비스의 일부 또는 전부를 회사의 정책 기획이나 운영상 또는 회사의 긴박한 상황 등 필요에 의해 수정, 중단, 변경할 수 있으며, 이에 대하여 관련 법령상 특별한 규정이 없는 한 회원에게 별도의 보상을 하지 않습니다.
⑤ 회사는 다음 각호에 해당하는 경우 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.
전시, 사변, 천재지변 또는 국가비상사태 등 불가항력적인 사유가 있는 경우
정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우
서비스용 설비의 보수 등 공사로 인한 부득이한 경우
기타 회사의 제반 사정으로 서비스를 할 수 없는 경우
⑥ 회사는 서비스가 변경되거나 중지된 원인이 회사의 고의 또는 중대한 과실로 인한 경우를 제외하고는 서비스의 변경 및 중지로 발생하는 문제에 대해서 책임을 부담하지 않습니다.
제12조 (정보의 제공 및 광고의 게재)
① 회사는 회원이 서비스 이용 중 필요하다고 인정되는 다양한 정보를 회사의 홈페이지에 게시하거나 이메일 등을 이용하여 회원에게 제공할 수 있습니다. 다만, 회원은 관련 법령에 따른 거래관련 정보, 고객센터 답변 등을 제외한 정보의 전송에 대하여 언제든지 이메일 등을 통하여 수신거절의 의사표시를 할 수 있습니다.
② 회사는 본 서비스 등을 유지하기 위하여 광고를 게재할 수 있으며, 회원은 서비스 이용 시 노출되는 광고게재에 대하여 동의합니다.
③ 회사가 제공하는, 제3자가 주체인, 제2항의 광고에 회원이 참여하거나 교신 또는 거래를 함으로써 발생하는 손실과 손해에 대해서 회사는 어떠한 책임도 부담하지 않습니다.
④ 회사는 적법하게 수집한 회원의 개인정보를 활용하여 제2항의 광고 등을 메일주소 등을 활용하여 발송할 수 있으며, 이용자가 원하지 않는 경우에는 언제든지 수신을 거부할 수 있습니다.
제13조 (권리의 귀속)
서비스 및 서비스 내 회사가 제작한 콘텐츠 등에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.
제14조 (회원의 계약해제해지 등)
① 회원은 홈페이지에 개제된 회사 연락처에 연락하여 탈퇴 신청을 할 수 있으며, 회사는 관련법령 등에서 정하는 바에 따라 이를 즉시 처리하여야 합니다.
② 다음 각호에 해당하는 경우를 제외하고, 회원의 모든 정보는 탈퇴 시점 이후 바로 삭제되며 복구할 수 없습니다.
    관련법령 및 회사의 개인정보 처리방침에서 정한 바에 따라 특별히 회원과 관계된 정보를 저장해야할 때
③ 회원은 탈퇴 시점 이후 동일한 이메일 주소로 다시 가입할 수 없습니다.
제15조 (이용제한 등)
① 회사는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 서비스 이용을 경고, 일시정지, 계약해지로 단계적으로 제한할 수 있습니다.
② 회사는 제1항의 규정에도 불구하고, 주민등록법을 위반한 명의도용 및 결제도용, 저작권법 및 컴퓨터프로그램보호법을 위반한 불법프로그램의 제공 및 운영방해, 정보통신망 이용촉진 및 정보보호 등에 관한 법률을 위반한 불법통신 및 해킹, 악성프로그램의 배포, 접속권한 초과행위 등과 같이 관련법령을 위반한 경우에는 즉시 계약을 해지 할 수 있습니다. 이에 따른 계약해지시 서비스 이용을 통해 획득한 혜택 등은 모두 소멸되며, 회사는 이에 대해 별도로 보상하지 않습니다.
③ 회사가 위 제1항에 따라 회원의 서비스 이용을 제한하거나 계약을 해지하는 경우, 제한의 조건 및 세부내용은 이용제한정책 등에서 정한 바에 따르며, 회사는 제9조에서 정한 방법으로 통지합니다.
④ 회원은 회사의 이용제한 조치 등에 대하여 회사가 정한 절차에 따라 이의신청을 할 수 있습니다. 회원의 이의 사유가 정당하다고 인정되는 경우 회사는 즉시 회원의 서비스 이용을 재개하여야 합니다.
제16조(전자문서 법적효력에 대한 확인)
① 전자서명에 사용되는 전자문서는 전자문서및전자거래기본법 제4조 제1항에 의해 전자적 형태로 되어 있다는 이유로 문서로서의 효력이 부인되지 않습니다.
② 민법 제450조의 확정일자 있는 증서와 같이 다른 법령에 특별한 규정이 있을 경우 전자문서의 법적 효력이 인정되지 않을 수 있습니다.
③ 서명 요청자는 전자서명에 사용하는 전자문서가 법령에 의해 법적 효력이 인정되지 않는지 확인하고 서명을 요청해야 합니다. 만약 해당 사실을 인지하지 못해 문제가 발생할 경우 회사는 책임지지 않습니다.
제17조(전자서명 법적효력에 대한 확인)
1) 전자서명에 사용되는 서명(사인, 도장)은 반드시 서명 참여자의 동의가 있어야 입력되며, 전자서명법 제3조 제3항에 의해 당사자간의 약정에 따른 서명, 서명날인 또는 기명날인으로서의 효력을 가집니다.
2) 전자서명에 사용되는 서명은 공인인증서를 사용하지 않는 일반전자서명으로써, 법령에 공인전자서명을 사용하도록 명시한 특별한 규정이 있을 경우 서명의 법적 효력이 인정되지 않을 수 있습니다.
3) 서명 요청자는 전자서명에 사용하는 서명이 법령에 의해 법적 효력이 인정되지 않는지 확인하고 서명을 요청해야 합니다. 만약 해당 사실을 인지하지 못해 문제가 발생할 경우 회사는 책임지지 않습니다.
제18조(서명 참여자에 대한 확인)
① 서명 요청자는 서명 참여자 실명, 본인 소유 이메일, 휴대폰 전화번호 여부를 확인을 하고 서명을 요청해야합니다.
② 회사는 서명 요청자가 서명 권한을 가지지 않는 서명 참여자에게 서명을 요청함으로 인해 발생한 문제에 대해 책임지지 않습니다.
③ 서명 요청자는 이메일, 휴대폰 본인 인증, 접근 암호 인증 등과 같은 본인인증 수단을 통해 본인 확인을 할 수 있습니다.
<제3장 기타>
제19조 (최소 사용 환경)
① 이용자는 아래 각 호에 해당하는 최소 사용 환경에서 서비스를 이용해야 합니다.
운영체제 : Mac(Mavericks 이상), Windows7 이상
브라우저 : Chrome(49 이상)
쿠키 : 모든 쿠키 허용
② 최소 사용 환경을 충족하지 못하는 환경에서 서비스를 이용할 경우, 이와 발생하는 문제에 대해 회사는 책임지지 않습니다.
제20조 (회사의 의무)
① 회사는 본 약관 및 관련법령에서 금지하는 행위 및 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적인 서비스의 제공을 위하여 최선을 다하여 노력합니다.
② 회사는 회원이 안전하게 서비스를 이용할 수 있도록 신용정보를 포함한 일체의 개인정보 보호를 위한 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.
③ 회사는 회원으로부터 제기되는 의견이나 불만이 정당하다고 객관적으로 인정될 경우에는 합리적인 기간 내에 신속하게 처리하여야 합니다. 다만, 처리에 장기간이 소요되는 경우 회원에게 게시판 또는 이메일 등을 통하여 지체 사유를 안내하고 처리과정 및 처리결과를 전달합니다.
④ 회사는 이용계약의 체결, 계약사항의 변경 및 해지 등 이용자와의 계약관련 절차 및 내용 등에 있어 이용자에게 편의를 제공하도록 노력합니다.
제21조 (회원의 의무)
① 회원은 회사에서 제공하는 서비스를 본래의 이용 목적 이외의 용도로 사용하거나 다음 각 호에 해당하는 행위를 해서는 안됩니다.
가입신청 또는 정보 변경을 목적으로 회사에 개인정보 등록시 실명이 아닌 정보 또는 다른 사람의 정보를 사용하거나 허위 사실을 기재하는 행위
타인으로 가장하거나 타인과의 관계를 허위로 명시하는 행위, 다른 회원의 계정 및 비밀번호를 도용, 부정하게 사용하는 행위
알려지거나 알려지지 않은 버그를 악용하여 서비스를 이용하는 행위
회사 및 제3자의 명예를 훼손하거나 업무를 방해하거나 회사 및 제3자에게 손해를 가하는 행위
회사의 지적재산권, 제3자의 지적재산권, 초상권 등 기타 권리를 침해하거나 회사의 승인을 받지 않고 다른 회원의 개인정보를 수집, 저장, 유포, 게시하는 행위
제3자를 기망하여 이득을 취하거나 회사가 제공하는 서비스를 불건전하게 이용하거나 하여 제3자에게 피해를 주는 행위
회사로부터 특별한 권리를 부여받지 않고 사이트를 변경하거나 사이트에 다른 프로그램을 추가 또는 삽입하거나 서버를 해킹, 역설계, 소스코드의 유출 및 변경, 별도의 서버를 구축하거나 웹사이트의 일부분을 임의로 변경 또는 도용하여 회사를 사칭하는 행위
회사의 직원이나 운영자를 가장, 사칭하거나 또는 타인의 명의를 도용하여 문서를 등록하거나 메일을 발송하는 행위
회사의 동의 없이 영리, 영업, 광고, 정치활동, 불법선거운동 등을 목적으로 서비스를 이용하는 행위
기타 공공질서 및 미풍양속을 위반하거나 불법적, 부당한 행위 및 법령에 위배되는 행위
② 회원은 회사 홈페이지 상의 공지사항 및 이용약관의 수정사항 등을 확인하고 이를 준수할 의무가 있으며 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
③ 회원의 계정에 관한 관리 책임은 회원에게 있으며, 이를 제3자가 이용하도록 하여서는 안 됩니다.
④ 회사는 제1항, 제2항 및 다음 각 호의 어느 하나에 해당하는 행위의 구체적인 유형을 운영 정책에서 정할 수 있으며, 회원은 이를 준수할 의무가 있습니다.
회원의 계정명, 비밀번호의 정함에 대한 제한
기타 회원의 서비스 이용에 대한 본질적인 권리를 침해하지 않는 범위 내에서 회사가 운영상 필요하다고 인정되는 사항
제22조 (손해배상)
① 회원이 본 약관의 의무를 위반함으로 인하여 회사에 손해를 입힌 경우 또는 회원이 서비스의 이용과 관련하여 회사에 손해를 입힌 경우 회원은 회사에 대하여 손해를 배상하여야 합니다.
② 회원이 서비스를 이용함에 있어 행한 불법행위 또는 본 약관을 위반한 행위로 회사가 당해 이용자 외의 제3자로부터 손해배상청구 또는 소송 등 각종 이의제기를 받는 경우 당해 회원은 자신의 책임과 비용으로 회사를 면책시켜야 하며, 회사가 면책되지 못한 경우 당해 이용자는 그로 인하여 회사에 발생한 모든 손해를 배상할 책임이 있습니다.
제23조 (책임의 한계)
① 회사는 천재지변 또는 국가 정책 등 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
② 회사는 회원의 귀책사유로 인한 서비스 중지 또는 이용의 장애, 기간통신사업자가 전기통신서비스를 중지하거나 정상적으로 제공하지 아니하여 회원에게 손해가 발생한 경우에는 책임이 면제됩니다.
③ 회사는 회원이 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.
④ 회사는 회원 간 또는 회원과 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우에는 책임이 면제됩니다.
⑤ 회사는 무료로 제공되는 서비스 이용과 관련하여 관련법령에 특별한 규정이 없는 한 책임을 지지 않습니다.
제24조 (준거법 및 재판관할)
① 회사와 회원 간 제기된 소송은 대한민국법을 준거법으로 합니다.
② 회사와 회원간 발생한 분쟁에 관한 소송은 민사소송법 상의 관할법원에 제소합니다.
제 25조 (전자서명 이용약관의 적용)
회원이 서명 요청자로서 서명 참여자에게 전자서명을 요청할 경우 전자서명 이용약관이 함께 적용됩니다.`
            this.info2 = `개인정보처리방침 v0.0.1
개인정보처리방침(버전 0.0.1)
주식회사 피르마 솔루션즈(이하, "회사"라 함)은 E-Contract(이하, 서비스라 함)을 운영하며 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법, 통신비밀보호법, 전기통신사업법 등 정보통신서비스제공자가 준수하여야 할 관련 법령상의 개인정보보호 규정을 준수하며, 관련 법령에 의거한 개인정보처리방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다.
본 개인정보처리방침은 서비스에 회원 가입한 이용자에 대하여 적용되며, 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 회사가 개인정보 보호를 위하여 어떠한 조치를 취하고 있는지 알리기 위한 목적으로 작성되었습니다.
수집하는 개인정보의 항목 및 수집방법
1) 수집하는 개인정보의 항목
(1) 회사는 최초 회원 가입시 원활한 고객상담, 서비스 제공을 위해 아래와 같은 최소한의 개인정보를 필수항목으로 수집하고 있습니다.
- 필수항목 : 이메일, ID, 이름, 비밀번호, 주소, 
- 선택항목 : 롭스텐 이더리움 주소
(2) 서비스 이용 과정이나 사업처리 과정에서 아래와 같은 정보들이 추가로 수집될 수 있습니다.
- 서비스 이용 정보 : 휴대폰 번호, IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록, 브라우저 정보, 운영체제 정보(OS), 사용 기기 정보, MAC 주소, 방문 일시 등
2) 개인정보 수집방법
회사는 다음과 같은 방법으로 개인정보를 수집합니다.
(1) 홈페이지, 서면양식, 전화, 이메일,
(2) 협력회사로부터의 제공
(3) 생성정보 수집 툴을 통한 수집
개인정보의 수집 및 이용목적
1) 회원관리
회원제 서비스 제공, 개인식별, 이용약관 위반 회원에 대한 이용제한 조치, 서비스의 원활한 운영에 지장을 미치는 행위 및 서비스 부정이용 행위 제재, 가입의사 확인, 가입 및 가입횟수 제한, 만14세 미만 아동의 개인정보 수집 시 법정 대리인 동의여부 확인, 추후 법정 대리인 본인확인, 분쟁 조정을 위한 기록보존, 불만처리 등 민원처리, 고지사항 전달, 회원탈퇴 의사의 확인 등
2) 신규 서비스 개발 및 마케팅광고에의 활용
신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트 정보 및 참여기회 제공, 광고성 정보 제공, 접속빈도 파악, 회원의 서비스이용에 대한 통계
3) 법적 증거로 활용
법적 분쟁시 증거자료 제출
개인정보의 공유 및 제공
회사는 이용자들의 개인정보를 "2. 개인정보의 수집목적 및 이용목적"에서 고지한 범위 내에서 사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 이용자의 개인정보를 외부에 공개하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
1) 이용자가 사전에 동의한 경우
2) 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
개인정보의 취급 위탁
회사는 서비스 향상을 위해 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
1) Amazon Web Services Inc. : 개인정보가 저장된 국내외 클라우드 서버 운영 및 관리
개인정보의 보유 및 이용기간
이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 상법, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원 정보를 보관합니다. 이 경우 회사는 보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은 아래와 같습니다.
1) 계약 또는 청약철회 등에 관한 기록
- 보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
- 보존 기간 : 5년
2) 대금결제 및 재화 등의 공급에 관한 기록
- 보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
- 보존 기간 : 5년
3) 소비자의 불만 또는 분쟁처리에 관한 기록
- 보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
- 보존 기간 : 3년
4) 웹사이트 방문기록
- 보존 이유 : 통신비밀보호법
- 보존 기간 : 3개월
개인정보 파기절차 및 방법
이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 회사의 개인정보 파기절차 및 방법은 다음과 같습니다.
1) 파기절차
- 이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한정보보호 사유에 따라(보유 및 이용기간 참조)일정 기간 저장된 후 파기됩니다.
- 동 개인정보는 법률에 의한 경우가 아니고서는 보유되는 이외의 다른 목적으로 이용되지 않습니다.
2) 파기방법
- 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
- 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
이용자 및 법정대리인의 권리와 그 행사방법
- 이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며, 회사의 개인정보의 처리에 동의하지 않는 경우 동의를 거부하거나 가입해지(회원탈퇴)를 요청하실 수 있습니다. 다만, 그러한 경우 서비스의 일부 또는 전부 이용이 어려울 수 있습니다.
- 이용자 혹은 만 14세 미만 아동의 개인정보 조회, 수정을 위해서는 '개인정보변경'(또는 '회원정보수정' 등)을, 가입해지(동의철회)를 위해서는 서비스에 공개된 회사 연락처에 직접 연락하거나 서비스내 회원 탈퇴 기능을 통해 파기할 수 있습니다.
- 혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.
- 이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3 자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록 하겠습니다.
- 회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항
1) 쿠키란?
- 회사는 개인화되고 맞춤화된 서비스를 제공하기 위해서 이용자의 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
- 쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에게 보내는 아주 작은 텍스트 파일로 이용자 컴퓨터의 하드디스크에 저장됩니다. 이후 이용자가 웹 사이트에 방문할 경우 웹 사이트 서버는 이용자의 하드 디스크에 저장되어 있는 쿠키의 내용을 읽어 이용자의 환경설정을 유지하고 맞춤화된 서비스를 제공하기 위해 이용됩니다.
- 쿠키는 개인을 식별하는 정보를 자동적/능동적으로 수집하지 않으며, 이용자는 언제든지 이러한 쿠키의 저장을 거부하거나 삭제할 수 있습니다.
2) 회사의 쿠키 사용 목적
- 회사는 쿠키를 통해 이용자가 선호하는 설정 등을 저장하여 이용자에게 보다 빠른 웹 환경을 지원하며, 편리한 이용을 위해 서비스 개선에 활용합니다.
- 회사는 쿠키를 통해 서비스의 접속 빈도, 방문 시간, 방문 회수 등을 분석하여 이용자의 취향과 관심분야를 파악하여 서비스 제공에 활용합니다.
3) 쿠키의 설치/운영 및 거부
- 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
- 다만, 쿠키의 저장을 거부할 경우에는 감사 추적 인증서 등 온라인 계약을 진행함에 있어 서비스의 기능이 제대로 동작하지 않을 수 있으며, 이와 관련하여 회사는 책임지지 않습니다.
- 쿠키 설치 허용 여부를 지정하는 방법(Internet Explorer의 경우)은 다음과 같습니다.
① [도구] 메뉴에서 [인터넷 옵션]을 선택합니다.
② [개인정보 탭]을 클릭합니다.
③ [개인정보취급 수준]을 설정하시면 됩니다.
개인정보의 기술적/관리적 보호 대책
회사는 이용자의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.
1) 비밀번호 암호화
서비스 이용자의 비밀번호는 암호화되어 저장 및 관리되고 있어 본인만이 알고 있으며, 개인정보의 확인 및 변경도 비밀번호를 알고 있는 본인에 의해서만 가능합니다.
2) 해킹 등에 대비한 대책
회사는 해킹이나 컴퓨터 바이러스 등에 의해 회원의 개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을 다하고 있습니다.
개인정보의 훼손에 대비해서 자료를 수시로 백업하고 있고, 최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가 누출되거나 손상되지 않도록 방지하고 있으며, 암호화 통신 등을 통하여 네트워크상에서 개인정보를 안전하게 전송할 수 있도록 하고 있습니다. 그리고 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있으며, 기타 시스템적으로 보안성을 확보하기 위한 가능한 모든 기술적 장치를 갖추려 노력하고 있습니다.
3) 처리 직원의 최소화 및 교육
회사의 개인정보관련 처리 직원은 담당자에 한정시키고 있고 이를 위한 별도의 비밀번호를 부여하여 정기적으로 갱신하고 있으며, 담당자에 대한 수시 교육을 통하여 서비스 개인정보처리방침의 준수를 항상 강조하고 있습니다.
4) 개인정보보호전담기구의 운영
그리고 사내 개인정보보호전담기구 등을 통하여 서비스 개인정보처리방침의 이행사항 및 담당자의 준수여부를 확인하여 문제가 발견될 경우 즉시 수정하고 바로 잡을 수 있도록 노력하고 있습니다. 단, 이용자 본인의 부주의나 인터넷상의 문제로 ID, 비밀번호 등 개인정보가 유출되어 발생한 문제에 대해 회사는 일체의 책임을 지지 않습니다.
개인정보관리책임자 및 담당자의 연락처
이용자는 회사의 서비스를 이용하며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자 혹은 담당부서로 신고하실 수 있습니다. 회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.
개인정보 관리 책임자
이 름 : 이광규
소 속 : 개발부서
직 위 : 기술이사
메 일 :reve@firma-solutions.com
기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
- 개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)
- 대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-3571)
- 경찰청 사이버안전국 (www.ctrc.go.kr / 국번없이 182)
11.적용범위
서비스에 링크되어 있는 다른 웹사이트들이 개인정보를 수집하는 행위에 대해서는 본 서비스 개인정보처리방침"이 적용되지 않음을 알려 드립니다. 또한 본 서비스 개인정보처리방침은 회사와 이용계약을 체결한 회원에 한해 적용됩니다.
고지의 의무
현 개인정보처리방침 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일전부터 이메일을 통해 고지할 것입니다. 다만 개인정보의 수집 및 활용, 제3자 제공 등과 같이 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 고지합니다.
전자서명 개인정보처리방침의 적용
이용자가 서명 요청자로서 서명 참여자에게 전자서명을 요청할 경우 전자서명 개인정보처리방침이 함께 적용됩니다.`
        }
	}

	componentDidMount(){
    }

    goBack = ()=>{
        if(this.state.step == 0){
            history.goBack()
        }else{
            this.setState({
                step: this.state.step -1
            })
        }
    }

    next_term = ()=>{
        this.setState({
            step: this.state.step+1
        })
    }

    onClickRequestEmail =  async()=>{
        if(!this.state.email)
            return alert("이메일을 입력해주세요!")

        await window.showIndicator();
        let resp = await this.props.request_email_verification_code(this.state.email)
        if(resp == 1){
            alert("이메일이 발송되었습니다!")
            this.setState({
                step1:1
            })
        }else if(resp == -1){
            alert("이미 가입 된 이메일입니다!")
        }else if(resp == -3){
            alert("유효하지 않은 이메일입니다.")
        }else{
            alert("인증번호 전송에 문제가 생겼습니다! 이메일을 정확히 기입해주세요.\n계속 문제가 발생할 경우 관리자에게 문의해주세요.")
        }
        await window.hideIndicator();
    }

    onClickVerificateEmail = async()=>{
        if(this.state.verification_code == null || this.state.verification_code.length !=4){
            return alert('인증번호는 4자리입니다.')
        }

        await window.showIndicator();
        let resp = await this.props.check_email_verification_code(this.state.email, this.state.verification_code)
        if(resp == 1){
            this.setState({
                step: this.state.step+1
            })
        }else{
            alert("잘못된 인증번호입니다.")
        }
        await window.hideIndicator();
    }

    onClickRequestPhone = async()=>{
        if(this.state.userphone == null || this.state.userphone.length != 13 || !/^0\d{2}-\d{4}-\d{4}$/.test(this.state.userphone))
            return alert("전화번호를 정확히 입력해주세요!")
            
        await window.showIndicator();
        let resp = await this.props.request_phone_verification_code(this.state.userphone)
        if(resp == 1){
            alert("인증번호가 발송되었습니다!")
            this.setState({
                phone_verification_code_sent:true
            })
        }else{
            alert("인증번호 전송에 문제가 생겼습니다!\n계속 문제가 발생할 경우 관리자에게 문의해주세요.")
        }
        await window.hideIndicator();
    }

    onClickVerificatePhone = async()=>{
        if(this.state.phone_verification_code == null || this.state.phone_verification_code.length !=4){
            return alert('인증번호는 4자리입니다.')
        }
        await window.showIndicator();
        let resp = await this.props.check_phone_verification_code(this.state.userphone, this.state.phone_verification_code)
        if(resp == 1){
            alert("정상적으로 인증되었습니다.")
            this.setState({
                verificated_phone:true
            })
        }else{
            alert("잘못된 인증번호입니다.")
        }
        await window.hideIndicator();
    }

    onChangePhoneForm = async(name, e)=>{
        let text = e.target.value;
        text = text.replace(/[^0-9]/g,"")
        if(text.length >= 8){
            text = `${text.slice(0,3)}-${text.slice(3,7)}-${text.slice(7,11)}`
        }else if(text.length >= 4){
            text = `${text.slice(0,3)}-${text.slice(3,7)}`
        }else{
            text = `${text.slice(0,3)}`
        }
        
        this.setState({
            [name]:text
        })
    }

    onClickNextBtnAccountInfo = async()=>{
        if(!this.state.user_id){
            return alert("아이디를 입력해주세요!")
        }
        if(this.state.password.length < 6){
            return alert("비밀번호는 최소 6글자입니다.")
        }
        if(this.state.password !== this.state.password2){
            return alert("비밀번호가 일치하지 않습니다.")
        }

        this.setState({
            step: this.state.step+1
        })
    }

    onClickFindAddress = async()=>{
        await window.showIndicator()
        let address = await new Promise(r=>daum.postcode.load(function(){
            new daum.Postcode({
                oncomplete: r,
                onclose:r
            }).open();
        }));

        this.setState({
            useraddress: address.roadAddress+ " "
        })
        await window.hideIndicator()
    }

    onClickNextBtnUserInfo = async()=>{
        if(!this.state.username)
            return alert("이름을 작성해주세요.")
        if(!this.state.verificated_phone)
            return alert("휴대폰 인증을 해주세요.")
        if(!this.state.useraddress)
            return alert("주소를 입력해주세요.")

        let account = new_account(this.state.user_id, this.state.password);
        this.setState({
            step:this.state.step + 1,
            account:account,
            mnemonic:account.rawMnemonic,
        })
    }

    onClickSaveMnemonic = ()=>{
        let anchor = document.createElement('a');
        anchor.target = "_blank";
        anchor.href = "/static/recovery_phrase_document.pdf";
        anchor.click();
    }

    onClickSortTest = (e)=>{
        let sort_test = [...this.state.sort_test]
        let idx = sort_test.indexOf(e)
        if( idx >= 0 ){
            sort_test.splice(idx,1)
        }else{
            sort_test.push(e)
        }

        this.setState({
            sort_test:sort_test
        })
    }

    onClickFinishSortTest = async()=>{
        if(this.state.sort_test.map(e=>this.state.mnemonic.split(" ")[e]).join(" ") !== this.state.mnemonic){
            return alert("순서가 맞지 않습니다. 다시 한번 확인해주세요!")
        }
        
        let info = {
            email: this.state.email,
            username: this.state.username,
            userphone: this.state.userphone,
            useraddress: this.state.useraddress,
        }

        let keyPair = SeedToEthKey(this.state.account.seed, "0'/0/0");
        let privateKey = "0x"+keyPair.privateKey.toString('hex');

        let wallet = Web3.walletWithPK(privateKey)
        console.log(wallet)
        let encryptedInfo = aes_encrypt(JSON.stringify(info), this.state.account.masterKeyPublic);
        
        await window.showIndicator()
        let resp = await this.props.register_new_account(this.state.account, encryptedInfo, this.state.email, this.state.username, wallet.address)
        await window.hideIndicator()

        if(resp.code == 1){
            localStorage.setItem("browser_key_virgin", 0);
            history.push("/login");
            return alert("회원가입에 성공하였습니다.")
        }else{
            return alert(resp.error)
        }
    }

   keyPress = async(type, e) => {
      if(e.keyCode == 13){
        switch(type) {
            case 0:
                this.onClickVerificateEmail()
                break;
            case 1:
                this.onClickNextBtnAccountInfo()
                break;
        }
      }
   }
    
    render_term(){
        return (<div>
            <div className="page bottom-no-border">
                <div className="column-800">
                    <div className="form-layout">
                        <div className="form-label"> 서비스 이용약관 </div>
                        <textarea className="form-textarea-info" defaultValue={this.info1} disabled />
                        
                        <div className="form-label"> 개인정보취급방침 </div>
                        <textarea className="form-textarea-info" defaultValue={this.info2} disabled />
                    </div>
                </div>
            </div>
            <button className="big-friendly-button top-no-border" onClick={this.next_term}> 동의 </button>
        </div>)
    }
    
    render_email(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 이메일 인증 </div>
                    <div className="form-input">
                        <input placeholder="이메일을 입력해주세요." 
                               value={this.state.email || ""} 
                               onChange={e=>this.setState({email:e.target.value})}
                               disabled={this.state.step1 == 1} />
                    </div>

                    {this.state.step1 == 1 ? [
                        <div key={0} className="form-label"> 이메일 인증번호 </div>,
                        <div className="form-input" key={1}>
                            <input placeholder="이메일로 발송된 인증번호를 적어주세요." 
                                   value={this.state.verification_code || ""}
                                   onKeyDown={this.keyPress.bind(this, 0)}
                                   onChange={e=>this.setState({verification_code:e.target.value})} />
                        </div>
                    ] : null }

                    <div className="form-submit">
                        { this.state.step1 == 1 ?
                            <button className="border" onClick={this.onClickVerificateEmail}> 확인 </button> : 
                            <button className="border" onClick={this.onClickRequestEmail}> 인증 메일 보내기 </button>
                        }
                    </div>
                </div>
            </div>
        </div>)
    }

    render_account(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> ID </div>
                    <div className="form-input">
                        <input placeholder="ID를 입력해주세요." value={this.state.user_id || ""} onChange={e=>this.setState({user_id:e.target.value})} />
                    </div>
                    
                    <div className="form-label"> 비밀번호 </div>
                    <div className="form-input">
                        <input type="password" placeholder="비밀번호를 최소 6자리 입력해주세요." value={this.state.password || ""} onChange={e=>this.setState({password:e.target.value})}  />
                    </div>

                    <div className="form-label"> 비밀번호 확인 </div>
                    <div className="form-input">
                        <input type="password" placeholder="입력하신 비밀번호를 다시 입력해주세요." value={this.state.password2 || ""} onChange={e=>this.setState({password2:e.target.value})} onKeyDown={this.keyPress.bind(this, 1)} />
                    </div>

                    <div className="form-submit">
                        <button className="border" onClick={this.onClickNextBtnAccountInfo}> 다음 </button>
                    </div>
                </div>
            </div>
        </div>)
    }

    render_personal(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 이메일 </div>
                    <div className="form-input">
                        {this.state.email}
                    </div>
                    
                    <div className="form-label"> 이름 </div>
                    <div className="form-input">
                        <input placeholder="이름을 입력해주세요." value={this.state.username || ""} onChange={e=>this.setState({username:e.target.value})} />
                    </div>

                    <div className="form-label"> 휴대폰 </div>
                    <div className="form-input">
                        <input placeholder="휴대폰" 
                               value={this.state.userphone || ""} 
                               onChange={this.onChangePhoneForm.bind(this,"userphone")}
                               disabled={this.state.phone_verification_code_sent} />
                        <button onClick={this.onClickRequestPhone} style={this.state.phone_verification_code_sent ? {"display":"none"}: null}>전송</button>
                    </div>

                    <div className="form-label"> 인증번호 </div>
                    <div className="form-input">
                        <input placeholder="인증번호를 입력해주세요." 
                               value={this.state.phone_verification_code || ""} 
                               onChange={e=>this.setState({phone_verification_code:e.target.value})} 
                               disabled={this.state.verificated_phone} />
                        <button onClick={this.onClickVerificatePhone} style={this.state.verificated_phone ? {"display":"none"}: null}>확인</button>
                    </div>

                    <div className="form-label"> 주소 </div>
                    <div className="form-input">
                        <input placeholder="주소를 입력해주세요." value={this.state.useraddress || ""} onChange={e=>this.setState({useraddress:e.target.value})} />
                        <button onClick={this.onClickFindAddress}>검색</button>
                    </div>

                    <div className="form-submit">
                        <button className="border" onClick={this.onClickNextBtnUserInfo}> 다음 </button>
                    </div>
                </div>
            </div>
        </div>)
    }

    render_masterkey(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 마스터 키워드 </div>
                    <div className="form-textarea masterkey-list">
                        {this.state.mnemonic.split(" ").map((e,k)=>{
                            return <div key={k} className="masterkey-item">{e}</div>
                        })}
                        <div className="copy" onClick={this.onClickSaveMnemonic}>저장 양식 다운로드</div>
                    </div>
                    
                    <div className="form-submit">
                        <button className="border" onClick={this.next_term}> 다음 </button>
                    </div>
                </div>
            </div>
            <div className="column-300">
                <div className="right-desc">
                    * 전체 계약 잠금 해제시에 필요한 마스터 키워드입니다. 브라우저 및 기기 변경시 보안을 위해 접속하신 기기에서는 잠금 상태로 계약이 로드됩니다. 이전 해제 기록이 있는 계약이라면 해당 키워드를 사용해 일괄 해제 가능합니다.
                </div>
                <div className="right-desc">
                    필요할 때 사용할 수 있도록 상단의 12개의 키워드들을 <u><strong>순서대로</strong></u> 종이에 옮겨 적어 안전하게 보관하십시오. 안전하게 계정을 보호하기 위해서는 전자매체에 저장하거나 타인에게 양도하는 등의 행동을 하지 않는 것을 권장합니다.
                </div>
            </div>
        </div>)
    }

    render_confirm_masterkey(){
        return (<div className="page">
            <div className="column-300">
                <div className="form-layout">
                    <div className="form-label"> 마스터 키워드 확인 </div>
                    <div className="form-textarea masterkey-selection-list">
                        {this.state.sort_test.map((e,k)=>{
                            return <div className="item selected" key={k}>{this.state.mnemonic.split(" ")[e]}</div>
                        })}
                    </div>

                    <div className="masterkey-selection-list">
                        {this.state.mnemonic.split(" ").map((e,k)=>[e,k]).sort(e=>e[0]).map((e,k)=>{
                            return <div key={k} 
                                        className={`item ${this.state.sort_test.indexOf(e[1]) >= 0 ? "selected" : ""}`}
                                        onClick={this.onClickSortTest.bind(this,e[1])}
                                    >
                                {e[0]}
                            </div>
                        })}
                    </div>
                    
                    <div className="form-submit">
                        <button className="border" onClick={this.onClickFinishSortTest}> 가입 완료 </button>
                    </div>
                </div>
            </div>
            <div className="column-300">
                <div className="right-desc">
                    * 앞서 저장해둔 마스터 키워드를 차례대로 배치해 주세요
                </div>
            </div>
        </div>)
    }

    render_content(){
        if(this.state.step == 0){
            return this.render_term();
        }else if(this.state.step == 1){
            return this.render_email();
        }else if(this.state.step == 2){
            return this.render_account();
        }else if(this.state.step == 3){
            return this.render_personal();
        }else if(this.state.step == 4){
            return this.render_masterkey();
        }else if(this.state.step == 5){
            return this.render_confirm_masterkey();
        }
        
    }

	render() {
		return (<div className="default-page register-page">
            <div className="logo">
                <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
            </div>
            <div className="back-key">
                <div className="round-btn" onClick={this.goBack}><i className="fas fa-arrow-left"></i></div>
                <div className="step-indicator">
                    <div className={`item ${this.state.step == 0 ? "enable": ""}`}>약관동의</div>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 1 ? "enable": ""}`}>이메일 인증</div>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 2 ? "enable": ""}`}>개인정보 입력</div>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 3 ? "enable": ""}`}>회원정보 입력</div>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className={`item ${this.state.step == 4 || this.state.step == 5 ? "enable": ""}`}>마스터 키워드 발급</div>
                </div>
            </div>
            <div className="container">
                <h1>개인 회원가입</h1>
                {this.render_content()}
            </div>
		</div>);
	}
}
