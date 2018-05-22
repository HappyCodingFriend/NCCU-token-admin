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
        $('.loader').show();
        $('.overlay').show();
        let privateKey;
        let unit = $('#unit').val();
        let name = $('#name').val();
        let totalSupply = $('#totalSupply').val();
        let deadline = (new Date(new Date($('#deadline').val()) + 8 * 60 * 60 * 1000)).valueOf();
        try {
            privateKey = web3.eth.accounts.decrypt(keyfile, $("#pwd").val()).privateKey;
            if (unit == "" || name == "" || totalSupply == "" || deadline == "") throw '表格未填完'
        }
        catch (err) {
            $('.loader').hide();
            $('.overlay').hide();
            if (err == '表格未填完') {
                alert(err);
            }
            else {
                alert("密碼錯誤");
            }
            return;
        }
        finally{
            //取的nonce
            $.get('/nonce', {
                account: web3.eth.accounts.privateKeyToAccount(privateKey).address
            }, function (nonce) {
                //sign function return promise
                issue(name, totalSupply, deadline, privateKey, nonce).then(function (tx) {
                    //send raw transaction
                    $.post('/transaction/issue', {
                        unit: unit,
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
        }
    })
});