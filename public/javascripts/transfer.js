$(document).ready(function () {
    let keyfile;
    $('#keyfile').change(function (event) {
        var filelist = event.target.files;
        var file = filelist[0]
        var reader = new FileReader();
        reader.onload = function (event) {
            keyfile = JSON.parse(event.target.result);
            console.log(keyfile);
        }
        reader.readAsText(file)
    })
    $('#checkUsers').click(function () {
        users();
    })
    $('#transfer').click(function () {
        $('.loader').show();
        $('.overlay').show();
        let privateKey;
        let token = $('#token1').val();
        let value = $('#value').val();
        let to = $('#address').val().split(",");
        try {
            privateKey = web3.eth.accounts.decrypt(keyfile, $("#pwd").val()).privateKey;
            if (token == "" || value == "") throw '表格未填完'
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
        finally {
            $.get('/nonce', {
                account: web3.eth.accounts.privateKeyToAccount(privateKey).address
            }, async function (nonce) {
                for (a in to) {
                    if (to[a] != "") {
                        transfer(to[a], value, privateKey, token, parseInt(nonce) + parseInt(a)).then(function (tx) {
                            //transfer($('#address').val(), value, privateKey, token, parseInt(nonce)).then(function (tx) {
                            $.post('/transaction/transfer', {
                                tx: tx.rawTransaction,
                                number: value
                            }, function (result) {
                                $('#transaciotns').append(syntaxHighlight(result) + '<hr>');
                            });
                        });
                    }
                };
                $('#inpwd').modal('hide');
                $('.loader').hide();
                $('.overlay').hide();
            });
        }
    });
});

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
function users() {
    let users = "";
    $('input[type=checkbox]').each(function () {
        if (this.checked) {
            users += $(this).val() + ",";
        }
    })
    $('#address').val(users);
}