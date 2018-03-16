$(document).ready(function(){
    let keyfile;
    $('#keyfile').change(function(event){
        var filelist = event.target.files;
        var file = filelist[0]
        var reader = new FileReader();
        reader.onload = function(event){
            keyfile = JSON.parse(event.target.result);
            console.log(keyfile);
        }
        reader.readAsText(file)
    })
    $('#transfer').click(function(){
        let token = $('#token1').val();
        let to = $('#to').val();
        let value = $('#value').val();
        let privateKey = web3.eth.accounts.decrypt(keyfile,$("#pwd").val()).privateKey;
        let nonce = 0;
        let signedTransaction = transfer(to, value, privateKey, token, nonce);
        $.post('/transaction',{
            tx: signedTransaction
        },function(result){
            alert("交易紀錄 : " + result);
        })
    })

});