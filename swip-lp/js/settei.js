
////////////////////////
    // query パラメータ
    var query = decodeURI(location.search.replace("?ml=",""));
    
    $('#query').val(query);
    
////////////////////////
    // ↓↓↓　リアルタイム日時設定 (javascript版)
    const clock = () => {

        // 現在 → free4
        get_clock(0, $('input[name="free4"]'));

        // 7日後 → free5
        get_clock(7, $('input[name="free5"]'));

        // 9日後 → free6
        get_clock(9, $('input[name="free6"]'));
    }
    setInterval(clock, 1000);

    function get_clock(days, element){
        var date = new Date();
        date.setDate(date.getDate()+days);
        element.val( `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日` );
    }

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
