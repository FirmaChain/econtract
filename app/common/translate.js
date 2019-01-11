let _ = {
    INDEX_TITLE_1:["위 ・ 변조 없는 전자문서", "A stand against electronic document forgery", "没有任何伪造的电子文件"],
    INDEX_TITLE_2:["E-Contract 를 만나보실 시간입니다.", "Meet E-Contract", "欢迎来到E-Contract世界"],
    INDEX_TITLE_3:["지금 시작하기", "Start now", "开始"],

    MIDDLE1_TITLE_1:["해킹 위험으로 인한 불안한 일상","Blockchain technology can help you","区块链技术可以帮助您实现防御黑客侵袭的生活"],
    MIDDLE1_TITLE_2:["이젠 블록체인으로 벗어나세요.","lead a hack-proof life.",""],
    MIDDLE1_DESC_1:["E-Contract 서비스는 탈중앙화 전자 계약 플랫폼으로 ","E-Contract is a platform for decentralized electronic contracting. ","电子合同是分散电子订约的平台"],
    MIDDLE1_DESC_2:["모든 계약 내용은 오직 계약 당사자들에게만 읽기 및 수정 권한이 부여되며, ","Only the contracting parties can view and edit the contract. ","只有缔约方才能查看和编辑合同。"],
    MIDDLE1_DESC_3:["그 외 모든 접근은 불허됩니다. ","All other accesses are forbidden. ","禁止所有其他访问。"],
    MIDDLE1_DESC_4:["모든 내용은 계약 당사자들만이 가지고 있는 마스터 키워드로만 복호화 할 수 있습니다. ","Contracts can only be decrypted using the master keyword provided to the contracting parties. ","合同只能使用提供给缔约方的主关键字进行解密。"],
    MIDDLE1_DESC_5:["이는 타원 곡선 암호를 이용하여 개발사조차도 계약 내용에 대한 복호화가 불가능합니다.","E-Contract uses elliptic curve cryptography, allowing the contractual terms to remain safely hidden, even from the developers. ","E-Contract使用椭圆曲线加密技术，这个技术可以让合同条款安全隐藏,这样的话即使是开发人员也不能随意浏览合同的相关内容。"],

    MIDDLE2_TITLE_1:["불편한 서면계약 대신","Try using electronic contracts instead of the","尝试使用电子合同而不是旧的不方便的面对面合同。"],
    MIDDLE2_TITLE_2:["편리한 전자계약을 사용해 보세요.","uncomfortable face-to-face contracts of old.",""],
    MIDDLE2_DESC_1:["전자문서, 서명 법안이 발효되면서 서면계약과 동일한 법적 효력이 ","New legislations on digital signature allow electronic contracts to have ","新的数字签字立法中允许电子合同具有与旧合同相同的法律约束力。"],
    MIDDLE2_DESC_2:["발생하게 되었습니다. E-Contract 는 서면 계약이 가지는 단점들을 ","the same legal binding power as the contracts of old. ","E-Contract技术的使用可以消除面对面合同的弊端并最大限度地发挥其优势"],
    MIDDLE2_DESC_3:["보완하고 장점들은 극대화하여 상호간에 이뤄지는 계약 과정 내에서의 ","E-Contract uses technology to eliminate the drawbacks of face-to-face ",""],
    MIDDLE2_DESC_4:["발생하는 불편한 점들을 기능을 통해 해결하였습니다.","contracting and to maximize the advantages.",""],

    BOTTOM_TITLE_1:["E-Contract 의","E-Contract’s","介绍电子合同的特殊功能"],
    BOTTOM_TITLE_2:["특별한 기능들을 소개합니다.","Special features",""],
    BOTTOM_LEFT_DESC_TITLE:["해킹 원천 차단","Hack-proof","黑客切断"],
    BOTTOM_LEFT_DESC:["서버는 오로지 계약 당사자간의 암호화된 데이터 전달 및 최소한의 세션 정보만 저장합니다. 브라우저에 복호화를 위한 정보를 저장함으로써 계약에 대한 외부 해킹을 차단함은 물론, 오로지 계약 당사자들만이 접근 가능합니다.","Data transactions are encrypted and the server only stores the most minimal session inputs. Decryption tools are saved browser-side such that the contract details cannot be hacked from the outside. Only the contractors can have access.","数据事务是加密的，服务器只存储最小的会话输入解密工具在浏览器端保存，以便不会从外部攻击合同细节。只有承包商才能进入。"],

    BOTTOM_RIGHT_DESC_TITLE:["모두가 만족하는 계약","Satisfaction guaranteed","满意保证"],
    BOTTOM_RIGHT_DESC:["계약 당사자들에게 제공되는 실시간 메시지 기능과 컨펌하기 기능은 계약 진행에 있어서 모두가 만족하는 계약이 될 수 있게끔 합니다.","The live messaging feature and confirm feature can suit all of your needs.","实时消息功能和确认功能可满足您的所有需求"],

    FOOTER_1:["(주) 피르마 솔루션즈","Firma Solutions Co. Ltd.","Firma Solutions Co. Ltd."],
    FOOTER_2:["서울시 성동구 성동이로 58, P-Tower 5층 ㅣ 사업자등록번호 261-88-0108","Seoul, Seongdong-gu, Seongdonge-ro 58, P-Tower 5th floor ㅣ CRN 261-88-0108","Seoul, Seongdong-gu, Seongdonge-ro 58, P-Tower 5th floor ㅣ CRN 261-88-0108"],
}

export default function(ID, params){
    if(_[ID] == null)
        return ID + " is null"
    let language = 0
    switch(global.LANG) {
        case "KR":
            language = 0
            break;
        case "EN":
            language = 1
            break;
        case "CN":
            language = 2
            break;
    }
    return _[ID][language]
}