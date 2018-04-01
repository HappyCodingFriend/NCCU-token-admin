let web3 = new Web3();

let contracts;

$.get('jsonfile',function(result){
    contracts = result;
})
console.log(web3.version)
//發行 (名稱，發行量，期限，私鑰，nonce)
function issue(name, totalSupply, deadline, privateKey, nonce){
    let ERC223TokenContract = new web3.eth.Contract(contracts.ERC223Token.abi);
    let data = ERC223TokenContract.deploy({
        data: contracts.ERC223Token.bytecode,
        arguments: [name, "point", 0, totalSupply, deadline]
    }).encodeABI();

    let tx = signTx(privateKey, null, nonce, data);
    return tx;

}
//發送(對象，值，私鑰，toke合約地址，nonce)
function transfer(to, value, privateKey, token, nonce){
    let ERC223TokenContract = new web3.eth.Contract(contracts.ERC223Token.abi);
    let data = ERC223TokenContract.methods.transfer(to,value).encodeABI();

    let tx = signTx(privateKey, token, nonce, data);
    console.log(tx)
    return tx;

}
//掛單(被交換的token合約位置，要交換的token合約位置，被交換的量，要交換的量，期限，私鑰，nonce)
function addExchange(token1, token2, value1, value2, deadline, privateKey, nonce){
    let ERC223TokenContract = new web3.eth.Contract(contracts.ERC223Token.abi);
    let data = ERC223TokenContract.methods.addExchange(token2, value1, value2, deadline).encodeABI();

    let tx = signTx(privateKey, token1, nonce, data);
    return tx;

}
//買單(單子的合約位置，交換的token，交換的量，私鑰，nonce)
function doExchange(exchange, token, value, privateKey, nonce){
    let ERC223TokenContract = new web3.eth.Contract(contracts.ERC223Token.abi);
    let data = ERC223TokenContract.methods.transfer(exchange, value).encodeABI();

    let tx = signTx(privateKey, token, nonce, data);
    return tx;

}
//取消掛單(單子的合約位置，交換的token，交換的量，期限，私鑰，nonce)
function cancelExchange(exchange, privateKey, nonce){
    let ExchangeContract = new web3.eth.Contract(contracts.Exchange.abi);
    let data = ExchangeContract.methods.cancel().encodeABI();

    let tx = signTx(privateKey, exchange, nonce, data);
    return tx;

}

//sign transaction
function signTx(privateKey, _to, _nonce, _data){
    let tx = web3.eth.accounts.signTransaction({
        to: _to,
        gas: 4000000,
        gasPrice: '0x0',
        nonce: _nonce, 
        data: _data,
        chainId: "0x11" //改成你的chain id
    }, privateKey)
    return tx;
}