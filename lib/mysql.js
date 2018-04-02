const mysql = require('mysql');
const credentials = require('./credentials');

let connection = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: credentials.mysql.database
});

function addPoint(address, owner) {
    let cmd = "INSERT INTO point (address, owner) VALUES ?";
    connection.query(cmd, [[[address, owner]]], (err, result) => {
        if (err) {
            console.error(err)
        }
    })
}

function addTransaction(txhash, from, to) {
    let cmd = "INSERT INTO transaction (txhash, from_addr, point) VALUES ?";
    connection.query(cmd, [[[txhash, from, to]]], (err, result) => {
        if (err) {
            console.error(err)
        }
    })
}

function addOrder(address, owner) {
    let cmd = "INSERT INTO orders (address, owner) VALUES ?";
    connection.query(cmd, [[[address, owner]]], (err, result) => {
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
    let cmd = "SELECT * FROM orders WHERE finish = '0'";
    connection.query(cmd, (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}

function finishOrder(address, cb) {
    let cmd = "UPDATE orders SET finish ='1' WHERE address = ?";
    connection.query(cmd, [[[address]]], (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}

function addAuth(id, address) {
    let cmd = "INSERT INTO auth (id, address) VALUES ?"
    connection.query(cmd, [[[id, address]]], (err, result) => {
        if (err)
            console.error(err)
    })
}

function getAuth() {
    let cmd = "SELECT * From auth"
    connection.query(cmd, (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}

function getAuthById() {
    let cmd = "SELECT * From auth where id = ?"
    connection.query(cmd, [[[id]]], (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}

function addAdmin() {
    let cmd = "INSERT INTO admin (id, password) VALUES ?"
    connection.query(cmd, [[[id, password]]], (err, result) => {
        if (err)
            console.error(err)
    })
}

function getAdmin() {
    let cmd = "SELECT * From admin"
    connection.query(cmd, (err, result) => {
        if (err)
            console.error(err)
        else {
            cb(result);
        }
    })
}

function getAdminById(id) {
    let cmd = "SELECT * From admin WHERE id = ?"
    connection.query(cmd, [[[id]]], (err, result) => {
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
    addAuth: addAuth,
    addAdmin: addAdmin,

    getPointIsValid: getPointIsValid,
    getTransaction: getTransaction,
    getTransactionByFrom: getTransactionByFrom,
    getTransactionByPoint: getTransactionByPoint,
    getOrderIsNotFinish: getOrderIsNotFinish,
    getAuth: getAuth,
    getAuthById: getAuthById,
    getAdmin: getAdmin,
    getAdminById, getAdminById,

    finishOrder: finishOrder,


}