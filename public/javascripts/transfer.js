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
    $('#transfer').click(function () {
        let token = $('#token1').val();
        let value = $('#value').val();
        let privateKey = web3.eth.accounts.decrypt(keyfile, $("#pwd").val()).privateKey;
        let to = [];
        $(':checkbox:checked').each(function (i) {
            to[i] = '0x' + $(this).val();
        });
        $.get('/nonce', {
            account: web3.eth.accounts.privateKeyToAccount(privateKey).address
        }, function (nonce) {
            //for (a in to) {
            //transfer(to[a], value, privateKey, token, parseInt(nonce) + parseInt(a)).then(function (tx) {
            transfer($('#address').val(), value, privateKey, token, parseInt(nonce) + parseInt(a)).then(function (tx) {
                console.log(tx);
                $.post('/transaction', {
                    tx: tx.rawTransaction
                }, function (result) {
                    $('#transaciotns').prepend(syntaxHighlight(result) + '<hr>');
                });
            });
            //}
        });
    });
    $('#addPerson').click(function () {
        addOptions($('#stdnumber').val(), $('#name').val(), $('#address').val());
    })
});

/*function addOptions(stdnumber, name, address) {
    let html = '<label style="display: block;">';
    html += '<input type="checkbox" id="to" value="' + address + '"> ' + stdnumber + ' ' + name + ' ' + address + '</label>'
    $('#list').append(html);
}*/

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