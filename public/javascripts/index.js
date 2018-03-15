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
    $('#issue').click(function(){
        let name = $('#name').val();
        let totalSupply = $('#totalSupply').val();
        let deadline = (new Date(new Date($('#deadline').val()) - 8*60*60*1000)).valueOf();
        let privateKey = web3.eth.accounts.decrypt(keyfile,$("#pwd").val());
        let nonce = 0;
        let signedTransaction = issue(name, totalSupply, deadline, privateKey, nonce);
        $.post('/transaction',{
            tx: signedTransaction
        },function(result){
            $('#contracts').append('合約：' + result + "\n")
        })
    })

});