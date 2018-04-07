$(document).ready(function () {
    let keyfile;
    $('#keyfile').change(function (event) {
        var filelist = event.target.files;
        var file = filelist[0]
        var reader = new FileReader();
        reader.onload = function (event) {
            keyfile = JSON.parse(event.target.result);
        }
        reader.readAsText(file)
    })
    $('#issue').click(function () {
        let token1 = $('#token1').val();
        let token2 = $('#token2').val();
        let value1 = $('#value1').val();
        let value2 = $('#value2').val();
        let deadline = new Date($('#deadline').val()).valueOf();
        let privateKey = web3.eth.accounts.decrypt(keyfile, $("#pwd").val()).privateKey;
        //取的nonce
        $.get('/nonce', {
            account: web3.eth.accounts.privateKeyToAccount(privateKey).address
        }, function (nonce) {
            //sign function return promise
            addExchange(token1, token2, value1, value2, deadline, privateKey, nonce).then(function (tx) {
                //send raw transaction
                $.post('/transaction/order', {
                    tx: tx.rawTransaction
                }, function (result) {
                    location.reload();
                })
            });
        })
    })
});
