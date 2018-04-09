const mysql = require('mysql');
const credentials = require('./credentials');

let connection = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: credentials.mysql.database
});

function addPoint(address, unit, name, owner, deadline) {
    console.log(new Date(deadline).toISOString().slice(0, 19).replace('T', ' '))
    let cmd = "INSERT INTO point (address, unit, name, owner, deadline) VALUES ?";
    connection.query(cmd, [[[address, unit, name, owner, deadline]]], (err, result) => {
        if (err) {
            console.error(err)
        }
    })
}

function addTransaction(ID, targetID, number, point, txHash) {
    let cmd = "INSERT INTO transaction (ID, targetID, number, point, txHash) VALUES ?";
    connection.query(cmd, [[[ID, targetID, number, point, txHash]]], (err, result) => {
        if (err) {
            console.error(err)
        }
    })
}

function addOrder(address, owner) {
    let cmd = "INSERT INTO  nccu_token.order (address, owner, point1, value1, point2, value2) VALUES ?";
    connection.query(cmd, [[[address, owner, point1, value1, point2, value2]]], (err, result) => {
        if (err) {
            console.error(err)
        }
    })
}

function getPointIsValid(cb) {
    let cmd = "SELECT * FROM point WHERE valid = '1'";
    connection.query(cmd, (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}
function getTransaction(cb) {
    let cmd = "SELECT * FROM transaction";
    connection.query(cmd, (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}
function getTransactionByFrom(from, cb) {
    let cmd = "SELECT * FROM transaction WHERE from_addr = ?";
    connection.query(cmd, [from], (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}
function getTransactionByPoint(point, cb) {
    let cmd = "SELECT * FROM transaction WHERE point = ?";
    connection.query(cmd, [point], (err, result) => {
        if (err)
            console.log(err)
        else {
            cb(result);
        }
    })
}

function getOrderIsNotFinish(cb) {
    let cmd = "SELECT * FROM nccu_token.order WHERE buyer IS NULL";
    connection.query(cmd, (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}

function finishOrder(address, cb) {
    let cmd = "UPDATE nccu_token.order SET buyer ='1' WHERE address = ?";
    connection.query(cmd, [[[address]]], (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}


module.exports = {
    addPoint: addPoint,
    addTransaction: addTransaction,
    addOrder: addOrder,

    getPointIsValid: getPointIsValid,
    getTransaction: getTransaction,
    getTransactionByFrom: getTransactionByFrom,
    getTransactionByPoint: getTransactionByPoint,
    getOrderIsNotFinish: getOrderIsNotFinish,

    finishOrder: finishOrder


}