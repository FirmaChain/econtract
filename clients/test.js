let Web3 = require('web3')
web3 = new Web3( new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/103b22dad4f04d26818acc658e23a7ea') );

web3.eth.getBalance("0x75F9CcFDA21f57A35319eAF8fA64643A2ac423cD").then((w)=>{
    console.log(">>>",w)
})