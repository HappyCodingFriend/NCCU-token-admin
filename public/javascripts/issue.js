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
        let deadline = (new Date(new Date($('#deadline').val()) - 8 * 60 * 60 * 1000)).valueOf();
        let privateKey = web3.eth.accounts.decrypt(keyfile, $("#pwd").val()).privateKey;
        $.get('/nonce', {
            account: web3.eth.accounts.privateKeyToAccount(privateKey).address
        }, function (nonce) {
            issue(name, totalSupply, deadline, privateKey, nonce).then(function (tx) {
                $.post('/transaction', {
                    tx: tx.rawTransaction
                }, function (result) {
                    if (result.contractAddress) {
                        console.log(result.contractAddress);
                        $('#contracts').append(name + ' : ' + result.contractAddress + "<br>")
                    }
                    else {
                        console.log(result)
                    }
                })
            });
        })
    })

});