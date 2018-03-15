const web3 = new Web3();

const ERC223TokenContract = new web3.eth.Contract(contracts.ERC223Token.abi);
const ExchangeContract = new web3.eth.Contract(contracts.Exchange.abi);

//發行 (名稱，發行量，期限，私鑰，nonce)
function issue(name, totalSupply, deadline, privateKey, nonce){

    let data = ERC223TokenContract.deploy({
        data: contracts.ERC223Token.bytecode,
        arguments: [name, "point", 0, totalSupply, deadline]
    }).encodeABI();

    let tx = signTx(privateKey, null, nonce, data);
    return tx.rawTransaction;

}
//發送(對象，值，私鑰，toke合約地址，nonce)
function transfer(to, value, privateKey, token, nonce){

    let data = ERC223TokenContract.methods.transfer(to,value).encodeABI();

    let tx = signTx(privateKey, token, nonce, data);
    return tx.rawTransaction;

}
//轉移(對象，值，私鑰，token合約地址，nonce)
function balance(account, privateKey, token, nonce){

    let data = ERC223TokenContract.methods.balanceOf(account).encodeABI();

    let tx = signTx(privateKey, token, nonce, data);
    return tx.rawTransaction;

}
//掛單(被交換的token合約位置，要交換的token合約位置，被交換的量，要交換的量，期限，私鑰，nonce)
function addExchange(token1, token2, value1, value2, deadline, privateKey, nonce){
    
    let data = ERC223TokenContract.methods.addExchange(token2, value1, value2, deadline).encodeABI();

    let tx = signTx(privateKey, token1, nonce, data);
    return tx.rawTransaction;

}
//買單(單子的合約位置，交換的token，交換的量，期限，私鑰，nonce)
function doExchange(exchange, token, value, deadline, privateKey, nonce){
    
    let data = ERC223TokenContract.methods.transfer(exchange, value).encodeABI();

    let tx = signTx(privateKey, token, nonce, data);
    return tx.rawTransaction;

}
//取消掛單(單子的合約位置，交換的token，交換的量，期限，私鑰，nonce)
function cancelExchange(exchange, privateKey, nonce){
    
    let data = ExchangeContract.methods.cancel().encodeABI();

    let tx = signTx(privateKey, exchange, nonce, data);
    return tx.rawTransaction;

}

//sign transaction
function signTx(privateKey, _to, _nonce, _data){
    let tx = web3.eth.accounts.signTransaction({
        to: _to,
        gas: 2000000,
        gasPrice: '234567897654321',
        nonce: _nonce, 
        data: _data,
        chainId: "0x0" //改成你的chain id
    }, privateKey)
    return tx;
}