rm -rf package-lock.json 
rm -rf yarn.lock
rm -rf node_modules/
rm -rf ios/build/
rm -rf ios/Pods/
rm -rf ios/Podfiles.lock

yarn install
cd ios && pod install
cd .. && react-native link