var express = require('express');
var router = express.Router();

const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8546');

const fs = require('fs');
const contracts = JSON.parse(fs.readFileSync('./contract/contracts.json'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('issue.html');
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
  contract.methods.balanceOf.call(req.query.account).then(function(result){
    res.send(result);
  });
})

//取得名稱
router.get('/name', function(req, res, next){
  let contract = new web3.eth.Contract(contracts.ERC223Token.abi);
  contract.options.address = req.query.token;
  contract.methods.name.call().then(function(result){
    res.send(result);
  });
})

//取得json檔案
router.get('jsonfile', function(req, res, next){
  res.send(contracts);
})

//發送交易
router.post('/transaction', function(req, res, next){
  web3.eth.sendSignedTransaction(req.body.tx)
  .on('receipt', function(result){
    console.log(result)
    res.send(result);
  })
  .on('error', function(err){
    console.log(error);
    res.send("maybe out of gas")
  })
})
module.exports = router;
