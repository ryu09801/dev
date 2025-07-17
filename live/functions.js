// スケジュールカウンター
// マイナス → スケジュール開始前
var gScheduleCounter = 0;

// 動画長さカウンター（秒）
var gMovieLengthSeconds = 0;

// リンクボタン表示ディレイ（分）
var gDelayLinkButtonDisplay = 0;

// コメントデータ
var gComments = [];

// スケジュールステータス
const ScheduleStatus = 
{
    None: 'None',
    BeforeSchedule: 'Before',
    OnSchedule: 'On',
    OverSchedule: 'Over',
}
var gScheduleStatus = ScheduleStatus.None;

// Vimeo情報
var gVimeoInfo = 
{
    Url: '',
    Id: '',
}

// マイコメント
var gMyComments = [];

// タイマーハンドラ
function OnTimerCallBack()
{
    // メインページ状態更新
    OnUpdateSiteStatus();

    setTimeout(OnTimerCallBack, 1000);
    gScheduleCounter++;
}

// 初期化
function OnInitialize()
{
    var d = new $.Deferred();
    
    // サーバのスケジュール設定データを取得
    $.ajax({
        url: "init.php",
        type: "POST",
        dataType: "json",
        data:{
            type : "key_info"
        }
    }).done(function( init ) {
        gScheduleCounter = init.differ_time;
        gMovieLengthSeconds = init.vimeo_length_seconds;
        gDelayLinkButtonDisplay = init.link_delay_min;

        $('#link-button').attr('href', init.link_url);

        // Vimeo用パラメータの保存
        gVimeoInfo.Id = init.vimeo_id;
        d.resolve();
    });

    d.promise()
    .then(function(){
        var d2 = new $.Deferred();

        // サーバのコメントデータを取得
        // TODO:全角文字の読込不具合→半角置換用文字を強制的に付与して回避
        $.ajax({
            url: "comments.php",
            type: "POST",
            dataType: "json",
            data:{
                type : "key_info"
            }
        }).done(function( comments ) {
            gComments = comments;
            d2.resolve();
        })

        // クライアントのコメントデータを取得
        var storage = sessionStorage;
        gMyComments = JSON.parse(storage.getItem('myC'));

        return d2.promise();
    })
    .then(function(){

        // マイコメントがある場合はサーバコメントとマージ
        if( gMyComments != null )
            gComments = gComments.concat(gMyComments);

        // タイムラインでソートする
        gComments.sort((src,dst) => src.time - dst.time);

       // コメントデータ初期化
        OnCommentInitialize();
    })
    .then(function(){
        // タイマー起動
        OnTimerCallBack();

        // カメラ初期化
        video_camera();
    });
}

// メインページ状態更新
function OnUpdateSiteStatus()
{
//    console.log(`---- Schedule:${gScheduleStatus}:${gScheduleCounter}:${gMovieLengthSeconds}`);

    if( 0 > gScheduleCounter )
    {
        if( date_check() == false )
        {
            // スケジュール開始前
            gScheduleStatus = ScheduleStatus.BeforeSchedule;
            $("#moviecount").show();
            $("#moviestart").hide();
            $("#movieend").hide();

            // カウントダウン表示
            DisplayCountDownCaptionForBeforeSchedule();

            // マイコメントがある場合は削除（通常の運用では不要）
            if( gMyComments != null )
            {
                var storage = sessionStorage;
                storage.removeItem('myC');
                storage.clear();
            }

            cookie_save();
        }
        else
        {
            // 視聴済み
            // 動画終了
            gScheduleStatus = ScheduleStatus.OverSchedule;
            $("#moviecount").hide();
            $("#moviestart").hide();
            $("#movieend").show();
        }
    }
    else
    {
        if( gMovieLengthSeconds <= gScheduleCounter )
        {
            // 動画終了
            gScheduleStatus = ScheduleStatus.OverSchedule;
            $("#moviecount").hide();
            $("#moviestart").hide();
            $("#movieend").show();
        }
        else
        {
            // オン・スケジュール
            gScheduleStatus = ScheduleStatus.OnSchedule;
            $("#moviecount").hide();
            $("#moviestart").show();
            $("#movieend").hide();

            // リンク用ボタンキャプション(0→無効)
            if( gDelayLinkButtonDisplay != 0 )
            {
                if( (gDelayLinkButtonDisplay * 60 ) <= gScheduleCounter )
                    $("#appli").show();
            }

            // コメント更新
            OnCommentAddOnSchedule();

            // Vimeo用URLの作成
            // リロード時点でのタイムポジションにシークされている
            ConstructionVimeoQueryString(gVimeoInfo.Id, gVimeoInfo.Title, gScheduleCounter);
        }
    }
}

// コメントデータ初期化
// サーバ、クライアント両方のコメントデータ
function OnCommentInitialize()
{
    $.each(gComments,
        function(index, val) {
            if (val.time < gScheduleCounter)
            {
                // コメントタグ生成
                OnCommentElementCreate(val.author, val.comment);
            }
        }
    );
}

// 指定時刻にコメントデータを追記
// サーバ側のみのコメントデータ
function OnCommentAddOnSchedule()
{
    $.each(gComments,
        function(index, val) {
            if (val.time == Math.floor(gScheduleCounter))
            {
                // コメントタグ生成
                OnCommentElementCreate(val.author, val.comment);
            }
        }
    );
}

// 自身のコメントを投稿
function OnMyCommentPost()
{
    if( gScheduleStatus == ScheduleStatus.BeforeSchedule)
        alert("放送開始までお待ちください");
    else if( gScheduleStatus == ScheduleStatus.OverSchedule )
        alert("放送は終了しました");
    else
    {
        // コメント投稿
        var author = $("#author").val();
        var body = $("#body").val();

        if (author && body) {

            // 保存用オブジェクトを作成
            var myComment = 
            {
                author : author,
                comment : body,
                time : gScheduleCounter,
            }

            if( gMyComments == null )
                gMyComments = [];

            gMyComments.push(myComment);
    
            // ストレージに保存
            var storage = sessionStorage;
            storage.setItem('myC', JSON.stringify(gMyComments));

            OnCommentElementCreate(author, body);

            // 投稿内容のみクリア
            $("#body").val('');
        }
    }
}

// コメントタグ生成
function OnCommentElementCreate(author, body)
{
    var comment = $('<div class="comment">');
    comment.append('<span class="author">'+ author.replace('aaaaaaa','')+'</span>');
    comment.append('<span class="body">'+body.replace('xxxxxxxx','') +'</span>');
    $('#comments').append(comment);

    // 下端までスクロール
    var commentBox = document.getElementById('comments');
    commentBox.scrollTop = commentBox.scrollHeight;
}

// 放送前カウントダウン表示
function DisplayCountDownCaptionForBeforeSchedule()
{
    var lScheduleCounter = gScheduleCounter * -1;
	var hour = Math.floor(lScheduleCounter/60/60);
	var min = Math.floor(lScheduleCounter/60)%60;
	var sec = Math.floor(lScheduleCounter)%60;

    document.getElementById("countdown").textContent=String(hour).padStart(2,"0")+":"+String(min).padStart(2,"0")+":"+String(sec).padStart(2,"0")
}

// Vimeo用のURLを作成する
function ConstructionVimeoQueryString(vimeo_id, vimeo_title, delay_time)
{
    if( gVimeoInfo.Url != '' )
        return;

    var min = Math.floor(delay_time / 60);
    var sec = delay_time % 60;
    var queryDelayParameter = `#t=${min}m${sec}s`; 

//    offsetTime = '#t=100m30s';
//    queryDelayParameter = '#t=0m';

    if( vimeo_id.indexOf('/') != -1 )
    {
        var query = `https://player.vimeo.com/video/${vimeo_id.replace('/','?h=')}&autoplay=0&background=0&looop=0&controls=0${queryDelayParameter}`;
    }
    else
    {
        var query = `https://player.vimeo.com/video/${vimeo_id}?autoplay=0&background=0&looop=0&controls=0${queryDelayParameter}`;
    }

//    console.log(query);

    var iframeTag = `<iframe src="${query}" style="width:100%;height:100%;" frameborder="1" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" title="${vimeo_title}">`;
    $('.youtube-ratio').append(iframeTag);

//    $('iframe').attr('src', query);

    gVimeoInfo.Url = query;

    // Vimeo情報の取得
    var iframe = document.querySelector('iframe');
    var player = new Vimeo.Player(iframe);

    player.getDuration().then(function(duration){
        gMovieLengthSeconds = duration;
    });
}

// ビデオ再生
function OnVideoPlay()
{
    console.log("Play");

    var iframe = document.querySelector('iframe');
    var player = new Vimeo.Player(iframe);

    player.setCurrentTime(gScheduleCounter);
    player.play();

    player.on('play', function(){
        console.log('Played the video!!!');
    });

}