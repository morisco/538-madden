(function ($) {
  var MADDEN = MADDEN || {

    playAudio: true,

    currentID: 1,

    tweetTimeout: false,

    tweetOutro: false,

    currentTime: 0,

    currentVideo: false,

    showTimeout: false,

    hideTimeout: false,

    muted: false,

    introVideo: document.getElementById('intro-video'),

    videoPlaying:false,

    initApp: function(){
      $('#madden').animate({'opacity':1});
      MADDEN.setScrollWatchers();
      MADDEN.checkPosition();
      MADDEN.initEvents();
      MADDEN.initOpener();
      MADDEN.initHeader();
    },

    initEvents:function(){
      $('.start-gamebreakers').on('click',MADDEN.nextBreaker);
      $('header a').on('click',function(event){
        event.stopPropagation();
      });
      $('#video-overlay').on('click',function(){
        if(navigator.userAgent.match(/iPad/i) != null){
          var hickVid = document.getElementById('hickey-video');
          if(hickVid.paused){
            hickVid.play();
          } else{
            hickVid.pause();
          }
        }
      });
      $(window).on('scroll',MADDEN.trackHeader);
      $('.mute-video').on('click',MADDEN.muteVideo);
      $('.gamebreaker-video').each(function(){
        $(this)[0].volume = 0;
      });

      $('header nav a').on('click',function(){
        $('header nav a').removeClass('active');
        $(this).addClass('active');
      });
    },

    initHeader: function(){
      if(window.location.hash == '#part2'){
        $('header').addClass('triggered');
        $('nav').addClass('part-2');
        MADDEN.triggerPart2();
        return;
      }

      if(($(window).scrollTop() + 100) >= $('#part-2-opener').offset().top || window.location.hash == '#part2'){
        $('header nav a').removeClass('active');
        $('#part-2-link').addClass('active');
      } else{
        $('header nav a').removeClass('active');
        $('#part-1-link').addClass('active');
      }
      if($(window).scrollTop() > 100 && window.location.hash != 'part2'){
        $('header').removeClass('triggered');
      } else{
        $('header').addClass('triggered');
      }
    },

    trackHeader: function(){
      if($(window).scrollTop() < ($('#part-1-opener').height()/2)){
        $('header').addClass('triggered');
      } else if(($(window).scrollTop() > ($('#part-1-opener').height()/2) && $(window).scrollTop() < $('#part-2-opener').offset().top) || !(($(window).scrollTop() + 40) >= $('#part-2-opener').offset().top && $(window).scrollTop() < ($('#part-2-opener').offset().top + ($(window).height()/2)))){
        $('header').removeClass('triggered');
      } else{
        $('header').addClass('triggered');
      }

      if($(window).scrollTop() > $('#part-2-opener').offset().top){
        $('header nav a').removeClass('active');
        $('#part-2-link').addClass('active');
      } else{
        $('header nav a').removeClass('active');
        $('#part-1-link').addClass('active');
      }
    },

    initOpener: function(){
      // $(window).on('scroll.temporary',function(event){
      //   $('html,body').scrollTop(0);
      // });

      setTimeout(function(){
        $('#part-1-opener .panel-1').addClass('triggered');
      },500);

      setTimeout(function(){
        // $(window).off('scroll.temporary');
      }, 1500);
    },

    setScrollWatchers: function(){
      $('.trigger-watch').each(function(){
        var element = $(this);
        var callback = element.attr('data-callback');
        $(window).on('scroll',function(){
          MADDEN.watchScrollPosition(element,callback);
        });
      });
    },

    checkPosition: function(){
      $('.trigger-watch').each(function(){
        var element = $(this);
        var enterPoint = element.offset().top - $(window).height();
        if($(window).scrollTop() > enterPoint){
          MADDEN.preTrigger(element);
        }
      });
    },

    preTrigger: function(element){
      switch(element.attr('data-callback')){
        case 'adjustedStats':
          element.find('.player-stats').addClass('triggered');
          element.attr('data-trigger',true);
        break;
      }
    },

    watchScrollPosition: function(element,callback){
      var enterPoint = element.offset().top - $(window).height();
      var exitPoint = element.offset().top + element.height();
      var scrollTop = $(window).scrollTop();
      if(scrollTop > enterPoint && scrollTop < exitPoint){
        MADDEN[callback](element);
      } else if(scrollTop < enterPoint){
        MADDEN[callback](element,true);
      } else if(scrollTop > exitPoint){
        MADDEN[callback](element,false,true);
      }
    },

    getRatio: function(element){
      var scrollTop = $(window).scrollTop();
      var enterPoint = element.offset().top - $(window).height();
      var exitPoint = element.offset().top + element.height();
      var ratio = ((scrollTop-enterPoint)/(exitPoint - enterPoint))*100;
      return ratio;
    },

    part1Opener:function(element,reset,done){
      if(done){
        element.removeClass('locked').removeClass('done');
      } else if( reset && element.attr('data-trigger') ) {
        element.removeAttr('data-trigger');
      } else if(!reset) {
        element.attr('data-trigger',true);
        var ratio = MADDEN.getRatio(element);
        if(ratio < 45){
          element.find('.panel-1').addClass('triggered');
          MADDEN.introVideo.pause();
          MADDEN.introVideo.currentTime = 0;
          MADDEN.videoPlaying = false;
        } else if(ratio >= 45 && ratio < 60 && !MADDEN.videoPlaying){
          MADDEN.videoPlaying = true;
          MADDEN.watchIntro();
          element.find('.panel-1').removeClass('triggered');
          MADDEN.introVideo.play();
        } else if(ratio >=60 && ratio < 70 && !element.find('.panel-3').hasClass('triggered')){
          element.find('.panel-2 h3.hidden').removeClass('hidden');
          element.find('.panel-2 h3.visible').addClass('hidden');
        } else if(ratio >= 70 ){
          var adjustmentRatio = 1 - ((100 - ratio)/30);
          var adjustedTop = 50 + (adjustmentRatio * 35) + '%';
          if(parseInt(adjustedTop) < 51){
            adjustedTop = 50 + '%';
          }
          element.find('.panel-2 .panel-wrapper').css('top',adjustedTop);
        }
      }
      if($(window).scrollTop() >= element.offset().top && $(window).scrollTop() < (element.offset().top + element.height() - $(window).height())){
        element.removeClass('done').addClass('locked');
      } else if($(window).scrollTop() >= (element.offset().top + element.height() - $(window).height())) {
        element.removeClass('locked').addClass('done');
      } else if($(window).scrollTop() < element.offset().top){
        element.removeClass('locked').removeClass('done');
      } else{
        element.removeClass('locked').removeClass('done');
      }
    },

    watchIntro: function(){
      // MADDEN.introVideo.onended = function(){
      //   MADDEN.introVideo.currentTime = 10;
      //   MADDEN.introVideo.play();
      // }
    },

    fullQuote: function(element,reset,done){
      if( reset && element.attr('data-trigger') ) {
        element.removeAttr('data-trigger').removeClass('triggered');
      } else if(!reset && !element.attr('data-trigger')) {
        var scrollTop = $(window).scrollTop();
        var currentRatio = MADDEN.getRatio(element);
        if(currentRatio > 10){
          element.attr('data-trigger',true).addClass('triggered');
        }

      }
    },

    chalkTalk: function(element, reset){
      if( reset && element.attr('data-trigger') ) {
        element.removeAttr('data-trigger');
      } else if(!reset) {
        element.attr('data-trigger',true);
      }
    },

    expandRuler: function(element,reset){
      if(reset && element.attr('data-trigger')){
        element.removeAttr('data-trigger');
        element.removeClass('triggered');
        return;
      } else if(!reset){
        element.attr('data-trigger',true);
        var scrollTop = $(window).scrollTop();
        var enterPoint = element.offset().top - $(window).height();
        var currentRatio = MADDEN.getRatio(element);
        if(currentRatio > 10){
          element.addClass('triggered');
        }
      }
    },

    showTweet: function(element,reset,done){
      if(done){
        if(!element.hasClass('finished')){
          element.addClass('finished');
          element.find('.tweet-wrapper').animate({'top':'-500px'},250,function(){
            $(this).removeClass('fixed');
            $(this).removeAttr('style');
            element.addClass('finished');
          });
        }
        return;
      } else if(reset && element.attr('data-trigger')){
        element.removeClass('finished');
        element.removeAttr('data-trigger');
        element.removeClass('triggered');
        element.find('.tweet-intro').css('top','0');
        return;
      } else if(!reset){
        element.removeClass('finished');
        element.attr('data-trigger',true);
        var ratio = MADDEN.getRatio(element);
        var enterPoint = element.offset().top;
        var exitPoint = element.offset().top + element.height();
        var scrollTop = $(window).scrollTop()
        // if((enterPoint - scrollTop) < 65){
        //   var adjustedHeader = 0 - (enterPoint - scrollTop) + 65;
        //   if(0 - (enterPoint - scrollTop) < 65){
        //     adjusteHeader = 0 - (enterPoint - scrollTop);
        //   }
        //   element.find('.tweet-intro').css('top',adjustedHeader);
        //   element.find('.tweet-viewer').css('top',adjustedHeader + element.find('.tweet-intro').height());
        // }

        if((scrollTop + 50) >= enterPoint && scrollTop <= (enterPoint + element.height()) ){
          $('.tweet-wrapper').addClass('fixed');
        } else if(scrollTop < exitPoint){
          $('.tweet-wrapper').removeClass('fixed');
        }

        if(ratio > 0 && ratio < 30){
          window.clearTimeout(MADDEN.tweetTimeout);
          MADDEN.tweetTimeout = window.setTimeout(function(){
            element.find('.tweet.trig').removeClass('trig');
          },50);
        } else if(ratio >= 30 && ratio < 45 && !element.find('.tweet[data-index="1"]').hasClass('trig')){
          window.clearTimeout(MADDEN.tweetTimeout);
          MADDEN.tweetTimeout = window.setTimeout(function(){
            MADDEN.triggerTweet(1,element)
          },50);
        } else if(ratio >= 45 && ratio < 60 && !element.find('.tweet[data-index="2"]').hasClass('trig')){
          window.clearTimeout(MADDEN.tweetTimeout);
          MADDEN.tweetTimeout = window.setTimeout(function(){
            MADDEN.triggerTweet(2,element)
          },50);
        } else if(ratio >= 60 && ratio < 75 && !element.find('.tweet[data-index="3"]').hasClass('trig')){
          window.clearTimeout(MADDEN.tweetTimeout);
          MADDEN.tweetTimeout = window.setTimeout(function(){
            MADDEN.triggerTweet(3,element)
          },50);
        } else if(ratio >= 75 && ratio < 97 && !element.find('.tweet[data-index="4"]').hasClass('trig')){
          window.clearTimeout(MADDEN.tweetTimeout);
          MADDEN.tweetTimeout = window.setTimeout(function(){
            MADDEN.triggerTweet(4,element)
          },50);
        } else if(ratio >= 97){

        }


      }
    },

    triggerTweet: function(index,element){
      if(element.find('.tweet[data-index="'+index+'"]').hasClass('trig')){
        return;
      }
      if(element.find('.tweet.trig').length > 0){
        element.find(".tweet.trig").removeClass('trig');
        setTimeout(function(){
          element.find('.tweet[data-index="'+index+'"]').addClass('trig');
        },250);
      } else{
        element.find('.tweet[data-index="'+index+'"]').addClass('trig');
      }
    },

    adjustedStats: function(element,reset){
      if(reset && element.attr('data-trigger')){
        element.removeAttr('data-trigger');
        element.find('.adjustments').removeClass('triggered');
        element.find('.player-stats').removeClass('triggered');
        $(element.find('.adjusted-rating .player-rating')).each(function(){
          $(this).text($(this).attr('data-starting-rating'));
        });
        return;
      } else if(!reset){
        element.attr('data-trigger',true);
        var currentRatio = MADDEN.getRatio(element);
        if(currentRatio > 33 && !element.find('.player-stats.first').hasClass('triggered')){
          element.find('.player-stats.first').first().addClass('triggered');
        } else if(currentRatio > 55 && !element.find('.player-stats.first .adjustments').hasClass('triggered') && element.find('.player-stats.first').hasClass('triggered')){
          var originalStat = parseInt(element.find('.player-stats.first .original-rating .player-rating').text());
          var adjustedStat = parseInt(element.find('.player-stats.first .adjusted-rating .player-rating').attr('data-final-rating'));
          var difference = adjustedStat - originalStat;
          for(var i=originalStat; i<=adjustedStat; i++){
            MADDEN.increaseNumber(originalStat, i, element.find('.player-stats.first .adjusted-rating .player-rating'),difference);
          }
          element.find('.player-stats.first .adjustments').addClass('triggered');
        } else if(currentRatio > 70 && !element.find('.player-stats.second').hasClass('triggered')){
           element.find('.player-stats.second').addClass('triggered');
        } else if(currentRatio > 77 && !element.find('.player-stats.second .adjustments').hasClass('triggered') && element.find('.player-stats.second').hasClass('triggered')){
          var originalStat = parseInt(element.find('.player-stats.second .original-rating .player-rating').text());
          var adjustedStat = parseInt(element.find('.player-stats.second .adjusted-rating .player-rating').attr('data-final-rating'));
          var difference = adjustedStat - originalStat;
          for(var i=originalStat; i<=adjustedStat; i++){
            MADDEN.increaseNumber(originalStat, i, element.find('.player-stats.second .adjusted-rating .player-rating'),difference);
          }
          element.find('.player-stats.second .adjustments').addClass('triggered');
        }
      }
    },

    increaseNumber: function(original,index,element,difference){
      if(difference > 18){
        var delayInt = 1500/difference;
      } else{
        delayInt = 80;
      }
      var delayIndex = (0 -  (original - index)) * delayInt;
      var newNumber = index;
      setTimeout(function(){
        element.text(newNumber);
      },delayIndex);
    },

    gameBreakers: function(element,reset){

      if(reset && element.attr('data-trigger')){
        element.removeAttr('data-trigger');
        document.getElementById('breaker-video-2').pause();
        document.getElementById('breaker-video-3').pause();
        document.getElementById('breaker-video-4').pause();
        return;
      } else if(!reset){
        element.attr('data-trigger',true);
        var ratio = MADDEN.getRatio(element);
        var adjustedTop = 30 * (ratio/100);
        var newTop = (70 - adjustedTop) + '%';
        element.find(".gamebreaker-wrapper").css('top',newTop);

        var currentVid = document.getElementById('breaker-video-'+MADDEN.currentID);
        if(currentVid){
          if(currentVid.paused){
            currentVid.play();
          }
        }

        if(ratio > 95){
          if(currentVid){
            currentVid.pause();
          }
        }

        if($(window).scrollTop() >= element.offset().top && $(window).scrollTop() < (element.offset().top + element.height() - $(window).height())){
          element.removeClass('done').addClass('locked');
        } else if($(window).scrollTop() >= (element.offset().top + element.height() - $(window).height())) {
          element.removeClass('locked').addClass('done');
        } else if($(window).scrollTop() < element.offset().top){
          element.removeClass('locked').removeClass('done');
        } else{
          element.removeClass('locked').removeClass('done');
        }
      }
    },

    nextBreaker: function(event,current,next){
      if(event){
        event.preventDefault();
      }
      if($(event.target).hasClass('final')){
        $(MADDEN.currentVideo).animate({volume: 0}, 1000);
        MADDEN.resetGamebreakers();

        setTimeout(function(){
          MADDEN.currentID = 1;
          MADDEN.resetBreakers();
        },2000)

        return;
      }
      var fading = false;
      var currentIndex = current || parseInt($('.gamebreaker-panel.active').not('.previous').attr('data-panel-index'));
      MADDEN.currentID = next || currentIndex + 1;

      var elementScroll = $('#gamebreakers').offset().top;
      var scrollPosition = elementScroll + (($(window).height() * currentIndex)/3) + 40;
      $('html,body').animate({scrollTop : elementScroll});
      if(MADDEN.playAudio){
        if(MADDEN.currentVideo){
          $(MADDEN.currentVideo).animate({volume: 0}, 1000);
        }
        setTimeout(MADDEN.resetBreakers,1000);
        MADDEN.currentVideo = document.getElementById('breaker-video-'+MADDEN.currentID);
        MADDEN.currentVideo.currentTime = MADDEN.currentTime;
        MADDEN.currentVideo.play();
        if(!MADDEN.muted){
          $(MADDEN.currentVideo).animate({volume: 1});
        }

        if(navigator.userAgent.match(/iPad/i) != null){
          MADDEN.currentVideo.onended = function(e) {
            $('.gamebreaker-panel.active .start-gamebreakers').addClass('highlight');
          }
        } else {

          $(MADDEN.currentVideo).on('timeupdate',function(){
            if($('.gamebreaker-panel.active').attr('data-panel-index') == 4){
              if(this.currentTime > (this.duration - 1.5) && !fading){
                fading=true;
                $('.gamebreaker-panel.active .start-gamebreakers').click();
              }
            } else if(this.currentTime > (this.duration - 1) && !fading){
              fading=true;
              $(MADDEN.currentVideo).animate({volume:0})
              $('.gamebreaker-panel.active .start-gamebreakers').click();
            }
          });
        }


      }
      $('.gamebreaker-panel[data-panel-index="'+currentIndex+'"]').addClass('previous');
      $('.gamebreaker-panel[data-panel-index="'+MADDEN.currentID+'"]').addClass('active');
      window.clearTimeout(MADDEN.showTimeout);
      MADDEN.showTimeout = setTimeout(function(){
        $('.gamebreaker-panel[data-panel-index="'+MADDEN.currentID+'"]').addClass('show-bio');
      },150);
      window.clearTimeout(MADDEN.hideTimeout);
      MADDEN.hideTimeout = setTimeout(function(){
        $('.gamebreaker-panel[data-panel-index="'+MADDEN.currentID+'"]').addClass('hide-bio');
      },7000);

      setTimeout(function(){
        $('.gamebreaker-panel[data-panel-index="'+currentIndex+'"]').addClass('faded');
        $('.gamebreaker-panel[data-panel-index="'+currentIndex+'"]').removeClass('active');
      },1000);
    },

    muteVideo: function(event){
      event.preventDefault();
      if(MADDEN.muted){
        MADDEN.muted = false;
        $('.mute-video').removeClass('muted');
        $(MADDEN.currentVideo).stop().animate({volume: 1});
      } else{
        MADDEN.muted = true;
        $('.mute-video').addClass('muted');
        $(MADDEN.currentVideo).stop().animate({volume: 0});
      }
    },

    resetBreakers: function(){
      $('.gamebreaker-video').each(function(){
        var vidID = parseInt($(this).attr('data-video-id'));
        if(vidID != MADDEN.currentID){
          $('.highlight').removeClass('highlight');
          document.getElementById('breaker-video-'+vidID).pause();
          setTimeout(function(){
            document.getElementById('breaker-video-'+vidID).currentTime = 0;
          },1000);
        }
      });
    },

    resetGamebreakers:function(){
      var finalScroll = $('#gamebreakers').offset().top + $("#gamebreakers").height();
      if($(window).scrollTop() < finalScroll){
        $('html,body').animate({scrollTop:finalScroll},1000);
        var timeout = 1000;
      } else{
        var timeout = 0;
      }
      setTimeout(function(){
        $('.gamebreaker-panel.active').animate({'opacity':0},250,function(){

          $('.gamebreaker-panel.active').removeAttr('style');
          MADDEN.currentID = 1;

          $('#gamebreaker-intro').addClass('active');
          $('.gamebreaker-panel.active').addClass('faded');

          setTimeout(function(){
            $('.show-bio').removeClass('show-bio');
            $('.hide-bio').removeClass('hide-bio');
            $('.gamebreaker-panel.previous').removeClass('previous');
            $('.gamebreaker-panel.faded').removeClass('faded');
            $('.gamebreaker-panel').removeClass('active').removeClass('faded');
            $('#gamebreaker-intro').addClass('active');
          },1000);
        });
      }, timeout);
    },

    triggerPart2: function(){
      $('#opener-1').addClass('triggered');
      $('#part-2-opener .part-1').addClass('trig');
      $('#part-2-opener .part-2').addClass('trig');
      $('#part-2-opener .part-3').addClass('trig');
    },

    part2Opener:function(element,reset){
      if(reset && element.attr('data-trigger')){
        element.removeAttr('data-trigger');
        element.find('.player-stats').removeClass('triggered');
        return;
      } else if(!reset){
        element.attr('data-trigger',true);
        var ratio = MADDEN.getRatio(element);
        if(ratio > 0 && ratio < 30 && !element.find('#opener-1').hasClass('triggered')){
          element.find('#opener-3').removeClass('triggered');
          element.find('#opener-2').removeClass('triggered');
          element.find('#opener-1').addClass('triggered');
          element.find(".part-3").removeClass('trig');
          element.find('.part-2').removeClass('trig');
          element.find('.part-1').removeClass('trig');
        } else if(ratio > 0 && ratio < 30){
          element.find('.part-1').removeClass('trig');
          element.find('.part-2').removeClass('trig');
          element.find('.part-3').removeClass('trig');
        } else if(ratio >= 30 && ratio < 40){
          element.find('.part-1').addClass('trig');
          element.find('.part-2').addClass('trig');
          element.find('.part-3').addClass('trig');
        } else if(ratio >= 40 && ratio < 55 && !element.find('#opener-2').hasClass('triggered')){
          element.find('#opener-3').removeClass('triggered');
          element.find('#opener-1').removeClass('triggered');
          element.find('#opener-2').addClass('triggered');
          element.find('#opener-3').removeAttr('style');
        } else if(ratio >= 52 && ratio < 75 && !element.find('#opener-3').hasClass('triggered')){
          element.find('#opener-1').removeClass('triggered');
          element.find('#opener-2').removeClass('triggered');
          element.find('#opener-3').addClass('triggered');
          element.find('#opener-3').removeAttr('style');
        }
        if($(window).scrollTop() >= element.offset().top && $(window).scrollTop() < (element.offset().top + element.height() - $(window).height())){
          element.removeClass('done').addClass('locked');
        } else if($(window).scrollTop() >= (element.offset().top + element.height() - $(window).height())) {

          element.removeClass('locked').addClass('done');
          var exitPoint = (element.offset().top + element.height()) - $(window).scrollTop();
          element.find('#opener-3').css('height',exitPoint);
        } else if($(window).scrollTop() < element.offset().top){
          element.removeClass('locked').removeClass('done');
        }
      }
    },

    hickeyStats: function(element,reset){
      if(reset && element.attr('data-trigger')){
        element.removeAttr('data-trigger');
        element.removeClass('triggered');
        return;
      } else if(!reset){
        element.attr('data-trigger',true);
        var ratio = MADDEN.getRatio(element);
        if(ratio < 20 && element.hasClass('triggered')){
          element.removeClass('triggered');
        } else if(ratio > 20 && ratio < 65 && !element.hasClass('triggered')){
          element.addClass('triggered');
        } else if(ratio >= 65 && element.hasClass('triggered')){
          // element.removeClass('triggered');
        }
      }
    },

    hickeyVideo: function(element,reset){
      if(reset && element.attr('data-trigger')){
        element.removeAttr('data-trigger');
        element.removeClass('triggered');
        element.find('#video-overlay').removeClass('triggered');
        element.find('.stat').removeClass('triggered');
        var hickVid = document.getElementById('hickey-video');
        hickVid.pause();
        hickVid.currentTime = 0;
        return;
      } else if(!reset){
        element.attr('data-trigger',true);
        var ratio = MADDEN.getRatio(element);
        if(ratio > 20 && ratio < 30 && !element.hasClass('triggered')){
          var video = document.getElementById('hickey-video');
          video.play();
        } else if(ratio >= 30 && !element.find('#video-overlay').hasClass('triggered')){
          element.find('#video-overlay').addClass('triggered');
          element.find('.stat').each(function(index,stat){
            var stat = $(this);
            setTimeout(function(){
              stat.addClass('triggered');
            },index * 100);
          });
        }
      }
    },

    combineVideos: function(element,reset){
       if(reset && element.attr('data-trigger')){
        element.removeAttr('data-trigger');
        element.removeClass('triggered');
        $('.combine').removeClass('triggered');
        element.find('.increase-me').text(element.find('.increase-me').attr('data-starting-number'));
        return;
      } else if(!reset){
        element.attr('data-trigger',true);
        var ratio = MADDEN.getRatio(element);
        if(ratio > 20 && ratio < 35 && !$('#combines .combine-1').hasClass('triggered')){
          $('#combines .combine-1').addClass('triggered');
          $('.combine-1 .increase-me').each(function(){
            var original = $(this).attr('data-starting-number');
            var finalNumber = $(this).attr('data-final-number');
            var difference = finalNumber - original;
            for(var i=original; i<=finalNumber; i++){
              MADDEN.increaseNumber(original, i,$(this),difference);
            }
          });
          // $('#combines .combine-1').addClass('triggered');
          // var vid1 = document.getElementById('combine-video-1');
          // if(vid1){
          //   vid1.play();
          // }
        } else if(ratio >= 35 && ratio < 50 && !$('#combines .combine-2').hasClass('triggered')){

          $('#combines .combine-2').addClass('triggered');
          $('.combine-2 .increase-me').each(function(){
            var original = $(this).attr('data-starting-number');
            var finalNumber = $(this).attr('data-final-number');
            var difference = finalNumber - original;
            for(var i=original; i<=finalNumber; i++){
              MADDEN.increaseNumber(original, i,$(this),difference);
            }
          });

          // var vid2 = document.getElementById('combine-video-2');
          // if(vid2){
          //   vid2.play();
          // }
        } else if(ratio >= 50 && ratio < 65 && !$('#combines .combine-3').hasClass('triggered')){
           $('#combines .combine-3').addClass('triggered');
          $('.combine-3 .increase-me').each(function(){
            var original = $(this).attr('data-starting-number');
            var finalNumber = $(this).attr('data-final-number');
            var difference = finalNumber - original;
            for(var i=original; i<=finalNumber; i++){
              MADDEN.increaseNumber(original, i,$(this),difference);
            }
          });
          // $('#combines .combine-3').addClass('triggered');
          // var vid3 = document.getElementById('combine-video-3');
          // if(vid3){
          //   vid3.play();
          // }
        } else if(ratio >= 65 && ratio < 70 && !$('#combines .combine-4').hasClass('triggered')){
           $('#combines .combine-4').addClass('triggered');
          $('.combine-4 .increase-me').each(function(){
            var original = $(this).attr('data-starting-number');
            var finalNumber = $(this).attr('data-final-number');
            var difference = finalNumber - original;
            for(var i=original; i<=finalNumber; i++){
              MADDEN.increaseNumber(original, i,$(this),difference);
            }
          });
          // $('#combines .combine-4').addClass('triggered');
          // var vid4 = document.getElementById('combine-video-4');
          // if(vid4){
          //   vid4.play();
          // }
        }
      }
    }

  }

  jQuery(function() {
    setTimeout(function(){
      window.finalTweet = false;

      MADDEN.initApp();
      var pymParent = new pym.Parent('interactive', 'http://staging.projects.fivethirtyeight.com.s3-website-us-east-1.amazonaws.com/madden-scores/', {});

    },1000);


    // $('video').each(function() {

    //           $($(this)[0]).attr('src', false);
    //           $(this)[0].pause();
    //           $(this)[0].load();
    //       });
    // if($('#part-2-opener')){
    //   MADDEN.part2Opener();
    // }

  });
}(jQuery));