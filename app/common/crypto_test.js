import bip32 from 'bip32'
import bip39 from 'bip39'
import {
	ecdsa_sign,
	ecdsa_verify,
	ecaes_encrypt,
	ecaes_decrypt,
	aes_encrypt,
	aes_decrypt,
	bip32_from_512bit,
	hmac_sha512,
	hmac_sha256,
	get256bitDerivedPrivateKey,
	get256bitDerivedPublicKey,
	dkaes_encrypt,
	dkaes_decrypt,
} from "./CryptoUtil"

export { 
	aes_encrypt,
	aes_decrypt,
	ecdsa_verify
} from "./CryptoUtil";

let serverDB = {};
export function generateMnemonic() {
	let mnemonic = bip39.generateMnemonic();
	//let mnemonic = bip39.entropyToMnemonic('000102030405060708090a0b0c0d0e0f');
	return mnemonic;
}

export function getBrowserKey() {
	let browserKey = localStorage.getItem("browser_key");
	if (browserKey == null) {
		browserKey = generateBrowserKey().toString("base64");
		localStorage.setItem("browser_key", browserKey);
	}
	return Buffer.from(browserKey, "base64");
}

export function generateBrowserKey() {
	let mnemonic = generateMnemonic();
	let entropy = bip39.mnemonicToEntropy(mnemonic);
	let seed = bip39.mnemonicToSeed(mnemonic);
	let digest = hmac_sha512("FirmaChain browser seed", seed);
	return digest;
}

export function mnemonicToSeed(mnemonic){
	return bip39.mnemonicToSeed(mnemonic);
}

export function makeMnemonic(auth) {
	let userMnemonic = generateMnemonic();
	let userEntropy = bip39.mnemonicToEntropy(userMnemonic);
	let browserKey = getBrowserKey();
	let encryptedUserEntropy = aes_encrypt(userEntropy, auth);
	let encryptedUserEntropyTwice = dkaes_encrypt(browserKey, "m/0'/0'", encryptedUserEntropy);
	serverDB['encryptedUserEntropy'] = encryptedUserEntropyTwice;
	return encryptedUserEntropyTwice;
	//return userMnemonic;
}

export function showMnemonic(auth) {
	let browserKey = getBrowserKey();
	let encryptedUserEntropyTwice = serverDB['encryptedUserEntropy'];
	let encryptedUserEntropy = dkaes_decrypt(browserKey, "m/0'/0'", encryptedUserEntropyTwice);
	let userEntropy = aes_decrypt(encryptedUserEntropy, auth);
	let userMnemonic = bip39.entropyToMnemonic(userEntropy);
	return userMnemonic;
}

export function makeAuth(id, pw) {
	let browserKey = getBrowserKey();
	let hmackey = get256bitDerivedPublicKey(browserKey, "m/0'/0'");
	let hmacpw = hmac_sha256(hmackey, pw);
	let msg = Buffer.concat([hmackey, Buffer.from(id, "utf8"), hmacpw]);
	let auth = hmac_sha256("", msg);
	return auth;
}

export function SeedToMasterKeyPublic(seed){
	let masterKey = hmac_sha512("FirmaChain master seed", seed);
	return get256bitDerivedPublicKey(masterKey, "m/0'/0'");
}

export function BrowserKeyBIP32(){
	let browserKey = getBrowserKey();
	return {
		privateKey : bip32_from_512bit(browserKey).derivePath("m/0'/1'").privateKey,
		publicKey : bip32_from_512bit(browserKey).derivePath("m/0'/1'").publicKey,
	}
}

export function makeSignData(str, auth, nonce){
	let browserKey = BrowserKeyBIP32();
	let msgHash = hmac_sha512(str, Buffer.concat([Buffer.from(nonce.toString()), auth]))

	let sign = Buffer.from(ecdsa_sign(msgHash, browserKey.privateKey).toDER()).toString('hex')
	return {
		payload: sign,
		publicKey:browserKey.publicKey,
		privateKey:browserKey.privateKey,
		msgHash:msgHash
	}
}

export function new_account(id, pw){
	let auth = makeAuth(id, pw);
	let encryptedMasterSeed = makeMnemonic(auth)
	let rawMnemonic = showMnemonic(auth);
	let seed = mnemonicToSeed(rawMnemonic)
	let masterKeyPublic = SeedToMasterKeyPublic(seed)
	let browserKey = BrowserKeyBIP32();

	return {
		auth:auth,
		encryptedMasterSeed:encryptedMasterSeed,
		rawMnemonic:rawMnemonic,
		seed:seed,
		masterKeyPublic:masterKeyPublic,
		browserKey:browserKey
	}
}

export function getUserEntropy(auth, eems){
	let bk = getBrowserKey();
	let eems_buffer = Buffer.from(eems, "base64").toString("hex");
	let encryptedUserEntropy = dkaes_decrypt(bk, "m/0'/0'", eems_buffer);
	let userEntropy = aes_decrypt(encryptedUserEntropy, auth);

	return userEntropy;
}

export function decrypt_user_info(entropy, encrypted_info){
	let mnemonic = bip39.entropyToMnemonic(entropy);
	let seed = bip39.mnemonicToSeed(mnemonic);
	let masterKey = hmac_sha512("FirmaChain master seed", seed);
	let masterKeyPublic = get256bitDerivedPublicKey(masterKey, "m/0'/0'");
	let result = aes_decrypt(encrypted_info, masterKeyPublic);

	try{
		return JSON.parse(result)
	}catch(err){
		return result
	}
}
