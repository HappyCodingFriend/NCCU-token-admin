var express = require('express');
var router = express.Router();

const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8546')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

//取得餘額
router.post('/balance', function(req, res, next){
  let contract = new web3.eth.Contract()
})

//取得餘額
router.post('/name', function(req, res, next){
  
})

router.post('/login', function(req, res, next){
  if(req.body.id == "nccucs" && req.body.pwd == "nccucs"){
    req.session.user_id = "nccucs";
    res.send(true);
  }
  else{
    res.sender(false);
  }
})

//發送交易
router.post('/transaction', function(req, res, next){
  web3.eth.sendSignedTransaction(req.body.tx)
  .on('receipt', function(result){
    console.log(result)
    res.send(result);
  })
  .on('error', , function(err){
    console.log(error);
    res.send("error")
  })
})
module.exports = router;
