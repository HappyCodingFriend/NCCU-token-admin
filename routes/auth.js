var express = require('express');
var router = express.Router();

const mysql = require('../lib/mysql.js');

router.route('/')
  .get(function (req, res, next) {
    if (req.query.id) {
      mysql.getAuthById(req.query.id, function (result) {
        res.send(result);
      })
    }
    else {
      mysql.getAuth(function (result) {
        res.send(result);
      })
    }
  })

  .post(function (req, res, next) {
    mysql.addAuth(req.body.id, req.body.address);
    res.send('success');
  })

  .delete(function (req, res, next) {
    //
  })

module.exports = router;
