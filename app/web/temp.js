function join_mnemonic() {
	var id = document.login_info3.id.value;
	var pw = document.login_info3.pw.value;
//	var mnemonic = document.login_info3.mnemonic.value;
//	if (!CryptoUtil.bip39.validateMnemonic(mnemonic)) {
//		alert("Invalid mnemonic");
//		return;
//	}
	getBrowserKey(true); // Reset browserkey
	var auth = makeAuth(id, pw);
	var encryptedMasterSeed = makeMnemonic(auth, mnemonic);

	var rawMnemonic = showMnemonic(auth);
	var seed = CryptoUtil.bip39.mnemonicToSeed(rawMnemonic);
//	var masterKey = CryptoUtil.hmac_sha512("FirmaChain master seed", seed);
//	var masterKeyPublic = CryptoUtil.get256bitDerivedPublicKey(masterKey, "m/0'/0'");

	var browserKey = getBrowserKey();
	var browserKeyPublic = CryptoUtil.bip32_from_512bit(browserKey).derivePath("m/0'/1'").publicKey;

	alert("Your mnemonic is");
	alert(rawMnemonic);

	var info = document.login_info.info.value;
	var encryptedInfo = CryptoUtil.aes_encrypt(info, masterKeyPublic);

	var regFrm = document.recover_hidden;
	regFrm.auth.value = auth.toString('hex');
	regFrm.eems.value = encryptedMasterSeed;
	regFrm.publicms.value = masterKeyPublic.toString('hex');
	regFrm.publicbk.value = browserKeyPublic.toString('hex');
	regFrm.info.value = encryptedInfo;
	regFrm.submit();
}

