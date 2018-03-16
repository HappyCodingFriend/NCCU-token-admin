$(document).ready(function(){
    
    $('#balance').click(function(){
        let token = $('#token2').val();
        let account = $('#account').val();
        $.get('/balance',{
            token: token,
            account: account
        },function(result){
            $('#result1').text('餘額：' + result)
        })
    })
    $('#searchName').click(function(){
        let token = $('#token3').val();
        $.get('/name',{
            token: token
        },function(result){
            $('#result2').text('名稱：' + result)
        })
    })

});