
////////////////////////
    // query パラメータ
    var query = decodeURI(location.search.replace("?m=",""));
    
    $('#query').val(query);

////////////////////////
    // ユニークID発行
    // → NAME = sendid にIDを設定
    $(document).ready(function() {
        $('input[name="sendid"]').val(guid());
    });

    const guid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
////////////////////////
    // お知らせ枠引用
$(function() {

$('div[id^=site]').each(function(idx,val) {

    var site = $.ajax({
        url: $(val).attr('src'),
        cache: false,
        async: false
        }).responseText;

    $(this).html(site);
});

});

////////////////////////
    // 継続ラジオボタン変更
$('input[name="free1"]').on('change', function() {
    switch($('input[name="free1"]:checked').val())
    {
        case '新サービス':
            $('.view').hide();
            $('.view2').hide();
            break;

        case 'ハイブリッド':
            $('.view').show();
            $('.view2').show();
            break;

        case '解約':
            $('.view').show();
            $('.view2').hide();
            break;
    }
});
