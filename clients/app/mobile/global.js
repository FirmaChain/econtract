export * from "../common/global"
import fs from 'react-native-fs';
import { GoogleSignin } from 'react-native-google-signin';

window.iphoneXPadding = 30
window.isIphoneX = () => {
  let d = Dimensions.get('window');
  const { height, width } = d;

  return (
    Platform.OS === 'ios' &&
    (height === 812 || width === 812)
  );
}

window.readFile = async function(path,encode){
  return await fs.readFile(path,encode)
}

window.writeFile = async function(path,data,encode){
  return await fs.readFile(path,data,encode)
}

window.googleSignin = async ()=>{
  return await GoogleSignin.signIn()
}

window.googleSignInSilently = async ()=>{
  return await GoogleSignin.signInSilently()
}