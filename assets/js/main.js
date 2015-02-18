var MADDEN = MADDEN || {

  playAudio: true,

  currentID: 1,

  initApp: function(){
    MADDEN.setScrollWatchers();
    MADDEN.checkPosition();
    MADDEN.pulseArrow();
    MADDEN.initEvents();
    MADDEN.initOpener();
  },

  pulseArrow: function(){
    $('.start-gamebreakers').toggleClass('trigger');
    setTimeout(MADDEN.pulseArrow,750);
  },

  initEvents:function(){
    $('.start-gamebreakers').on('click',MADDEN.nextBreaker);
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
    }
  },

  getRatio: function(element){
    var scrollTop = $(window).scrollTop();
    var enterPoint = element.offset().top - $(window).height();
    var exitPoint = element.offset().top + element.height();
    var ratio = ((scrollTop-enterPoint)/(exitPoint - enterPoint))*100;
    return ratio;
  },

  part1Opener:function(element,reset){
    if( reset && element.attr('data-trigger') ) {
      element.removeAttr('data-trigger');
    } else if(!reset) {
      element.attr('data-trigger',true);
      var ratio = MADDEN.getRatio(element);
      if(ratio > 0 && ratio < 30){
        $('.panel-1').addClass('triggered');
        $('.panel-2').removeClass('triggered');
        $('.panel-2 h3').addClass('hidden');
        $('.panel-2 h3.visible').removeClass('hidden');
      } else if(ratio >= 30 && ratio < 50 && !$('.panel-2').hasClass('triggered')){
        $('.panel-1').removeClass('triggered');
        $('.panel-2').addClass('triggered');
      } else if(ratio >=50 && ratio < 70 && !$('.panel-3').hasClass('triggered')){
        $('.panel-2 h3.hidden').removeClass('hidden');
        $('.panel-2 h3.visible').addClass('hidden');

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

  fullQuote: function(element,reset){
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

  showTweet: function(element,reset){
    if(reset && element.attr('data-trigger')){
      element.removeAttr('data-trigger');
      element.removeClass('triggered');
      element.find('.tweet-intro').css('top','0');
      return;
    } else if(!reset){
      element.attr('data-trigger',true);
      var ratio = MADDEN.getRatio(element);
      var enterPoint = element.offset().top;
      var scrollTop = $(window).scrollTop();
      if((enterPoint - scrollTop) < 25){
        var adjustedHeader = 0 - (enterPoint - scrollTop) + 25;
        if(0 - (enterPoint - scrollTop) < 25){
          adjusteHeader = 0 - (enterPoint - scrollTop);
        }
        element.find('.tweet-intro').css('top',adjustedHeader);
        element.find('.tweet-viewer').css('top',adjustedHeader + element.find('.tweet-intro').height());
      }
      window.tweetTimeout = setTimeout(function(){},100);
      if(ratio > 0 && ratio < 30){
        element.find('.tweet[data-index="1"]' ).removeClass('triggered');
      } else if(ratio >= 30 && ratio < 45 && !element.find('.tweet[data-index="1"]').hasClass('triggered')){
        if(element.find('.tweet[data-index="2"]').hasClass('triggered')){
          element.find('.tweet[data-index="2"]').removeClass('triggered');
          element.find('.tweet[data-index="3"]').removeClass('triggered');
          element.find('.tweet[data-index="4"]').removeClass('triggered');
          window.tweetTimeout = setTimeout(function(){
            element.find('.tweet[data-index="1"]').addClass('triggered');
          },500)          
        } else{
          element.find('.tweet[data-index="1"]').addClass('triggered');
        }
      } else if(ratio >= 45 && ratio < 60 && !element.find('.tweet[data-index="2"]').hasClass('triggered')){
          element.find('.tweet[data-index="1"]').removeClass('triggered');
          element.find('.tweet[data-index="3"]').removeClass('triggered');
          element.find('.tweet[data-index="4"]').removeClass('triggered');
          window.clearTimeout(tweetTimeout);
          window.tweetTimeout = setTimeout(function(){
            element.find('.tweet[data-index="2"]').addClass('triggered');
          },500);
      } else if(ratio >= 60 && ratio < 75 && !element.find('.tweet[data-index="3"]').hasClass('triggered')){
          element.find('.tweet[data-index="1"]').removeClass('triggered');
          element.find('.tweet[data-index="2"]').removeClass('triggered');
          element.find('.tweet[data-index="4"]').removeClass('triggered');
          window.clearTimeout(tweetTimeout);
          window.tweetTimeout = setTimeout(function(){
            element.find('.tweet[data-index="3"]').addClass('triggered');
          },500); 
      } else if(ratio >= 75 && ratio < 90 && !element.find('.tweet[data-index="4"]').hasClass('triggered') && !finalTweet){
          window.finalTweet = true;
          window.clearTimeout(tweetTimeout);
          if(element.find('.tweet.triggered').length > 0){
            window.tweetTimeout = setTimeout(function(){
              element.find('.tweet[data-index="4"]').addClass('triggered');
              window.finalTweet = false;
            },500);   
          } else{
            element.find('.tweet[data-index="4"]').addClass('triggered');
          }
          element.find('.tweet[data-index="1"]').removeClass('triggered');
          element.find('.tweet[data-index="2"]').removeClass('triggered');
          element.find('.tweet[data-index="3"]').removeClass('triggered');
          
      } else if(ratio >= 90){
        element.find('.tweet[data-index="1"]').removeClass('triggered');
        element.find('.tweet[data-index="2"]').removeClass('triggered');
        element.find('.tweet[data-index="3"]').removeClass('triggered');
        element.find('.tweet[data-index="4"]').removeClass('triggered');
      }

      
    }
  },

  adjustedStats: function(element,reset){
    if(reset && element.attr('data-trigger')){
      element.removeAttr('data-trigger');
      element.find('.adjustments').removeClass('triggered');
      element.find('.player-stats').removeClass('triggered');
      element.find(".adjusted-rating .player-rating").text(element.find(".adjusted-rating .player-rating").attr('data-starting-rating'));
      return;
    } else if(!reset){
      element.attr('data-trigger',true);
      var currentRatio = MADDEN.getRatio(element);
      if(currentRatio > 33 && !element.find('.player-stats.first').hasClass('triggered')){
        element.find('.player-stats.first').first().addClass('triggered');
      } else if(currentRatio > 55 && !element.find('.player-stats.first .adjustments').hasClass('triggered') && element.find('.player-stats.first').hasClass('triggered')){
        var originalStat = parseInt(element.find('.player-stats.first .original-rating .player-rating').text());
        var adjustedStat = parseInt(element.find('.player-stats.first .adjusted-rating .player-rating').attr('data-final-rating'));
        for(var i=originalStat; i<=adjustedStat; i++){
          MADDEN.increaseNumber(originalStat, i, element.find('.player-stats.first'));  
        }
        element.find('.player-stats.first .adjustments').addClass('triggered');
      } else if(currentRatio > 70 && !element.find('.player-stats.second').hasClass('triggered')){
         element.find('.player-stats.second').addClass('triggered');
      } else if(currentRatio > 77 && !element.find('.player-stats.second .adjustments').hasClass('triggered') && element.find('.player-stats.second').hasClass('triggered')){
        var originalStat = parseInt(element.find('.player-stats.second .original-rating .player-rating').text());
        var adjustedStat = parseInt(element.find('.player-stats.second .adjusted-rating .player-rating').attr('data-final-rating'));
        for(var i=originalStat; i<=adjustedStat; i++){
          MADDEN.increaseNumber(originalStat, i, element.find('.player-stats.second'));  
        }
        element.find('.player-stats.second .adjustments').addClass('triggered');
      }
    }
  },

  increaseNumber: function(original,index,element){
    var delayIndex = (0 -  (original - index)) * 80;
    var newNumber = index;
    setTimeout(function(){
      element.find('.adjusted-rating .player-rating').text(newNumber);
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

      console.log(MADDEN.currentID);
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
      MADDEN.currentID = 1;
      MADDEN.resetBreakers();
      MADDEN.resetGamebreakers();  
      return;
    }
    var currentIndex = current || parseInt($('.gamebreaker-panel.active').not('.previous').attr('data-panel-index'));
    MADDEN.currentID = next || currentIndex + 1;

    var elementScroll = $('#gamebreakers').offset().top;
    var scrollPosition = elementScroll + (($(window).height() * currentIndex)/3);
    $('html,body').scrollTop(elementScroll);
    MADDEN.resetBreakers();
    if(MADDEN.playAudio){
      var currentVideo = document.getElementById('breaker-video-'+MADDEN.currentID);
      currentVideo.play();
      currentVideo.onended = function(e) {
        if($('.gamebreaker-panel.active .start-gamebreakers').length > 0){
          $('.gamebreaker-panel.active .start-gamebreakers').click();
        } else{
          MADDEN.currentID = 1;
          MADDEN.resetGamebreakers();  
        }
      }

    }
    $('.gamebreaker-panel[data-panel-index="'+currentIndex+'"]').addClass('previous');
    $('.gamebreaker-panel[data-panel-index="'+MADDEN.currentID+'"]').addClass('active');

    setTimeout(function(){
      $('.gamebreaker-panel[data-panel-index="'+MADDEN.currentID+'"]').addClass('show-bio');
    },150);

    setTimeout(function(){
      $('.gamebreaker-panel[data-panel-index="'+MADDEN.currentID+'"]').addClass('hide-bio');
    },7000);

    setTimeout(function(){
      $('.gamebreaker-panel[data-panel-index="'+currentIndex+'"]').addClass('faded');
      $('.gamebreaker-panel[data-panel-index="'+currentIndex+'"]').removeClass('active');
    },1000);
  }, 

  resetBreakers: function(){
    $('.gamebreaker-video').each(function(){
      var vidID = parseInt($(this).attr('data-video-id'));
      if(vidID != MADDEN.currentID){
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
    }
    $('.gamebreaker-panel.active').animate({'opacity':0},250,function(){
      $('.gamebreaker-panel.active').removeAttr('style');
      MADDEN.currentID = 1;
      $('.show-bio').removeClass('show-bio');
      $('.hide-bio').removeClass('hide-bio');
      $('.gamebreaker-panel.active').removeClass('active');
      $('.gamebreaker-panel.previous').removeClass('previous');
      $('.gamebreaker-panel.faded').removeClass('faded');
      $('#gamebreaker-intro').addClass('active');
      
    });
  },

  part2Opener:function(element,reset){
    if(reset && element.attr('data-trigger')){
      element.removeAttr('data-trigger');
      element.find('.player-stats').removeClass('triggered');
      return;
    } else if(!reset){
      element.attr('data-trigger',true);
      var ratio = MADDEN.getRatio(element);
      if(ratio > 5 && ratio < 35 && !element.find('#opener-1').hasClass('triggered')){
        element.find('.triggered').removeClass('triggered');
        element.find('#opener-1').addClass('triggered');
      } else if(ratio >= 35 && ratio < 60 && !element.find('#opener-2').hasClass('triggered')){
        element.find('.triggered').removeClass('triggered');
        element.find('#opener-2').addClass('triggered');
      } else if(ratio >= 60 && !element.find('#opener-3').hasClass('triggered')){
        element.find('.triggered').removeClass('triggered');
        element.find('#opener-3').addClass('triggered');
      }
      if($(window).scrollTop() >= element.offset().top && $(window).scrollTop() < (element.offset().top + element.height() - $(window).height())){
        element.removeClass('done').addClass('locked');
      } else if($(window).scrollTop() >= (element.offset().top + element.height() - $(window).height())) {
        element.removeClass('locked').addClass('done');
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
      return;
    } else if(!reset){
      element.attr('data-trigger',true);
      var ratio = MADDEN.getRatio(element);
      if(ratio > 10 && ratio < 25 && !$('#combines .combine-1').hasClass('triggered')){
        $('#combines .combine-1').addClass('triggered');
        var vid1 = document.getElementById('combine-video-1');
        if(vid1){
          vid1.play();
        }
      } else if(ratio >= 25 && ratio < 40 && !$('#combines .combine-2').hasClass('triggered')){
        $('#combines .combine-2').addClass('triggered');
        
        var vid2 = document.getElementById('combine-video-2');
        if(vid2){
          vid2.play();
        }
      } else if(ratio >= 40 && ratio < 55 && !$('#combines .combine-3').hasClass('triggered')){
        $('#combines .combine-3').addClass('triggered');
        var vid3 = document.getElementById('combine-video-3');
        if(vid3){
          vid3.play();
        }
      } else if(ratio >= 55 && ratio < 70 && !$('#combines .combine-4').hasClass('triggered')){
        $('#combines .combine-4').addClass('triggered');
        var vid4 = document.getElementById('combine-video-4');
        if(vid4){
          vid4.play();
        }
      }
    }
  }

}

jQuery(function() {
  setTimeout(function(){
    window.finalTweet = false;
    MADDEN.initApp();

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