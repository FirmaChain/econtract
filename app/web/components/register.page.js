import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import history from '../history';
import translate from "../../common/translate"
import queryString from "query-string"
import Dropdown from "react-dropdown"
import 'react-dropdown/style.css'
import {
    request_email_verification_code,
    check_email_verification_code,
    request_phone_verification_code,
    check_phone_verification_code,
    register_new_account,
    fetch_user_info,
    invite_information,
    update_user_info,
    new_corp,
    consume_invitation,
    update_user_public_info,
    create_group,
    update_group_public_key,
    get_corp_member_count_no_auth,
} from "../../common/actions"
import Web3 from "../../common/Web3"

import Footer from "./footer.comp"

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
    generateCorpKey,
    get256bitDerivedPublicKey,
    aes_encrypt,
    aes_decrypt,
    ecdsa_verify,
    new_account,
} from "../../common/crypto_test"

let mapStateToProps = (state)=>{
	return {
        user_info:state.user.info
	}
}

let mapDispatchToProps = {
    request_email_verification_code,
    check_email_verification_code,
    request_phone_verification_code,
    check_phone_verification_code,
    register_new_account,
    fetch_user_info,
    invite_information,
    update_user_info,
    new_corp,
    consume_invitation,
    update_user_public_info,
    create_group,
    update_group_public_key,
    get_corp_member_count_no_auth,
}

@connect(mapStateToProps, mapDispatchToProps )
export default class extends React.Component {
	constructor(){
		super();
        this.isGoingFinish = false
		this.state={
            step:2,
            step1:0,
            sort_test:[],
            email_verification: false,
            language: global.LANG,
        };

        {
            this.info1 = `서비스 이용약관
<제1장 총칙>
제1조 (목적)
본 약관은 주식회사 피르마솔루션즈(이하 "회사"라 함)가 제공하는 E-Contract 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 정함을 목적으로 합니다.
제2조 (용어의 정의)
① 본 약관에서 사용하는 용어의 정의는 다음과 같습니다. 
1. "서비스"란 회사가 제공하는 블록체인 기반 전자계약 플랫폼 E-contract 서비스를 말합니다.
2. "회원"이란 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
3, "유료회원"이란 유료서비스를 이용하는 회원을 말합니다.
② 본 약관에서 사용하는 용어의 정의는 제1항에서 정하는 것을 제외하고는 관계 법령에서 정하는 바에 의합니다. 관계 법령에서 정하지 않는 것은 일반적인 상관례에 의합니다.
제3조 (약관의 효력 및 적용과 변경)
① 회사는 본 약관의 내용을 이용자가 알 수 있도록 회사에서 운영하는 홈페이지(https://e-contract.io, 이하 "홈페이지"라 함)에 게시하거나 연결화면을 제공하는 방법으로 회원에게 공지합니다.
② 본 약관에 동의하고 회원 가입을 한 회원은 약관에 동의한 시점부터 동의한 약관의 적용을 받고 약관의 변경이 있을 경우에는 변경의 효력이 발생한 시점부터 변경된 약관의 적용을 받습니다. 본 약관에 동의하는 것은 정기적으로 홈페이지를 방문하여 약관의 변경 사항을 확인하는 것에 동의하는 것을 의미합니다.
③ 회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있습니다. 회사는 약관이 변경되는 경우에 변경된 약관의 내용과 시행일을 정하여, 그 시행일로부터 7일전 홈페이지에 온라인으로 공시합니다. 다만, 이용자에게 불리하게 약관 내용을 변경하는 경우에는 시행일로부터 30일전 홈페이지에 온라인으로 공시하거나 회원이 회원 가입 시 등록한 e-mail로 전송하는 방법으로 회원에게 고지합니다. 변경된 약관은 공시하거나 고지한 시행일로부터 효력이 발생합니다.
④ 회원은 변경된 약관에 대해 거부할 권리가 있습니다. 본 약관의 변경에 대해 이의가 있는 회원은 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다. 회원이 변경된 이용약관의 시행일 이후에도 서비스를 계속 이용하는 경우에는 변경된 약관에 동의한 것으로 봅니다.
제4조 (약관의 규정 외 사항에 관한 준칙)
회사는 서비스에 대한 운영정책을 둘 수 있으며, 본 약관에 규정 되지 않은 사항과 본 약관의 해석에 대해서는 회사가 정한 운영정책 및 약관의 규제에 관한 법률, 전기통신기본법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 전자문서 및 전자거래기본법, 전자서명법 등 관계법령이 적용됩니다.
<제2장 서비스 이용계약>
제5조 (서비스 이용계약의 성립)
① 회사가 제공하는 서비스를 이용하고자 하는 자(이하 "신청자"라 함)가 본 약관의 내용에 대하여 동의를 한 다음 회사가 제시하는 양식과 절차에 따라 이용 신청을 하고, 그 신청한 내용에 대해 회사가 승낙함으로써 회사와 신청자간 이용계약이 체결됩니다. 
② 회사는 신청자의 이용 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다. 다만, 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
1.  신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
2.  허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우
3.  만 14세 미만 아동이 정보통신망 이용촉진 및 정보보호 등에 관한 법률에서 정한 개인정보 입력 시 법정대리인의 동의를 얻지 아니한 경우
4.  신청자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며 신청하는 경우
③ 회사는 서비스관련설비의 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우에는 승낙을 유보할 수 있습니다.
④ 본 약관은 회원이 본 약관에 동의한 날로부터 회원 탈퇴 시까지 적용하는 것을 원칙으로 합니다. 단, 본 약관의 일부 조항은 회원이 탈퇴 후에도 유효하게 적용될 수 있습니다.
제6조 (이용자 정보의 제공)
① 회원으로 가입하여 서비스를 이용하고자 하는 이용자는 이메일, 이름, 휴대폰 번호, 주소 등 정보를 제공하고, 이메일 인증을 하여야 합니다.
② 이용자가 제1항에서 정한 인증을 거치지 않은 경우 서비스 이용이 제한될 수 있으며, 실명으로 등록하지 않은 이용자는 일체의 권리를 주장할 수 없습니다.
③ 타인의 명의를 도용하여 이용신청을 한 회원의 모든 ID는 삭제되며, 관계법령에 따라 처벌을 받을 수 있습니다.
제7조 (개인정보의 보호 및 관리)
① 회사는 관계 법령이 정하는 바에 따라 계정정보를 포함한 회원의 개인정보를 보호하기 위하여 노력합니다. 회원의 개인정보 보호 및 사용에 대해서는 회사가 별도로 고지하는 개인정보 처리방침에 따릅니다. 다만, 회사가 제공하는 공식 서비스 사이트 이외의 링크된 사이트에서는 회사의 개인정보처리방침이 적용되지 않습니다.
② 회사는 회원의 귀책사유로 인하여 노출된 회원의 계정정보를 포함한 모든 정보에 대해서는 일체의 책임을 지지 않습니다.
제8조 (회원의 계정 및 비밀번호)
① 회원은 서비스의 원활한 이용 및 회원의 정보보호, 서비스 이용안내 등의 편의를 위하여 이용자가 선정한 ID를 계정으로 사용합니다. 다만, 회사는 회원의 계정이 반사회적이거나 미풍양속을 해치거나 또는 운영자로 오인할 우려가 있는 경우 등에는 해당 계정의 사용을 거부하거나 제한할 수 있습니다
② 회사는 계정정보를 통하여 당해 회원의 서비스 이용가능여부 등 제반 이용자 관리 업무를 수행합니다.
③ 회원은 자신의 계정정보를 선량한 관리자로서의 주의의무를 다하여 관리하여야 합니다. 회원이 본인의 계정정보를 소홀히 관리하거나 제3자에게 이용을 승낙함으로써 발생하는 손해에 대하여는 회원에게 책임이 있습니다.
④ 회원은 회사가 정한 기준을 충족하는 범위 내에서 자유롭게 비밀번호를 정할 수 있으며, 정해진 비밀번호는 회원이 원하는 경우 언제든지 변경이 가능합니다.
⑤ 회원은 서비스의 이용을 위하여 사용하는 비밀번호에 대한 보호 및 관리 책임을 부담합니다. 다만, 회사는 보안 등을 이유로 회원에게 정기적 또는 비정기적으로 비밀번호의 변경을 권고할 수 있습니다.
제9조 (회원에 대한 통지)
① 회사가 회원에 대한 통지를 하는 경우 본 약관에 별도 규정이 없는 한 회원이 계정으로 사용하는 이메일 주소로 할 수 있습니다.
② 회사는 회원 전체에 대한 통지의 경우 7일 이상 회사의 홈페이지 또는 공지사항 게시판에 게시함으로써 제1항의 통지에 갈음할 수 있습니다.
<제3장 서비스의 이용>
제10조 (서비스의 이용개시)
① 회사는 회원의 서비스 이용을 승낙한 때부터 서비스를 개시합니다. 단, 일부 서비스의 경우, 회사의 필요에 따라 지정된 일자부터 서비스를 제공할 수 있습니다.
② 제2항 단서의 경우 회사는 그 내용 및 시간을 홈페이지에 공지합니다. 다만, 회사가 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.
③ 회사는 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검시간은 서비스 제공화면에 공시한 바에 따릅니다.
제11조 (유료서비스 이용)
① 회사가 유료회원의 이용신청을 승낙한 때로부터 유료서비스는 개시되며, 회사의 기술적 사유 등 기타 사정에 의하여 유료서비스를 개시할 수 없는 경우에는 제9조의 방법에 따라 회원에게 사전 공지합니다.
② 회사는 다음과 같은 유료서비스를 제공하며, 회사의 사정, 기타 제반 여건에 따라 서비스 내용, 이용요금을 변경할 수 있습니다.
◆ 자동결제 여부에 따른 분류
- 정기결제형 요금제 : 이용요금이 자동으로 결제되고 이용기간이 자동 갱신되는 유료서비스를 말합니다.
- 일반결제형 요금제 : 이용요금이 자동으로 결제되지 않고 이용기간이 자동 갱신되지 않는 유료서비스를 말합니다.
◆ 이용 기간에 따른 분류
- 연 요금제 : 요금제 사용 기간이 연 단위인 유료서비스를 말합니다.
- 월 요금제 : 요금제 사용 기간이 월 단위인 유료서비스를 말합니다.
- 건별 이용권 : 건별로 이용요금이 부과되는 유료서비스를 말합니다.
③ 유료회원이 유/무선네트워크를 통하여 서비스에 접속하거나 유/무선네트워크가 연결된 상태의 기기 내에 탑재된 어플리케이션을 통하여 제반 서비스를 이용하는 경우, 유료회원과 유료회원이 가입한 해당 통신사간에 체결된 통신 요금제에 의한 별도의 데이터 통화료가 발생합니다. 이 경우 발생하는 데이터 통화료는 유료회원과 해당 통신사간에 체결된 통신요금제에 따라 과금/청구/수납되므로, 데이터 통화료에 대해서는 회사는 어떠한 책임도 지지 않습니다.
제12조 (청약 철회 등)
① 회사와 유료서비스 이용계약을 체결한 회원은 이용계약일과 서비스 이용 가능일 중 늦은 날부터 7일 이내에 별도의 수수료‧위약금 등의 부담 없이 청약철회를 할 수 있습니다.
② 회원은 제1항에도 불구하고 구매한 유료서비스의 내용이 표시․광고의 내용과 다르거나 이용계약의 내용과 다르게 이행된 경우에 해당 서비스가 이용 가능하게 된 날부터 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약철회를 할 수 있습니다.
③ 제1항부터 제2항까지의 규정에 따라 청약철회가 이루어질 경우 회사는 지체 없이 회원의 유료 서비스를 회수하고 3영업일 이내에 대금을 환급함을 원칙으로 합니다. 단, 회사가 사전에 유료회원에게 전자메일, 서비스 홈페이지로 공지한 경우 및 개별 결제 수단에 따라 환불 방법, 환불 가능 기간 등이 차이가 있을 수 있습니다.
제13조 (과오납금의 환급)
① 회사는 과오납금이 발생하는 경우 과오납금을 회원에게 환급합니다. 다만, 과오납금이 회사의 고의 또는 과실 없이 회원의 과실로 인하여 발생한 경우에는 그 환급에 소요되는 실제 비용은 합리적인 범위 내에서 회원이 부담합니다.
② 회사는 과오납금의 환급을 처리하기 위해 회원에게서 제공받은 정보를 통해 회원에게 연락할 수 있으며, 필요한 정보의 제공을 요청할 수 있습니다. 회사는 회원으로부터 환급에 필요한 정보를 받은 날부터 3영업일 이내에 환급합니다.
제14조 (서비스의 제공, 변경 및 중단 등)
① 회원은 회사가 제공하는 서비스를 본 약관, 운영정책 등 회사가 정한 규칙에 따라 이용할 수 있습니다.
② 회사가 회원에게 제공하는 서비스에 대하여 회사는 제작, 변경, 유지, 보수에 관한 포괄적인 권한을 가집니다.
③ 회사는 새로운 서비스 내용, 각종 버그 패치 등 서비스의 운영상 또는 기술상의 필요한 경우, 제공하고 있는 서비스의 전부 또는 일부를 상시적으로 수정, 추가, 폐지 등 변경할 수 있습니다.
④ 회사는 무료로 제공되는 서비스의 일부 또는 전부를 회사의 정책 기획이나 운영상 또는 회사의 긴박한 상황 등 필요에 의해 수정, 중단, 변경할 수 있으며, 이에 대하여 관련 법령상 특별한 규정이 없는 한 회원에게 별도의 보상을 하지 않습니다.
⑤ 회사는 다음 각호에 해당하는 경우 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.
1.  전시, 사변, 천재지변 또는 국가비상사태 등 불가항력적인 사유가 있는 경우
2.  정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우
3.  서비스용 설비의 보수 등 공사로 인한 부득이한 경우
4.  기타 회사의 제반 사정으로 서비스를 할 수 없는 경우
⑥ 회사는 서비스가 변경되거나 중지된 원인이 회사의 고의 또는 중대한 과실로 인한 경우를 제외하고는 서비스의 변경 및 중지로 발생하는 문제에 대해서 책임을 부담하지 않습니다.
제15조 (광고의 게재)
① 회사는 서비스 등을 유지하기 위하여 광고를 게재할 수 있으며, 회원은 서비스 이용 시 노출되는 광고 게재에 대하여 동의합니다.
② 회사가 제공하는, 제3자가 주체인, 제1항의 광고에 회원이 참여하거나 교신 또는 거래를 함으로써 발생하는 손실과 손해에 대해서는 회원의 책임으로 합니다.
제16조 (저작권 등의 귀속)
회사가 제공하는 모든 서비스의 지적 재산권을 포함한 모든 소유권은 회사에게 있으며, 서비스를 이용하는 회원은 회사가 제공하는 서비스 범위 내에서 이용권을 가집니다. 즉, 회원은 회사가 제공하는 서비스를 일정기간 동안 회사가 제공하는 각 서비스 범위 내에서 이용할 권한을 갖는 것이며, 이를 회사가 정한 방법 이외의 방법으로 이용 또는 사용할 수 없습니다.
제17조 (최소 사용환경)
① 이용자는 아래 각 호에 해당하는 최소 사용 환경에서 서비스를 이용해야 합니다.
-   운영체제 : Mac(Mavericks 이상), Windows7 이상
-   브라우저 : Chrome(49 이상)
-   쿠키 : 모든 쿠키 허용
② 최소 사용 환경을 충족하지 못하는 환경에서 서비스를 이용할 경우, 이와 발생하는 문제에 대해 회사는 책임지지 않습니다.
<제4장 계약당사자의 의무>
제18조 (회사의 의무)
① 회사는 본 약관 및 관련법령에서 금지하는 행위 및 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적인 서비스의 제공을 위하여 최선을 다하여 노력합니다.
② 회사는 회원이 안전하게 서비스를 이용할 수 있도록 일체의 개인정보 보호를 위한 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.
③ 회사는 회원으로부터 제기되는 의견이나 불만이 정당하다고 객관적으로 인정될 경우에는 합리적인 기간 내에 신속하게 처리하여야 합니다. 다만, 처리에 장기간이 소요되는 경우 회원에게 게시판 또는 이메일 등을 통하여 지체 사유를 안내하고 처리과정 및 처리결과를 전달합니다.
④ 회사는 이용계약의 체결, 계약사항의 변경 및 해지 등 이용자와의 계약관련 절차 및 내용 등에 있어 이용자에게 편의를 제공하도록 노력합니다.
제19조 (회원의 의무)
① 회원은 회사에서 제공하는 서비스를 본래의 이용 목적 이외의 용도로 사용하거나 다음 각 호에 해당하는 행위를 해서는 안됩니다.
1.  가입신청 또는 정보 변경을 목적으로 회사에 개인정보 등록시 실명이 아닌 정보 또는 다른 사람의 정보를 사용하거나 허위 사실을 기재하는 행위
2.  타인으로 가장하거나 타인과의 관계를 허위로 명시하는 행위, 다른 회원의 계정 및 비밀번호를 도용, 부정하게 사용하는 행위
3.  알려지거나 알려지지 않은 버그를 악용하여 서비스를 이용하는 행위
4.  회사 및 제3자의 명예를 훼손하거나 업무를 방해하거나 회사 및 제3자에게 손해를 가하는 행위
5.  회사의 지적재산권, 제3자의 지적재산권, 초상권 등 기타 권리를 침해하거나 회사의 승인을 받지 않고 다른 회원의 개인정보를 수집, 저장, 유포, 게시하는 행위
6.  제3자를 기망하여 이득을 취하거나 회사가 제공하는 서비스를 불건전하게 이용하거나 하여 제3자에게 피해를 주는 행위
7.  회사로부터 특별한 권리를 부여받지 않고 사이트를 변경하거나 사이트에 다른 프로그램을 추가 또는 삽입하거나 서버를 해킹, 역설계, 소스코드의 유출 및 변경, 별도의 서버를 구축하거나 웹사이트의 일부분을 임의로 변경 또는 도용하여 회사를 사칭하는 행위
8.  회사의 직원이나 운영자를 가장, 사칭하거나 또는 타인의 명의를 도용하여 문서를 등록하거나 메일을 발송하는 행위
9.  회사의 동의 없이 영리, 영업, 광고, 정치활동, 불법선거운동 등을 목적으로 서비스를 이용하는 행위
10. 기타 공공질서 및 미풍양속을 위반하거나 불법적, 부당한 행위 및 법령에 위배되는 행위
② 회원은 회사 홈페이지 상의 공지사항 및 이용약관의 수정사항 등을 확인하고 이를 준수할 의무가 있으며 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
③ 회원의 계정에 관한 관리 책임은 회원에게 있으며, 이를 제3자가 이용하도록 하여서는 안 됩니다.
④ 회사는 제1항, 제2항 및 다음 각 호의 어느 하나에 해당하는 행위의 구체적인 유형을 운영 정책에서 정할 수 있으며, 회원은 이를 준수할 의무가 있습니다.
1.  회원의 계정명, 비밀번호의 정함에 대한 제한
2.  기타 회원의 서비스 이용에 대한 본질적인 권리를 침해하지 않는 범위 내에서 회사가 운영상 필요하다고 인정되는 사항
<제5장 서비스이용제한 및 계약해지 등>
제20조 (이용제한 등)
① 회사는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 서비스 이용을 경고, 일시정지, 계약해지로 단계적으로 제한할 수 있습니다.
② 회사는 제1항의 규정에도 불구하고, 주민등록법을 위반한 명의도용 및 결제도용, 저작권법 및 컴퓨터프로그램보호법을 위반한 불법프로그램의 제공 및 운영방해, 정보통신망 이용촉진 및 정보보호 등에 관한 법률을 위반한 불법통신 및 해킹, 악성프로그램의 배포, 접속권한 초과행위 등과 같이 관련법령을 위반한 경우에는 즉시 계약을 해지 할 수 있습니다. 이에 따른 계약해지시 서비스 이용을 통해 획득한 혜택 등은 모두 소멸되며, 회사는 이에 대해 별도로 보상하지 않습니다.
③ 회사가 위 제1항에 따라 회원의 서비스 이용을 제한하거나 계약을 해지하는 경우, 제한의 조건 및 세부내용은 이용제한정책 등에서 정한 바에 따르며, 회사는 제9조에서 정한 방법으로 통지합니다.
④ 회원은 회사의 이용제한 조치 등에 대하여 회사가 정한 절차에 따라 이의신청을 할 수 있습니다. 회원의 이의 사유가 정당하다고 인정되는 경우 회사는 즉시 회원의 서비스 이용을 재개하여야 합니다.
제21조 (회원의 계약해지)
① 회원은 홈페이지에 개제된 회사 연락처를 통하여 서비스의 이용 중지나 회원 탈퇴 신청을 할 수 있으며, 회사는 관련법령 등에서 정하는 바에 따라 이를 즉시 처리하여야 합니다.
② 관련 법령 및 회사의 개인정보 처리방침에서 정한 바에 따라 특별히 회원과 관계된 정보를 저장해야하는 경우를 제외하고, 회원의 모든 정보는 탈퇴 시점 이후 바로 삭제되며 복구할 수 없습니다.
③ 회원은 탈퇴 시점 이후 동일한 이메일 주소로 다시 가입할 수 없습니다.
<제6장 손해배상 등>
제22조 (손해배상)
① 회원이 본 약관의 규정을 위반함으로 인하여 회사에 손해가 발생하게 되는 경우, 이 약관을 위반한 회원은 회사에 발생하는 모든 손해를 배상하여야 합니다.
② 회원이 서비스를 이용함에 있어 행한 불법 행위나 본 약관 위반 행위로 인하여 회사가 당해 회원 이외의 제3자로부터 손해배상 청구 또는 소송을 비롯한 각종 이의 제기를 받는 경우 당해 회원은 자신의 책임과 비용으로 회사를 면책시켜야 하며, 회사가 면책되지 못한 경우 당해 회원은 그로 인하여 회사에 발생한 모든 손해를 배상하여야 합니다.
제23조 (면책사항)
① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
② 회사는 회원의 귀책사유로 인한 서비스의 중지 또는 이용장애, 계약해지에 대하여 책임을 지지 않습니다.
③ 회사는 기간통신 사업자가 전기통신서비스를 중지하거나 정상적으로 제공하지 아니하여 손해가 발생한 경우에는 책임이 면제됩니다.
④ 회사는 사전에 공지된 서비스용 설비의 보수, 교체, 정기점검, 공사 등 부득이한 사유로 서비스가 중지되거나 장애가 발생한 경우에 대해서는 책임이 면제됩니다.
⑤ 회사는 회원이 서비스를 이용하여 기대하는 수익을 얻지 못한 것에 대하여 책임을 지지 않으며 서비스에 대한 취사 선택 또는 이용으로 발생하는 손해 등에 대해서는 책임이 면제됩니다.
⑥ 회사는 회원의 컴퓨터 환경으로 인하여 발생하는 제반 문제 또는 회사의 귀책사유가 없는 네트워크 환경으로 인하여 발생하는 문제에 대해서는 일체 책임을 지지 않습니다.
⑦ 회사는 회원이 서비스 내 또는 웹사이트 상에 게시 또는 전송한 정보, 자료, 사실의 신뢰도, 정확성 등 내용에 대해서는 책임을 지지 않습니다.
⑧ 회사는 회원 상호간 또는 회원과 제3자간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며 이로 인한 손해를 배상할 책임을 지지 않습니다.
⑨ 회사는 회원의 컴퓨터 오류에 의한 손해가 발생한 경우 또는 신상정보 및 전자우편주소를 부정확하게 기재하거나 미기재하여 손해가 발생한 경우에 대하여 책임을 부담하지 않습니다.
⑩ 회사는 무료로 제공되는 서비스 이용과 관련하여 관련법령에 특별한 규정이 없는 한 책임을 지지 않습니다.
제24조 (준거법 및 재판관할)
① 회사와 회원간 발생한 분쟁은 대한민국법을 준거법으로 합니다.
② 회사와 회원간 발생한 분쟁에 관한 소송은 제소 당시의 회원의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 회원의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.`
            this.info2 = `개인정보 처리방침
주식회사 피르마솔루션즈(이하 "회사")는 개인정보 보호법 등에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립‧공개합니다.
제1조 (개인정보의 처리목적)
회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
1.  홈페이지 회원 가입 및 관리 
회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별․인증, 회원자격 유지․관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리시 법정대리인의 동의여부 확인, 각종 고지․통지, 고충처리 등
2.  신규 서비스 개발 및 마케팅 광고에의 활용 
신규 서비스 개발 및 맞춤 서비스 제공, 접속빈도 파악, 회원의 서비스이용에 대한 통계 작성, 통계학적 특성에 따른 서비스 제공 및 광고 게재, 이벤트 정보 및 참여기회 제공, 광고성 정보 제공 등 
3.  고충처리
민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락․통지, 처리결과 통보 등
제2조 (처리하는 개인정보의 항목)
① 회사는 다음의 개인정보 항목을 처리하고 있습니다.
1.  홈페이지 회원 가입 및 관리
-   필수항목 : 성명, 아이디, 비밀번호, 휴대폰번호, 주소, 이메일 주소
-   선택항목 : 롭스텐 이더리움 주소
2.  서비스 제공
-   필수항목 : 이메일 주소, 비밀번호
-   선택항목 : 신용카드, 생년월일, 휴대폰번호, 주소(결제 시)
3.  인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수 있습니다.
-   IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록, 브라우저 정보, 운영체제 정보(OS), 사용 기기 정보, MAC 주소, 방문 일시 등
제3조 (개인정보 수집 방법)
① 회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하는 경우, 해당 개인정보를 수집합니다.
② 회사와 제휴한 외부 기업이나 단체로부터 개인정보를 제공받을 수 있으며, 이러한 경우에는 제휴사에서 이용자에게 개인정보 제공 동의를 받아야 합니다.
③ 만14세 미만의 회원에 대해서는 법정대리인으로부터 동의를 받아야 이용이 가능합니다.
제4조 (개인정보의 처리 및 보유기간)
회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유하고, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 이 경우 회사는 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다. 
- 계약 또는 청약철회 등에 관련 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률) 
- 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)
- 신용정보의 수집/처리 및 이용 등에 관한 기록: 3년 (신용정보의 이용 및 보호에 관한 법률)
- 표시/광고에 관한 기록: 6개월 (전자상거래 등에서의 소비자보호에 관한 법률)
- 이용자의 인터넷 등 로그기록/이용자의 접속지 추적자료: 3개월 (통신비밀보호법)
- 그 외의 통신사실 확인자료: 12개월 (통신비밀보호법)
제5조 (개인정보처리의 위탁)
① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
- 위탁받는 자 (수탁자) : Amazon Web Services Inc. 
    - 위탁하는 업무의 내용 :개인정보가 보관된 클라우드 서버를 운영 및 관리
② 회사는 위탁계약 체결시 위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리․감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다. 
③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.
제6조(이용자 및 법정대리인의 권리·의무 및 행사방법) 
① 이용자는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다. 
1.  개인정보 열람요구
2.  오류 등이 있을 경우 정정 요구
3.  삭제요구
4.  처리정지 요구
② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
③ 이용자가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다. 
④ 만 14세 미만 아동의 경우, 제1항에 따른 권리 행사는 이용자의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우, 법정대리인은 이용자의 모든 권리를 가집니다. 
⑤ 이용자는 정보통신망법, 개인정보보호법 등 관계법령을 위반하여 회사가 처리하고 있는 이용자 본인이나 타인의 개인정보 및 사생활을 침해하여서는 안됩니다.
제7조 (개인정보 자동 수집 장치의 설치·운영 및 거부) 
회사는 이용자 개개인에게 개인화되고 맞춤화된 서비스를 제공하기 위해 이용자의 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
1.  쿠키의 사용 목적
회원과 비회원의 접속 빈도나 방문 시간 등의 분석, 이용자의 취향과 관심분야의 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공
2.  쿠키 설정 거부 방법
이용자는 쿠키 설치에 대해 거부할 수 있습니다. 단, 쿠키 설치를 거부하였을 경우 로그인이 필요한 일부 서비스의 이용이 어려울 수 있습니다.
(설정방법, IE 기준) 웹 브라우저 상단의 도구 > 인터넷 옵션 > 개인정보 > 사이트 차단
 
제8조 (개인정보의 파기) 
① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 5일 이내 해당 개인정보를 파기합니다.
② 이용자로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
1.  파기절차
회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다. 
2.  파기방법
회사는 전자적 파일 형태로 기록, 저장된 개인정보는 기록을 재생할 수 없도록 로우레밸포멧(Low Level Format) 등의 방법을 이용하여 파기하며, 종이 문서에 기록, 저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
제9조 (개인정보의 안전성 확보조치) 
회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다. 
1.  관리적 조치 : 내부관리계획 수립․시행, 정기적 직원 교육 등 
2.  기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치 
3.  물리적 조치 : 전산실, 자료보관실 등의 접근통제
제10조 (개인정보 보호책임자) 
① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정·운영하고 있습니다. 
-   성명 : 이광규
-   직책 : 기술이사
-   연락처 : [070-4276-9499]
-   이메일: reve@firma-solutions.com
② 이용자는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자로 문의하실 수 있습니다. 회사는 이용자의 문의에 대해 답변 및 처리해드릴 것입니다.
③ 기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
-   개인정보침해신고센터 (http://privacy.kisa.or.kr)
-   대검찰청 과학수사부 사이버범죄수사과 (www.spo.go.kr / 국번없이 1301)
-   경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)
제11조 (개인정보 처리방침 변경) 
이 개인정보 처리방침은 2018. 11. [1].부터 적용됩니다.`
        }
	}

	componentDidMount(){
        /*let account = new_account("pbes0707@gmail.com", "asdasdasd");
        console.log(account)
        this.setState({
            step:3,
            account:account,
            //mnemonic:account.rawMnemonic,
            recover_password:account.recoverPassword
        })*/


        if(!this.props.user_info){
            (async()=>{
                await window.showIndicator()
                await this.props.fetch_user_info()
                await window.hideIndicator()
            })()
        } else {
            return history.replace("/home")
        }

        (async()=>{
            if(localStorage.getItem("browser_key") /*|| localStorage.getItem("browser_key_virgin") == 0*/) {
                /*let res = await window.confirm(translate("yes_this_device_verify_account_are_you_unverify_go_register_?"))
                if( !res ) {
                    return history.push("/login")
                }*/
            }
            localStorage.removeItem("browser_key")
            //localStorage.removeItem("browser_key_virgin")
        })()

        if(this.getAccountType() == window.CONST.ACCOUNT_TYPE.CORP_SUB) {
            let params = queryString.parse(this.props.location.search)

            let registration_code = params.registration_code || "";
            let email_address = params.email_address || "";
            (async() => {
                let registration_info = await this.props.invite_information(email_address, registration_code);
                if(registration_info == null) {
                    alert(translate("not_validate_invite_code"))
                    return history.goBack()
                }

                let corp_count_resp = await this.props.get_corp_member_count_no_auth(registration_info.corp_id, registration_info.owner_id)
                let corp_member_count = corp_count_resp.corp_member_count
                let corp_member_count_max = corp_count_resp.corp_member_count_max

                if(corp_member_count_max <= corp_member_count) {
                    alert(translate("max_corp_member_count"))
                    return history.replace("/login")
                }

                this.setState({
                    registration_code: registration_code,
                    email: email_address,
                    company_name: registration_info.company_name,
                    duns_number: registration_info.duns_number,
                    company_ceo: registration_info.company_ceo,
                    company_tel: registration_info.company_tel,
                    company_address: registration_info.company_address,
                    corp_key: registration_info.corp_key,
                    corp_id: registration_info.corp_id,
                    owner_id: registration_info.owner_id,
                    group_key: registration_info.group_key,
                    group_id: registration_info.group_id,
                    email_verification: false,
                });
            })();
        }
    }

    componentWillReceiveProps(props) {
        if(props.user_info) {
            history.replace("/")
        }
    }

    getAccountType() {
        let q = queryString.parse(this.props.location.search)
        if(!!q.registration_code && !!q.email_address) {
            return 2
        }

        if(!!this.props.location.state && !!this.props.location.state.type)
            return this.props.location.state.type

        return 0
    }

    goBack = ()=>{
        if(this.state.step == 0){
            history.goBack()
        }else{
            this.setState({
                step: this.state.step - 1
            })
        }
    }

    next_term = ()=>{
        let _ = {
            step: this.state.step + 1
        }
        if(this.state.step == 3) {
            _.shuffled_mnemonic = this.state.mnemonic.split(" ").map( (e, k) => { return {idx:k, word:e} } ).shuffle()
        }
        this.setState(_)
    }

    prev_term = () => {
        this.setState({
            step: this.state.step - 1
        })
    }

    onClickRequestEmail =  async ()=>{
        if(!this.state.email)
            return alert(translate("please_input_email"))

        await window.showIndicator();
        let resp = await this.props.request_email_verification_code(this.state.email)
        if(resp.code == 1){
            alert(translate("email_was_sent"))
            this.setState({
                step1:1,
                email_verification:false
            })
        }else if(resp.code == -1){
            alert(translate("already_register_email"))
        }else if(resp.code == -3){
            alert(translate("not_validate_email"))
        }else{
            alert(translate("send_verification_code_error_occured"))
        }
        await window.hideIndicator();
    }

    onClickVerificateEmail = async ()=>{
        if(this.state.step1 != 1) {
            return alert(translate("first_you_need_send_email"))
        }

        if(this.state.verification_code == null || this.state.verification_code.length !=4){
            return alert(translate("code_is_4"))
        }

        await window.showIndicator();
        let resp = await this.props.check_email_verification_code(this.state.email, this.state.verification_code)
        if(resp.code == 1 && resp.payload == true){
            this.setState({
                email_verification:true
            })
            alert(translate("complete_verification"))
        }else{
            alert(translate("wrong_code"))
        }
        await window.hideIndicator();
    }

    onClickRequestPhone = async ()=>{
        if(this.state.userphone == null || this.state.userphone.length != 13 || !/^0\d{2}-\d{4}-\d{4}$/.test(this.state.userphone))
            return alert(translate("please_input_correct_phone"))
            
        await window.showIndicator();
        let resp = await this.props.request_phone_verification_code(this.state.userphone)
        if(resp.code == 1 && resp.payload == true){
            alert(translate("code_was_sent"))
            this.setState({
                phone_verification_code_sent:true,
                verificated_phone:false
            })
        }else{
            alert(translate("send_code_error_occured"))
        }
        await window.hideIndicator();
    }

    onClickVerificatePhone = async ()=>{
        if(this.state.phone_verification_code == null || this.state.phone_verification_code.length !=4){
            return alert(translate("code_is_4"))
        }
        await window.showIndicator();
        let resp = await this.props.check_phone_verification_code(this.state.userphone, this.state.phone_verification_code)
        if(resp.code == 1 && resp.payload == true){
            alert(translate("success_verification"))
            this.setState({
                verificated_phone:true
            })
        } else {
            alert(translate("wrong_code"))
        }
        await window.hideIndicator();
    }

    onChangePhoneForm = async (name, e) => {
        let text = e.target.value;
        text = text.replace(/[^0-9]/g,"")
        text = window.phoneFomatter(text)
        
        this.setState({
            [name]:text
        })
    }

    clickCopy = async (text) => {
        let t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = text;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        alert(translate("success_copy"));
    }

    onClickNextBtnAccountInfo = async ()=>{
        if(!this.state.email){
            return alert(translate("please_input_email"))
        }
        else if(!this.state.password || this.state.password.length < 8){
            return alert(translate("password_will_be_more_than_8"))
        }
        else if(this.state.password !== this.state.password2){
            return alert(translate("password_not_symmetry"))
        }
        else if(!this.state.email_verification) {
            return alert(translate("go_email_verification"))
        }

        this.setState({
            step: this.state.step+1
        })
    }

    onClickFindAddress = async (type)=>{
        await window.showIndicator()
        let address = await new Promise(r=>daum.postcode.load(function(){
            new daum.Postcode({
                oncomplete: r,
                onclose:r
            }).open();
        }));
        if(!!address && !!address.roadAddress) {
            if(type == 0) {
                this.setState({
                    useraddress: address.roadAddress + " "
                })
            } else if(type == 1) {
                this.setState({
                    company_address: address.roadAddress + " "
                })
            }
        }
        await window.hideIndicator()
    }

    onClickNextBtnUserInfo = async ()=>{
        if(!this.state.username)
            return alert(translate("please_input_name"))
        if(!this.state.verificated_phone)
            return alert(translate("please_verify_phone"))
        if(!this.state.useraddress)
            return alert(translate("please_input_address"))

        let account = new_account(this.state.email, this.state.password);
        this.setState({
            step:this.state.step + 1,
            account:account,
            //mnemonic:account.rawMnemonic,
            recover_password:account.recoverPassword
        })
    }

    onClickNextBtnCompanyInfo = async ()=>{
        if(!this.state.company_name)
            return alert(translate("please_input_corp_name"))
        if(!this.state.duns_number)
            return alert(translate("please_input_duns"))
        if(!this.state.company_ceo)
            return alert(translate("please_input_ceo_name"))
        if(!this.state.company_tel)
            return alert(translate("please_input_corp_tel"))
        if(!this.state.company_address)
            return alert(translate("please_input_corp_address"))

        if(!this.state.username)
            return alert(translate("please_input_name"))
        if(!this.state.job)
            return alert(translate("please_input_job"))
        if(!this.state.verificated_phone)
            return alert(translate("please_verify_phone"))

        let account = new_account(this.state.email, this.state.password);
        this.setState({
            step:this.state.step + 1,
            account:account,
            //mnemonic:account.rawMnemonic,
            recover_password:account.recoverPassword
        })
    }

    /*onClickSaveMnemonic = ()=>{
        let anchor = document.createElement('a');
        anchor.target = "_blank";
        anchor.href = "/static/recovery_phrase_document.pdf";
        anchor.click();
    }*/

    onClickSortTest = (item)=>{
        let sort_test = [...this.state.sort_test]
        let sort_item = sort_test.find( e => item.word == e.word && item.idx == e.idx )
        if( sort_item ){
            for(let i in sort_test) {
                if(sort_item.idx == sort_test[i].idx) {
                    sort_test.splice(i, 1)
                    break;
                }
            }
        } else {
            sort_test.push(item)
        }

        this.setState({
            sort_test:sort_test
        })
    }

    onClickFinishRegister = async ()=>{
        if(this.isGoingFinish)
            return

        this.isGoingFinish = true

        // master keyword progress
        /*if(this.state.sort_test.map(e=>e.word).join(" ") != this.state.mnemonic){
            this.setState({
                shuffled_mnemonic:this.state.mnemonic.split(" ").map( (e, k) => { return {idx:k, word:e} } ).shuffle(),
                sort_test:[],
            })
            this.isGoingFinish = false
            return alert(translate("please_check_master_keyword_order"))
        }*/
        let account_type = this.getAccountType()
        let info, corp_info, public_info, open_info

        let department = this.state.department || ""

        if(account_type == window.CONST.ACCOUNT_TYPE.PERSONAL) { // 개인 계정
            info = {
                email: this.state.email.trim(),
                username: this.state.username.trim(),
                userphone: this.state.userphone,
                useraddress: this.state.useraddress.trim(),
                recover_password: this.state.account.recoverPassword,
            }
        } else if(account_type == window.CONST.ACCOUNT_TYPE.CORP_MASTER) { // 기업 관리자 계정
            info = {
                recover_password: this.state.account.recoverPassword,
            }
            public_info = {
                email: this.state.email.trim(),
                username: this.state.username.trim(),
                department: department.trim(),
                job: this.state.job.trim(),
                userphone: this.state.userphone,
            }
            corp_info = {
                company_name: this.state.company_name.trim(),
                duns_number: this.state.duns_number.trim(),
                company_ceo: this.state.company_ceo.trim(),
                company_tel: this.state.company_tel.trim(),
                company_address: this.state.company_address.trim(),
            }
        } else if(account_type == window.CONST.ACCOUNT_TYPE.CORP_SUB) { // 기업 직원 계정
            info = {
                corp_id: this.state.corp_id,
                corp_key: this.state.corp_key,
                group_keys: { [this.state.group_id] : this.state.group_key },
                recover_password: this.state.account.recoverPassword,
            }
            public_info = {
                email: this.state.email.trim(),
                username: this.state.username.trim(),
                job: this.state.job.trim(),
                department: department.trim(),
                userphone: this.state.userphone.trim(),
            }
        } else if(account_type == window.CONST.ACCOUNT_TYPE.EXPERT) { // 전문가 계정
            info = {
                recover_password: this.state.account.recoverPassword,
            }
            open_info = {
                email: this.state.email.trim(),
                username: this.state.username.trim(),
                userphone: this.state.userphone,
                useraddress: this.state.useraddress.trim(),
                recover_password: this.state.account.recoverPassword,
            }
        }

        let keyPair = SeedToEthKey(this.state.account.seed, "0'/0/0");
        let privateKey = "0x"+keyPair.privateKey.toString('hex');

        let wallet = Web3.walletWithPK(privateKey)
        let encryptedInfo = aes_encrypt(JSON.stringify(info), this.state.account.masterKeyPublic);


        let emk = aes_encrypt(this.state.account.rawMnemonic, Buffer.from(this.state.account.recoverPassword, 'hex'))
        let mk;
        try {
            mk = aes_decrypt(Buffer.from(emk, 'hex'), Buffer.from(this.state.account.recoverPassword, 'hex'))
        } catch(err) {
            console.log(err)
        }

        if(mk != this.state.account.rawMnemonic) {
            return alert("something is very wrong. check rawMnemonic");
        }
        
        await window.showIndicator()
        let resp
        if(account_type == window.CONST.ACCOUNT_TYPE.PERSONAL) {
            try{
                resp = await this.props.register_new_account(this.state.account, 
                    encryptedInfo, this.state.email, 
                    this.state.username, wallet.address, 
                    account_type, emk)
            } catch(err) {
                this.isGoingFinish = false
                console.log("network error")
                await window.hideIndicator()
                return;
            }
        } else if (account_type == window.CONST.ACCOUNT_TYPE.CORP_MASTER) {
            let corpMasterKey = generateCorpKey();
            // inject into master's info
            let corpKey = get256bitDerivedPublicKey(corpMasterKey, "m/0'/0'");
            let encryptedCorpInfo = aes_encrypt(JSON.stringify(corp_info), corpKey);
            /*let corpResp = await this.props.new_corp(encryptedCorpInfo);
            if (!corpResp) {
                return alert(translate("fail_create_corp_info"));
            }*/
            //info['corp_id'] = corpResp.corp_id;
            info['corp_master_key'] = corpMasterKey.toString("hex");
            info['corp_key'] = corpKey.toString('hex');
            let encryptedInfo = aes_encrypt(JSON.stringify(info), this.state.account.masterKeyPublic);
            /*let updateResp = await this.props.update_user_info(encryptedInfo);
            if (!updateResp) {
                return alert(translate("fail_save_corp_key"));
            }*/

            let encryptedPublicInfo = aes_encrypt(JSON.stringify(public_info), Buffer.from(info['corp_key'], 'hex'));
            /*updateResp = await this.props.update_user_public_info(encryptedPublicInfo);
            if (!updateResp) {
                return alert(translate("fail_save_public_info"));
            }*/

            try {
                resp = await this.props.register_new_account(this.state.account, 
                    encryptedInfo, this.state.email, 
                    this.state.username, wallet.address, 
                    account_type, emk, encryptedPublicInfo, encryptedCorpInfo)
            } catch(err) {
                this.isGoingFinish = false
                console.log("network error")
                await window.hideIndicator()
                return;
            }

            if(resp.code == 1) {
                let gresp = await this.props.create_group(translate("basic_group"));
                await this.props.update_group_public_key(gresp.group_id, info['corp_master_key']);
            }

        } else if (account_type == window.CONST.ACCOUNT_TYPE.CORP_SUB) {

            let corp_count_resp = await this.props.get_corp_member_count_no_auth(this.state.corp_id, this.state.owner_id)
            let corp_member_count = corp_count_resp.corp_member_count
            let corp_member_count_max = corp_count_resp.corp_member_count_max

            if(corp_member_count_max <= corp_member_count)
                return alert(translate("max_corp_member_count"));

            let encryptedPublicInfo = aes_encrypt(JSON.stringify(public_info), Buffer.from(info['corp_key'], 'hex'));
            /*let consumeResp = await this.props.consume_invitation(this.state.registration_code, encryptedPublicInfo);
            if (!consumeResp) {
                return alert(translate("fail_to_use_invite_code"));
            }*/

            try {
                resp = await this.props.register_new_account(this.state.account, 
                    encryptedInfo, this.state.email, 
                    this.state.username, wallet.address, 
                    account_type, emk, encryptedPublicInfo, null, null, this.state.registration_code)
            } catch(err) {
                this.isGoingFinish = false
                console.log("network error")
                await window.hideIndicator()
                return;
            }
        } else if (account_type == window.CONST.ACCOUNT_TYPE.EXPERT) {
            try{
                resp = await this.props.register_new_account(this.state.account, 
                    encryptedInfo, this.state.email, 
                    this.state.username, wallet.address, 
                    account_type, emk, null, null, JSON.stringify(open_info))
            } catch(err) {
                this.isGoingFinish = false
                console.log("network error")
                await window.hideIndicator()
                return;
            }
        }
        await window.hideIndicator()

        if(resp.code == 1){
            window.logout();
            //localStorage.setItem("browser_key_virgin", 0);
            history.push("/");
            return alert(translate("success_register"))
        } else if(resp.code == -30) {
            this.isGoingFinish = false
            return alert(translate("fail_create_account"))
        } else if(resp.code == -21) {
            this.isGoingFinish = false
            return alert(translate("fail_create_corp_info"))
        } else if(resp.code == -22) {
            this.isGoingFinish = false
            return alert(translate("fail_create_account"))
        } else if(resp.code == -3) {
            this.isGoingFinish = false
            return alert(translate("already_login_this_browser"))
        } else if(resp.code == -4) {
            this.isGoingFinish = false
            return alert(translate("dont_create_session"))
        } else if(resp.code == -5) {
            this.isGoingFinish = false
            return alert(translate("fail_create_account"))
        } else {
            this.isGoingFinish = false
            return alert(translate("unknown_error_occured"))
        }

    }

    openWhatIsMasterkeywordModal = () => {
        window.openModal("CommonModal", {
            icon:"fas fa-money-check",
            title:translate("what_is_master_keyword"),
            subTitle:translate("what_is_master_keyword_desc_1"),
            desc:translate("what_is_master_keyword_desc_2")
        })
    }

    keyPress = async (type, e) => {
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
        return (<div className="content">
            <div className="service-title"> {translate("service_term")} </div>
            <textarea className="terms-condition" defaultValue={this.info1} disabled />
            
            <div className="service-title"> {translate("privacy_statement")} </div>
            <textarea className="terms-condition" defaultValue={this.info2} disabled />

            <div className="bottom-container">
                <div className="confirm-button" onClick={this.next_term}>
                    {translate("all_agree")}
                </div>
            </div>
        </div>)
    }

    render_email(){
        let type = this.getAccountType()

        return (<div className="content">
            <div className="text-place">
                <div className="name">{translate("email")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="email"
                        value={this.state.email || ""} 
                        onChange={e=>this.setState({email:e.target.value})}
                        disabled={this.state.email_verification}
                        placeholder={translate("please_input_email_correct")}/>
                </div>
                { type == window.CONST.ACCOUNT_TYPE.CORP_SUB ? null : (this.state.email_verification ?
                    <div className="gray-but">{translate("complete_send")}</div> : 
                    <div className="blue-but" onClick={this.onClickRequestEmail}>{translate("send")}</div>)
                }
                
            </div>

            {type == window.CONST.ACCOUNT_TYPE.CORP_SUB ? null : 
                <div className="text-place">
                    <div className="name">{translate("email_certification")}</div>
                    <div className="textbox">
                        <input className="common-textbox" type="text"
                            value={this.state.verification_code || ""}
                            onKeyDown={this.keyPress.bind(this, 0)}
                            onChange={e=>this.setState({verification_code:e.target.value})}
                            disabled={this.state.email_verification}
                            placeholder={translate("please_input_certification_number")}/>
                    </div>
                    {this.state.email_verification ? null : 
                        <div className={this.state.step1 == 1 ? "blue-but" : "gray-but"} onClick={this.onClickVerificateEmail}>
                            {translate("confirm")}
                        </div>
                    }
                </div>
            }

            <div className="text-place">
                <div className="name">{translate("password")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="password"
                        value={this.state.password || ""}
                        onChange={e=>this.setState({password:e.target.value})}  
                        placeholder={translate("at_lesat_8_detail")}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name">{translate("re_password")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="password"
                        value={this.state.password2 || ""}
                        onChange={e=>this.setState({password2:e.target.value})}
                        onKeyDown={this.keyPress.bind(this, 1)}
                        placeholder={translate("please_reinput_password")}/>
                </div>
            </div>

            <div className="bottom-container">
                <div className="back-button" onClick={this.prev_term}>{translate("go_back")}</div>
                <div className="confirm-button" onClick={this.onClickNextBtnAccountInfo}>
                    {translate("confirm")}
                </div>
            </div>
        </div>)
    }

    render_personal(){
        return (<div className="content">
            <div className="text-place">
                <div className="name">{translate("name")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.username || ""}
                        onChange={e=>this.setState({username:e.target.value})}
                        placeholder={translate("please_input_name_correct")}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name">{translate("individual_phone")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.userphone || ""} 
                        onChange={this.onChangePhoneForm.bind(this,"userphone")}
                        disabled={this.state.verificated_phone}
                        placeholder={translate("please_input_correct_phone")}/>
                </div>
                { this.state.verificated_phone ? null :
                    <div className="blue-but" onClick={this.onClickRequestPhone}>
                        {translate("send")}
                    </div>
                }
            </div>

            <div className="text-place">
                <div className="name">{translate("certification_number")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.phone_verification_code || ""} 
                        onChange={e=>this.setState({phone_verification_code:e.target.value})} 
                        disabled={this.state.verificated_phone}
                        placeholder={translate("please_input_certification_number")}/>
                </div>
                { this.state.verificated_phone ? null : 
                    <div className={ this.state.phone_verification_code_sent ? "blue-but":"gray-but"} onClick={this.onClickVerificatePhone}>
                        {translate("confirm")}
                    </div>
                }
            </div>

            <div className="text-place">
                <div className="name">{translate("individual_address")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.useraddress || ""} 
                        onChange={e=>this.setState({useraddress:e.target.value})}
                        placeholder={translate("please_input_address_correct")}/>
                </div>
                <div className="blue-but" onClick={this.onClickFindAddress.bind(this, 0)}>
                    {translate("search")}
                </div>
            </div>

            <div className="bottom-container">
                <div className="back-button" onClick={this.prev_term}>{translate("go_back")}</div>
                <div className="confirm-button" onClick={this.onClickNextBtnUserInfo}>
                    {translate("confirm")}
                </div>
            </div>
        </div>)
    }

    render_company() {
        return (<div className="content">
            <div className="text-place">
                <div className="name">{translate("corp_info")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.company_name || ""}
                        onChange={e=>this.setState({company_name:e.target.value})}
                        placeholder={translate("please_input_corp_name")}
                        disabled={this.getAccountType() == window.CONST.ACCOUNT_TYPE.CORP_SUB}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name"></div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.duns_number || ""}
                        onChange={e=>this.setState({duns_number:e.target.value})}
                        placeholder={translate("please_input_duns")}
                        disabled={this.getAccountType() == window.CONST.ACCOUNT_TYPE.CORP_SUB}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name">{translate("corporation_ceo_name")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.company_ceo || ""}
                        onChange={e=>this.setState({company_ceo:e.target.value})}
                        placeholder={translate("please_input_ceo_name")}
                        disabled={this.getAccountType() == window.CONST.ACCOUNT_TYPE.CORP_SUB}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name">{translate("corporation_tel")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.company_tel || ""}
                        onChange={this.onChangePhoneForm.bind(this,"company_tel")}
                        placeholder={translate("please_input_corp_tel")}
                        disabled={this.getAccountType() == window.CONST.ACCOUNT_TYPE.CORP_SUB}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name">{translate("corporation_address")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.company_address || ""} 
                        onChange={e=>this.setState({company_address:e.target.value})}
                        placeholder={translate("please_input_address_correct")}
                        disabled={this.getAccountType() == 2}/>
                </div>
                { this.getAccountType() == window.CONST.ACCOUNT_TYPE.CORP_SUB ? null : <div className="blue-but" onClick={this.onClickFindAddress.bind(this, 1)}>
                    {translate("search")}
                </div>}
            </div>

            <div className="split-line"></div>

            <div className="text-place">
                <div className="name">{translate("manager_info")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.username || ""}
                        onChange={e=>this.setState({username:e.target.value})}
                        placeholder={translate("please_input_manager_name")}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name"></div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.department || ""}
                        onChange={e=>this.setState({department:e.target.value})}
                        placeholder={translate("please_input_manager_department")}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name"></div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.job || ""}
                        onChange={e=>this.setState({job:e.target.value})}
                        placeholder={translate("please_input_manager_job")}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name">{translate("individual_phone")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.userphone || ""} 
                        onChange={this.onChangePhoneForm.bind(this,"userphone")}
                        disabled={this.state.verificated_phone}
                        placeholder={translate("please_input_certification_number")}/>
                </div>
                { this.state.verificated_phone ? null :
                    <div className="blue-but" onClick={this.onClickRequestPhone}>
                        {translate("send")}
                    </div>
                }
            </div>

            <div className="text-place">
                <div className="name">{translate("certification_number")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.phone_verification_code || ""} 
                        onChange={e=>this.setState({phone_verification_code:e.target.value})} 
                        disabled={this.state.verificated_phone}
                        placeholder={translate("please_input_certification_number")}/>
                </div>
                { this.state.verificated_phone ? null : 
                    <div className={ this.state.phone_verification_code_sent ? "blue-but":"gray-but"} onClick={this.onClickVerificatePhone}>
                        {translate("confirm")}
                    </div>
                }
            </div>

            <div className="bottom-container">
                <div className="back-button" onClick={this.prev_term}>{translate("go_back")}</div>
                <div className="confirm-button" onClick={this.onClickNextBtnCompanyInfo}>
                    {translate("confirm")}
                </div>
            </div>
        </div>)
    }

    render_expert() {
        let list = [
            {value:"lawyer", label: "변호사"},
            {value:"asqqd", label: "회계사"},
            {value:"ffqfq", label: "노무사"},
            {value:"qwfcv", label: "세무사"},
        ]
        return (<div className="content">
            <div className="text-place">
                <div className="name">이름</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.username || ""}
                        onChange={e=>this.setState({username:e.target.value})}
                        placeholder={"이름을 입력해주세요."}/>
                </div>
            </div>

            <div className="text-place">
                <div className="name">{translate("individual_phone")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.userphone || ""} 
                        onChange={this.onChangePhoneForm.bind(this,"userphone")}
                        disabled={this.state.verificated_phone}
                        placeholder={translate("please_input_certification_number")}/>
                </div>
                { this.state.verificated_phone ? null :
                    <div className="blue-but" onClick={this.onClickRequestPhone}>
                        {translate("send")}
                    </div>
                }
            </div>

            <div className="text-place">
                <div className="name">{translate("certification_number")}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.phone_verification_code || ""} 
                        onChange={e=>this.setState({phone_verification_code:e.target.value})} 
                        disabled={this.state.verificated_phone}
                        placeholder={translate("please_input_certification_number")}/>
                </div>
                { this.state.verificated_phone ? null : 
                    <div className={ this.state.phone_verification_code_sent ? "blue-but":"gray-but"} onClick={this.onClickVerificatePhone}>
                        {translate("confirm")}
                    </div>
                }
            </div>

            <div className="text-place">
                <div className="name">{"주소"}</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.company_address || ""} 
                        onChange={e=>this.setState({company_address:e.target.value})}
                        placeholder={translate("please_input_address_correct")}
                        disabled={this.getAccountType() == 2}/>
                </div>
                <div className="blue-but" onClick={this.onClickFindAddress.bind(this, 1)}>
                    {translate("search")}
                </div>
            </div>

            <div className="split-line"></div>

            <div className="add-title">자문 분야</div>
            <div className="add-list">
                <div className="item">
                    <div className="row">
                        <div className="box width200">
                            <div className="title">분야</div>
                            <div className="desc">
                                <Dropdown className="common-select"
                                    controlClassName="control"
                                    menuClassName="item"
                                    placeholder={"자문 분야 선택"}
                                    options={list}
                                    onChange={e=>{this.setState({expert_part:e.value, expert_part_label:e.label})}}
                                    value={this.state.expert_part_label} />
                            </div>
                        </div>
                        <div className="box flex1">
                            <div className="title">자격증 사진</div>
                            <div className="desc">
                                <input className="common-textbox" type="file" accept="image/x-png,image/gif,image/jpeg" />
                            </div>
                        </div>
                    </div>
                    <div className="career">
                        <div className="title">경력</div>
                        <div className="item">
                            <input className="common-textbox" type="text"
                                value={this.state.career_text || ""}
                                onChange={e=>this.setState({career_text:e.target.value})}
                                placeholder={"예 ) 2018 ~ 2020 사법고시 합격"}/>
                            <div className="blue-but">추가</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="split-line"></div>

            <div className="text-place">
                <div className="name">소개 문구</div>
                <div className="textbox">
                    <input className="common-textbox" type="text"
                        value={this.state.introduction || ""}
                        onChange={e=>this.setState({introduction:e.target.value})}
                        placeholder={"자기 소개를 입력해주세요."}/>
                </div>
            </div>

            <div className="bottom-container">
                <div className="back-button" onClick={this.prev_term}>{translate("go_back")}</div>
                <div className="confirm-button" onClick={this.onClickNextBtnCompanyInfo}>
                    {translate("confirm")}
                </div>
            </div>
        </div>)
    }

    render_masterkey(){
        return (<div className="content">
            <div className="master-keyword-container">
                <div className="sub-title-container">
                    <div className="title">{translate("recover_password")}</div>
                    {/*<div className="what-is-masterkeyword" onClick={this.openWhatIsMasterkeywordModal}>{translate("what_is_recover_password")}</div>*/}
                </div>
                {/*<div className="list">
                    {this.state.mnemonic.split(" ").map((e,k)=>{
                        return <div key={e+k} className="item">{k+1}. {e}</div>
                    })}
                </div>*/}
                <div className="recover-password">
                    {translate("recover_password")} : <b onClick={this.clickCopy.bind(this, this.state.recover_password)}>{this.state.recover_password}</b>
                </div>

                <div className="reference">
                    {translate("recover_password_must_be_save_desc_1")}<br/>
                    <br/>
                    {translate("recover_password_must_be_save_desc_2")}<br/>
                </div>
            </div>

            <div className="bottom-container">
                {/*<div className="transparent-button" onClick={this.onClickSaveMnemonic}>
                    {translate("download_saveform")}
                </div>*/}
                <div className="confirm-button" onClick={this.onClickFinishRegister /*next_term*/}>
                    {translate("confirm")}
                </div>
            </div>
        </div>)
    }

    render_empty_slot() {
        let count = 12 - this.state.sort_test.length
        let div = []
        for(let i = 0 ; i < count ; i++) {
            div.push(<div className="empty-item">&nbsp;</div>)
        }
        return div
    }

    render_confirm_masterkey(){
        let shuffled_mnemonic = this.state.shuffled_mnemonic
        return (<div className="content">
            <div className="master-keyword-container">
                <div className="sub-title-container">
                    <div className="title">{translate("confirm_master_keyword")}</div>
                </div>
                <div className="selection-list">
                    {this.state.sort_test.map((e,k)=>{
                        return <div className="item" key={e.idx}>{e.word}</div>
                    })}
                    {this.render_empty_slot()}
                </div>
                <div className="split-line"></div>
                <div className="list">
                    {shuffled_mnemonic.map((e, k)=>{
                        return <div key={e.idx} 
                                    className={`item cursored ${this.state.sort_test.find( v => v.word == e.word && v.idx == e.idx) ? "selected" : ""}`}
                                    onClick={this.onClickSortTest.bind(this,e)}
                                >
                            {e.word}
                        </div>
                    })}
                </div>
            </div>
            <div className="bottom-container">
                <div className="back-button" onClick={this.prev_term}>{translate("go_back")}</div>
                <div className="confirm-button" onClick={this.onClickFinishRegister}>{translate("complete_join")}</div>
            </div>
        </div>)
    }

    render_content(){
        if(this.state.step == 0){
            return this.render_term();
        }else if(this.state.step == 1){
            return this.render_email();
        }else if(this.state.step == 2){
            let type = this.getAccountType()
            if(type == window.CONST.ACCOUNT_TYPE.PERSONAL)
                return this.render_personal();
            else if(type == window.CONST.ACCOUNT_TYPE.CORP_MASTER || type == window.CONST.ACCOUNT_TYPE.CORP_SUB)
                return this.render_company();
            else if(type == window.CONST.ACCOUNT_TYPE.EXPERT)
                return this.render_expert();
        }else if(this.state.step == 3){
            return this.render_masterkey();
        }else if(this.state.step == 4){
            return this.render_confirm_masterkey();
        }
    }

    render_title() {
        let type = this.getAccountType()
        let title = "", desc = ""
        if(this.state.step == 0){
            if(type == window.CONST.ACCOUNT_TYPE.PERSONAL) {
                title = translate("individual_join_term_agree")
                desc = translate("individual_join_term_agree_desc")
            }
            else if(type == window.CONST.ACCOUNT_TYPE.CORP_MASTER) {
                title = translate("corporation_join_term_agree")
                desc = translate("corporation_join_term_agree_desc")
            }
            else if(type == window.CONST.ACCOUNT_TYPE.CORP_SUB) {
                title = translate("coporation_staff_account_join_term_agree")
                desc = translate("coporation_staff_account_join_term_agree_desc")
            }
            else if(type == window.CONST.ACCOUNT_TYPE.EXPERT) {
                title = translate("expert_join_term_agree")
                desc = translate("expert_join_term_agree_desc")
            }
        } else if(this.state.step == 1){
            title = translate("input_account_info")
            if(type == window.CONST.ACCOUNT_TYPE.PERSONAL)
                desc = translate("input_account_info_desc_1")
            else if(type == window.CONST.ACCOUNT_TYPE.CORP_MASTER)
                desc = translate("input_account_info_desc_2")
            else if(type == window.CONST.ACCOUNT_TYPE.CORP_SUB)
                desc = translate("input_account_info_desc_3")
            else if(type == window.CONST.ACCOUNT_TYPE.EXPERT)
                desc = translate("input_account_info_desc_4")
        } else if(this.state.step == 2){
            if(type == window.CONST.ACCOUNT_TYPE.PERSONAL) {
                title = translate("input_user_info")
                desc = translate("input_user_info_desc")
            } else if(type == window.CONST.ACCOUNT_TYPE.CORP_MASTER || type == window.CONST.ACCOUNT_TYPE.CORP_SUB) {
                title = translate("input_corporation_info")
                desc = translate("input_corporation_info_desc")
            } else if(type == window.CONST.ACCOUNT_TYPE.EXPERT) {
                title = translate("input_expert_detail_info")
                desc = translate("input_expert_info_desc")
            }
        } else if(this.state.step == 3){
            title = translate("save_recover_password")
            desc = translate("save_recover_password_desc_1")
            /*title = translate("save_master_keyword")
            desc = translate("save_master_keyword_desc_1")*/
        } /*else if(this.state.step == 4){
            title = translate("save_master_keyword")
            desc = translate("save_master_keyword_desc_2")
        }*/

        return <div className="top">
            <div className="title">{title}</div>
            <div className="sub">{desc}</div>
        </div>
    }

	render() {

        let type = this.getAccountType()
        let step2_text = ""
        if(type == window.CONST.ACCOUNT_TYPE.PERSONAL)
            step2_text = translate("input_user_info")
        else if(type == window.CONST.ACCOUNT_TYPE.CORP_MASTER)
            step2_text = translate("input_corporation_info")
        else if(type == window.CONST.ACCOUNT_TYPE.CORP_SUB)
            step2_text = translate("input_manager_info")
        else if(type == window.CONST.ACCOUNT_TYPE.EXPERT)
            step2_text = translate("input_expert_info")

		return (<div className="maintain" key={this.state.language}>
            <div className="register-common-page register-page">
                <div className="left-logo">
                    <img src="/static/logo_blue.png" onClick={()=>history.push("/")}/>
                    <div className="flex-1"></div>
                    <div className="language-dropdown">
                        <div className="language">{this.state.language}</div>
                        <div className="languages-dropdown">
                            <div onClick={()=>{window.setCookie("LANGUAGE", "KR"); window.location.reload(true)}}>Korean</div>
                            <div onClick={()=>{window.setCookie("LANGUAGE", "EN"); window.location.reload(true)}}>English</div>
                            <div onClick={()=>{window.setCookie("LANGUAGE", "CN"); window.location.reload(true)}}>Chinese</div>
                        </div>
                    </div>
                </div>
                <div className="desc-container">
                    <div className="info">
                        {this.render_title()}
                        <div className="step-indicator">
                            <div className={`circle ${this.state.step == 0 ? "enable-circle": ""}`}></div>
                            <div className="line"></div>
                            <div className={`circle ${this.state.step == 1 ? "enable-circle": ""}`}></div>
                            <div className="line"></div>
                            <div className={`circle ${this.state.step == 2 ? "enable-circle": ""}`}></div>
                            <div className="line"></div>
                            <div className={`circle ${this.state.step == 3 || this.state.step == 4 ? "enable-circle": ""}`}></div>
                        </div>
                        <div className="step-text">
                            <div className={`item ${this.state.step == 0 ? "enable": ""}`}>{translate("terms_agree")}</div>
                            <div className={`item ${this.state.step == 1 ? "enable": ""}`}>{translate("input_account_info")}</div>
                            <div className={`item ${this.state.step == 2 ? "enable": ""}`}>{step2_text}</div>
                            <div className={`item ${this.state.step == 3 || this.state.step == 4 ? "enable": ""}`}>{translate("recover_password_issue")}</div>
                        </div>
                    </div>
                    <div className="desc">
                        {this.render_content()}
                    </div>
                </div>
    		</div>

            <Footer />
        </div>);
	}
}
