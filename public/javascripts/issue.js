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
        let name = $('#name').val();
        let totalSupply = $('#totalSupply').val();
        let deadline = new Date($('#deadline').val()).valueOf();
        let privateKey = web3.eth.accounts.decrypt(keyfile, $("#pwd").val()).privateKey;
        //取的nonce
        $.get('/nonce', {
            account: web3.eth.accounts.privateKeyToAccount(privateKey).address
        }, function (nonce) {
            //sign function return promise
            issue(name, totalSupply, deadline, privateKey, nonce).then(function (tx) {
                //send raw transaction
                $.post('/transaction/issue', {
                    name: name,
                    deadline: deadline,
                    tx: tx.rawTransaction
                }, function (result) {
                    if (result.contractAddress) {
                        location.reload();
                    }
                    else {
                        alert(result)
                    }
                })
            });
        })
    })
});