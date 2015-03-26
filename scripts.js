(function($){

    $(document).ready(function(){

        $("#jplayer_viewport").jPlayer({
            ready: function (event) {
                var self = this;
                var $this = $(this);
                $this.jPlayer("setMedia", {
                    title: "Гацуурхан",
                    mp3: "media/gatsuurhan.mp3",
                    poster: "jplayer/viewport.jpg"
                });
                $this.append($('<div id="karaoke_lyrics" data-index="-1"><span class="word">jPlayer, HTML, CSS3 Karaoke</span></div>'));

                $.post( $this.jPlayer("option", "lyrics"), {}, function(data){
                    window.karaoke_stimes = [];
                    window.karaoke_etimes = [];
                    window.karaoke_current_index = -1;
                    window.karaoke = $(data);

                    $(data).find('karaoke > add').each(function(index){
                        var st = $(this).attr('startTime');
                        var et = $(this).attr('endTime');

                        var sts = st.split(':');
                        st = parseFloat(sts[0], 10)*60*60 + parseFloat(sts[1], 10)*60 + parseFloat(sts[2]);
                        $(this).attr('startTime' , st);
                        window.karaoke_stimes.push(st);

                        var ets = et.split(':');
                        et = parseFloat(ets[0], 10)*60*60 + parseFloat(ets[1], 10)*60 + parseFloat(ets[2]);
                        $(this).attr('endTime' , et);
                        window.karaoke_etimes.push(et);
                    });

                    $this.jPlayer("play");

                    setTimeout(function(){
                        $('#karaoke_lyrics').html($(data).find('details singer').text() + ' - ' + $(data).find('details name').text());
                    }, 3000);
                });
            },
            lyrics: "media/gatsuurhan.xml",
            swfPath: "jplayer/",
            supplied: "mp3",
            size: {
                width: "570px",
                height: "340px",
                cssClass: "jp-video-360p"
            },
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
            timeupdate: function(event){
                var $karaoke = window.karaoke;
                var currentTime = event.jPlayer.status.currentTime;
                if( $karaoke!==null && window.karaoke_stimes ){
                    var md = parseInt(window.karaoke_stimes.length/2);
                    var si = 0;
                    if( currentTime>window.karaoke_stimes[md] ){
                        si = md;
                        md = window.karaoke_stimes.length;
                    }
                    else{
                        si = 0;
                        md = md+1;
                    }

                    for( var i=si; i<md; i++ ){
                        if( currentTime>=window.karaoke_stimes[i] && currentTime<=window.karaoke_etimes[i] && i>window.karaoke_current_index ){
                            $('#karaoke_lyrics').html("");
                            var sumDuration = 0;
                            $karaoke.find('karaoke > add').eq(i).find('entry').each(function(){
                                var $layer = $('<span></span>').text( $(this).text() );
                                var $text = $('<span class="word"></span>').text( $(this).text() ).append($layer);
                                var duration = parseInt($(this).attr('duration'))/1000;
                                $text.css({
                                    '-webkit-animation-duration': duration+"s",
                                    '-moz-animation-duration': duration+"s",
                                    '-ms-animation-duration': duration+"s",
                                    '-o-animation-duration': duration+"s",
                                    'animation-duration': duration+"s"
                                });
                                setTimeout(function(){$text.addClass('animate');}, sumDuration);
                                sumDuration += duration*1000;
                                $('#karaoke_lyrics').append($text);
                            });
                            window.karaoke_current_index = i;
                        }
                    }

                }
            }
        });

    });

})(jQuery);