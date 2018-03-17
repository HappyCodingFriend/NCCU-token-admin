var express = require('express');
var router = express.Router();

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const fs = require('fs');
const contracts = JSON.parse(fs.readFileSync('./contract/contracts.json'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('issue',{title: "發行點數"});
});
router.get('/transfer', function(req, res, next) {
  res.render('transfer',{title: "發送點數"});
});
router.get('/search', function(req, res, next) {
  res.render('search',{title: "查詢點數"});
});

router.post('/login', function(req, res, next){
  if(req.body.id == "nccucs" && req.body.pwd == "nccucs"){
    req.session.user_id = "nccucs";
    res.send(true);
  }
  else{
    res.sender(false);
  }
})

//取得餘額
router.get('/balance', function(req, res, next){
  let contract = new web3.eth.Contract(contracts.ERC223Token.abi);
  contract.options.address = req.query.token;
  contract.methods.balanceOf(req.query.account).call().then(function(result){
    console.log(result);
    res.send(result);
  });
})

//取得名稱
router.get('/name', function(req, res, next){
  let contract = new web3.eth.Contract(contracts.ERC223Token.abi);
  contract.options.address = req.query.token;
  contract.methods.name().call().then(function(result){
    console.log(result);
    res.send(result);
  });
})

//取得json檔案
router.get('/jsonfile', function(req, res, next){
  res.send(contracts);
})

//取得nonce
router.get('/nonce', function(req, res, next){
  web3.eth.getTransactionCount(req.query.account).then(function(result){
    console.log(result)
    res.send(result.toString());
  });
})

//發送交易
router.post('/transaction', function(req, res, next){
  web3.eth.sendSignedTransaction(req.body.tx)
  .on('receipt', function(result){
    console.log(result)
    res.send(result);
  })
  .on('error', function(err){
    console.log(err);
    res.send(err)
  })
})
module.exports = router;
