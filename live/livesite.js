function run(){
	status_run();

	objDifferTime++;

    setTimeout(run,1000);
}
function get_status(){
	if (objPlayTime == 0) {
        console.log("status:loading");
		return "loading";
	} else if (date_check()) {
        console.log("status:date_check");
		return "date_check";
	} else if (objDifferTime < 0) {
        console.log("status:moviecount");
		return "moviecount";
    } else if (objDifferTime - objPlayTime <= 0) {
        console.log("status:moviestart");
		return "moviestart";
    } else {
        console.log("status:movieend");
		return "movieend";
    }
}
function status_init(){
	var status = get_status();
	switch (status) {
	  case 'loading':
	        $("#moviecount").hide();
	        $("#moviestart").hide();
	        $("#movieend").hide();
		    break;
	  case 'date_check':
	        $("#moviecount").hide();
	        $("#moviestart").hide();
	        $("#movieend").show();
		    break;
	  case 'moviecount':
	        $("#moviecount").show();
	        $("#moviestart").hide();
	        $("#movieend").hide();
	        cookie_save();
		    break;
	  case 'moviestart':
	        $("#moviecount").hide();
	        $("#moviestart").show();
	        $("#movieend").hide();
	        continu_play();
	        cookie_save();
		    break;
	  case 'movieend':
	        $("#moviecount").hide();
	        $("#moviestart").hide();
	        $("#movieend").show();
		    break;
	}
}
function status_run(){
	if (date_check() == false) {
		if (objDifferTime == 0) {
	        $("#moviecount").hide();
	        $("#moviestart").show();
	        $("#movieend").hide();
	        continu_play();
		} else if (objDifferTime < 0) {
			countdown();
	    } else if (objDifferTime - objPlayTime < 0) {
	        comment_load();
	    }
	}
}
function comment_post() {
	var status = get_status();
	switch (status) {
	  case 'date_check':
		    alert('放送は終了しました');
		    break;
	  case 'moviecount':
		    alert('放送開始までお待ち下さい');
		    break;
	  case 'moviestart':
		    var author = $("#author").val();
		    var body = $("#body").val();
		    if (author && body) {
		        comment_add(author, body);
		        $("#author").val('');
		        $("#body").val('');
		    }
		    break;
	  case 'movieend':
		    alert('放送は終了しました');
		    break;
	}
}
function init_set(){
    var deferred = ajax_init();
    deferred.done(function(){
    	movie_play_set();
    });

    var deferred = ajax_comments();
    deferred.done(function(){
        comment_init();
    });

    $('#play').click(function() {
    	continu_play();
    });

    run();
}
function ajax_init(){
    var deferred = new $.Deferred();

    $.ajax({
        url: "init.php",
        type: "POST",
        dataType: "json",
        data:{
            type : "key_info"
        }
    }).done(function( init ) {
        objStartHour = init.start_hour;
        objStartMin = init.start_min;
        objDifferTime = Math.floor(init.differ_time);
        //objPlayTime = Math.floor(init.play_time);
        $("#youtube_id").val(init.youtube_id);
    }).always(function(){
        deferred.resolve();
    });

    return deferred;
}
function ajax_comments(){
    var deferred = new $.Deferred();

    $.ajax({
        url: "comments.php",
        type: "POST",
        dataType: "json",
        data:{
            type : "key_info"
        }
    }).done(function( comments ) {
        objComment = comments;
    }).always(function(){
        deferred.resolve();
    });

    return deferred;
}
function comment_init() {
    $.each(objComment,
        function(index, val) {
            if (val.time < Math.floor(objDifferTime)) {
                comment_add(val.author, val.comment);
            }
        }
    );
}
function comment_load() {
    $.each(objComment,
        function(index, val) {
            if (val.time == Math.floor(objDifferTime)) {
                comment_add(val.author, val.comment);
            }
        }
    );
}
function comment_add(author, body) {
    var comment = $('<div class="comment">');
    comment.append('<span class="author">'+author+'</span>');
    comment.append('<span class="body">'+body+'</span>');
    $('#comments').append(comment);
}
function movie_play_set(){
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = function() {
    	ytPlayer = new YT.Player('movie', {
            width: 800,
            height: 450,
            videoId: $("#youtube_id").val(),
            playerVars: {
                modestbranding: 1,
                autohide: 1,
                showinfo: 0,
                rel: 0,
                controls: 0,
                fs: 0,
                frameborder: 0
            },
            events: {
                onReady: function(event) {
                	objPlayTime = event.target.getDuration();
                    console.log("play time : " + objPlayTime);
                	status_init();
                },
                onStateChange: function(event) {
                    switch (event.data) {
                        case YT.PlayerState.ENDED:
                        	event.target.destroy();
                            $("#moviecount").hide();
                            $("#moviestart").hide();
                            $("#movieend").show();
                                break;
                        case YT.PlayerState.PLAYING:
                                break;
                        case YT.PlayerState.PAUSED:
                        	event.target.playVideo();
                                break;
                    }
                }
            }
        });
    }
}
function movie_play_middle(){
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = function() {
    	ytPlayer = new YT.Player('movie', {
            width: 800,
            height: 450,
            videoId: $("#youtube_id").val(),
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                autohide: 1,
                showinfo: 0,
                rel: 0,
                controls: 0,
                fs: 0,
                start: objDifferTime,
                frameborder: 0
            },
            events: {
                onReady: function(event) {
                	objPlayTime = event.target.getDuration();
                    console.log("play time : " + objPlayTime);
                	event.target.playVideo();
                },
                onStateChange: function(event) {
                    switch (event.data) {
                        case YT.PlayerState.ENDED:
                        	event.target.destroy();
                            $("#moviecount").hide();
                            $("#moviestart").hide();
                            $("#movieend").show();
                                break;
                        case YT.PlayerState.PLAYING:
                                break;
                        case YT.PlayerState.PAUSED:
                        	event.target.playVideo();
                                break;
                    }
                }
            }
        });
    }
}
function continu_play(){
	if (ytPlayer) {
	    ytPlayer.seekTo(objDifferTime);
	    ytPlayer.playVideo();
        console.log("video:continu_play");
	}
}
function countdown(){
	var diffe=-objDifferTime;

	var hour=Math.floor(diffe/60/60);
	var min=Math.floor(diffe/60)%60;
	var sec=Math.floor(diffe)%60;

    document.getElementById("countdown").textContent=String(hour).padStart(2,"0")+":"+String(min).padStart(2,"0")+":"+String(sec).padStart(2,"0")
}
function cookie_save(){
    var cookie_data = cookie_load();
    if (!cookie_data) {
        var now = new Date()
        var date = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
        $.cookie('date', date, {expires:365});
    }
}
function cookie_load(){
	var date = $.cookie('date');
	return date;
}
function date_check(){
    var cookie_data = cookie_load();
    if (cookie_data) {
        var cookie_date = new Date(cookie_data);
        var now_date = new Date();

        var year1 = cookie_date.getFullYear();
        var month1 = cookie_date.getMonth() + 1;
        var day1 = cookie_date.getDate();

        var year2 = now_date.getFullYear();
        var month2= now_date.getMonth() + 1;
        var day2 = now_date.getDate();

        if (year1 == year2) {
            if (month1 == month2) {
                return day1 < day2;
            }
            else {
                return month1 < month2;
            }
        } else {
            return year1 < year2;
        }
    }
    return false;
}
function video_camera(){
    const video  = document.querySelector("#camera");

    const constraints = {
      audio: false,
      video: {
        width: 300,
        height: 200,
        facingMode: "user"
      }
    };
    try {
        navigator.mediaDevices.getUserMedia(constraints)
        .then( (stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = (e) => {
            video.play();
          };
        });
    } catch(err) {
        console.log(err.name + ": " + err.message);
    }
}