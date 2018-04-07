var express = require('express');
var router = express.Router();

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const fs = require('fs');
const contracts = JSON.parse(fs.readFileSync('./contract/contracts.json'));

const mysql = require('../lib/mysql.js');
/* GET home page. */
router.get('/', function (req, res, next) {
  mysql.getPointIsValid(function (points) {
    res.render('issue', { title: "發行點數", points: points });
  })
});
router.get('/transfer', function (req, res, next) {
  res.render('transfer', { title: "發送點數" });
});
router.get('/search', function (req, res, next) {
  res.render('search', { title: "查詢點數" });
});

router.get('/logs', function (req, res, next) {
  mysql.getTransaction(function (logs) {
    res.render('logs', { title: "交易明細", logs: logs })
  })
})
router.get('/logs/from/:address', function (req, res, next) {
  mysql.getTransactionByFrom(req.params.address, function (logs) {
    res.render('logs', { title: "交易明細", logs: logs, search: req.params.address })
  })
})
router.get('/logs/point/:address', function (req, res, next) {
  mysql.getTransactionByPoint(req.params.address, function (logs) {
    res.render('logs', { title: "交易明細", logs: logs, search: req.params.address })
  })
})
router.get('/transaction/:hash', function (req, res, next) {
  web3.eth.getTransaction(req.params.hash).then(function (transaction) {
    res.render('transaction', { title: "交易內容", transaction: transaction })
  })
})
router.get('/transaction/receipt/:hash', function (req, res, next) {
  web3.eth.getTransactionReceipt(req.params.hash).then(function (receipt) {
    res.render('receipt', { title: "交易內容", receipt: receipt, logs: receipt.logs })
  })
})
router.get('/order', function (req, res, next) {
  mysql.getOrderIsNotFinish(function (orders) {
    res.render('order', { title: "交易平台", orders: orders })
  })
})

//取得餘額
router.get('/balance', function (req, res, next) {
  let contract = new web3.eth.Contract(contracts.ERC223Token.abi);
  contract.options.address = req.query.token;
  contract.methods.balanceOf(req.query.account).call().then(function (result) {
    console.log(result);
    res.send(result);
  });
})

//取得名稱
router.get('/name', function (req, res, next) {
  let contract = new web3.eth.Contract(contracts.ERC223Token.abi);
  contract.options.address = req.query.token;
  contract.methods.name().call().then(function (result) {
    console.log(result);
    res.send(result);
  });
})

//取得json檔案
router.get('/jsonfile', function (req, res, next) {
  res.send(contracts);
})

//取得nonce
router.get('/nonce', function (req, res, next) {
  web3.eth.getTransactionCount(req.query.account).then(function (result) {
    res.send(result.toString());
  });
})
//發行點數
router.post('/transaction/issue', function (req, res, next) {
  web3.eth.sendSignedTransaction(req.body.tx)
    .on('receipt', function (result) {
      web3.eth.getTransaction(result.transactionHash).then(function (point) {
        let deadline = new Date(parseInt(req.body.deadline, 10)).toISOString().slice(0, 19).replace('T', ' ')
        mysql.addPoint(result.contractAddress, req.body.name, point.from, deadline)
        res.send(result);
      });
    })
    .on('error', function (err) {
      console.log(err);
      res.send(err)
    })
})
//transfer
router.post('/transaction/transfer', function (req, res, next) {
  web3.eth.sendSignedTransaction(req.body.tx)
    .on('receipt', function (result) {
      web3.eth.getTransaction(result.transactionHash).then(function (tx) {
        mysql.addTransaction(tx.hash, tx.from, tx.to);
        res.send(result);
      });
    })
    .on('error', function (err) {
      console.log(err);
      res.send(err)
    })
})
//掛單
router.post('/transaction/order', function (req, res, next) {
  web3.eth.sendSignedTransaction(req.body.tx)
    .on('receipt', function (result) {
      for (let i in result.logs) {
        if (result.logs[i].topics[0] == '0x0453a1fb3a773dbebdf89a3b20c719c82a91ac83a7a7db37386cb4572307f409') {
          web3.eth.getTransaction(result.transactionHash).then(function (order) {
            //result.logs[i].address 是 order address
            mysql.addOrder(result.logs[i].address, order.from);
            res.send(result.logs[i].address);
          })
        }
      }
    })
    .on('error', function (err) {
      console.log(err);
      res.send(err)
    })
})
//交換
router.post('/transaction/exchange/:address', function (req, res, next) {
  web3.eth.sendSignedTransaction(req.body.tx)
    .on('receipt', function (result) {
      web3.eth.getTransaction(result.transactionHash).then(function (tx) {
        mysql.finishOrder(req.params.address);
        res.send(result);
      });
    })
    .on('error', function (err) {
      console.log(err);
      res.send(err)
    })
})
module.exports = router;
