$(document).ready(function(){
    
    $('#balance').click(function(){
        let token = $('#token2').val();
        let account = $('#account').val();
        $.post('/balance',{
            token: token,
            account: account
        },function(result){
            $('#result1').text('餘額：' + result)
        })
    })
    $('#searchName').click(function(){
        let token = $('#token3').val();
        $.post('/name',{
            token: token
        },function(result){
            $('#result2').text('名稱：' + result)
        })
    })

});