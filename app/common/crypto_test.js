import bip32 from 'bip32'
import bip39 from 'bip39'
import {
    ecdsa_sign,
    ecdsa_verify,
    ec_key_from_private,
    ec_key_from_public,
    ecaes_encrypt,
    ecaes_decrypt,
    aes_encrypt,
    aes_decrypt,
    aes_encrypt_async,
    aes_decrypt_async,
    bip32_from_512bit,
    hmac_sha512,
    hmac_sha256,
    get256bitDerivedPrivateKey,
    get256bitDerivedPublicKey,
    dkaes_encrypt,
    dkaes_decrypt,
    generate_random,
} from "./CryptoUtil"

export { 
    aes_encrypt_async,
    aes_decrypt_async,
    aes_encrypt,
    aes_decrypt,
    ecdsa_verify,
    generate_random,
    hmac_sha256,
    get256bitDerivedPublicKey,
} from "./CryptoUtil";

let serverDB = {};
export function generateMnemonic() {
	let mnemonic = bip39.generateMnemonic();
	//let mnemonic = bip39.entropyToMnemonic('000102030405060708090a0b0c0d0e0f');
	return mnemonic;
}

export function getBrowserKey(forcedGenerate=false) {
	let browserKey = localStorage.getItem("browser_key");
	if (forcedGenerate || browserKey == null) {
		browserKey = generateBrowserKey().toString("base64");
		localStorage.setItem("browser_key", browserKey);
        localStorage.setItem("browser_key_virgin", 1);
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

export function generateCorpKey() {
	let mnemonic = generateMnemonic();
	let entropy = bip39.mnemonicToEntropy(mnemonic);
	let seed = bip39.mnemonicToSeed(mnemonic);
	let digest = hmac_sha512("FirmaChain corp seed", seed);
	return digest;
}

export function entropyToMnemonic(entropy) {
    return bip39.entropyToMnemonic(entropy);
}

export function mnemonicToSeed(mnemonic){
	return bip39.mnemonicToSeed(mnemonic);
}

export function validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
}

export function makeMnemonic(auth, forcedMnemonic=null) {
	let userMnemonic = forcedMnemonic ? forcedMnemonic : generateMnemonic();
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

export function SeedToMasterKeyPublicContract(seed){
	let masterKey = hmac_sha512("FirmaChain master seed", seed);
	return bip32_from_512bit(masterKey).derivePath("m/2'/0'").publicKey;
}

export function SeedToEthKey(seed, subpath){
	let masterKey = hmac_sha512("Bitcoin seed", seed);
    let coinMasterKey = bip32_from_512bit(masterKey).derivePath("m/44'/60'");
    let requestKey = bip32_from_512bit(masterKey).derivePath("m/44'/60'/"+subpath);
    if (coinMasterKey.toBase58() == requestKey.toBase58()) {
        return null;
    } else {
        return requestKey;
    }
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
	let masterKeyPublicContract = SeedToMasterKeyPublicContract(seed)
	let browserKey = BrowserKeyBIP32();

	return {
		auth:auth,
		encryptedMasterSeed:encryptedMasterSeed,
		rawMnemonic:rawMnemonic,
		seed:seed,
		masterKeyPublic:masterKeyPublic,
		masterKeyPublicContract:masterKeyPublicContract,
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

export function getContractKey(pin, sharedAuxKey) {
    return hmac_sha256("FirmaChain New Contract", Buffer.concat([Buffer.from(pin), sharedAuxKey]));
}

export function sealContractAuxKey(publicKeyHex, sharedAuxKey) {
    let publicKey = ec_key_from_public(Buffer.from(publicKeyHex,'hex'), undefined, 1);
    let sharedAuxKeyEncrypted = ecaes_encrypt(sharedAuxKey, publicKey, 1);
    let sharedAuxKeyEncryptedHex = Buffer.concat([Buffer.from(sharedAuxKeyEncrypted.encrypted_message, 'hex'), Buffer.from(sharedAuxKeyEncrypted.temp_key_public.encodeCompressed())]).toString('hex');
    return sharedAuxKeyEncryptedHex;
}

export function unsealContractAuxKey(entropy, eckaiHex){
    try{
        let mnemonic = bip39.entropyToMnemonic(entropy);
        let seed = bip39.mnemonicToSeed(mnemonic);
        let masterKey = hmac_sha512("FirmaChain master seed", seed);
        let private_key = ec_key_from_private(bip32_from_512bit(masterKey).derivePath("m/2'/0'").privateKey, undefined, 1);

        let eckai = Buffer.from(eckaiHex, "hex");
        var encrypted_message = eckai.slice(0, 32).toString('hex');
        var temp_key_public_compressed = eckai.slice(32, 65);

        var temp_key_public = ec_key_from_public(temp_key_public_compressed, undefined, 1).getPublic();
        var cipher_text = {'encrypted_message':encrypted_message, 'temp_key_public':temp_key_public};
        var sharedAuxKeyDecrypted = ecaes_decrypt(cipher_text, private_key, true);

        return sharedAuxKeyDecrypted;
    }catch(err){
        console.log(err);
        return null;
    }
}

export function encryptPIN(pin){
    try{
        let entropy = sessionStorage.getItem("entropy");
        let mnemonic = bip39.entropyToMnemonic(entropy);
        let seed = bip39.mnemonicToSeed(mnemonic);
        let masterKey = hmac_sha512("FirmaChain master seed", seed);
        return dkaes_encrypt(masterKey, "m/3'/0'", pin);
    }catch(err){
        console.log(err);
        return null;
    }
}

export function decryptPIN(epin){
    try{
        let entropy = sessionStorage.getItem("entropy");
        let mnemonic = bip39.entropyToMnemonic(entropy);
        let seed = bip39.mnemonicToSeed(mnemonic);
        let masterKey = hmac_sha512("FirmaChain master seed", seed);
        return dkaes_decrypt(masterKey, "m/3'/0'", epin);
    }catch(err){
        console.log(err);
        return null;
    }
}

export function getMasterSeed() {
    try {
        let entropy = sessionStorage.getItem("entropy");
        let mnemonic = bip39.entropyToMnemonic(entropy);
        let seed = bip39.mnemonicToSeed(mnemonic);
        return seed;
    } catch(err) {
        console.log(err);
        return null;
    }
}
