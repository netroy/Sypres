var init = (function(window, document, $){
  function init(){
  
    // handle keys
    var keyEventMap = {
      38: "prevSlide",
      40: "nextSlide",
      37: "prev",
      39: "next"
    }, 
    log = console?console.log.bind(console):function(){},
    slides = $("article"), 
    pages = $("#pages"),
    index = 0, 
    last = slides.length - 1,
    historyAPISupported = !!("history" in window && history.pushState),
    isAdmin = true;

    function updateSlide(i, skipHistory){
      if(typeof i !== 'number' || i < 0 || i > last){
        index = (i < 0) ? 0 : last;
        return;
      }

      $(slides[index]).removeClass("selected").addClass(i > index ? "prev" : "next");
      $(slides[i]).addClass("selected").removeClass("prev next");

      index = i;
      if(historyAPISupported && typeof skipHistory === 'undefined'){
        history.pushState(null, null, "/" + (index+1));
      }
      pages.html((index+1) + " / " + (last+1));
    }

    var actions = {
      prev: function(){
        updateSlide(index-1);
      },
      next: function(){
        var li = $(slides[index]).find("li.hidden");
        if(li.length > 0){
          li.first().removeClass("hidden");
        }else{
          updateSlide(index+1);
        }
      },
      prevSlide: function(){

      },
      nextSlide: function(){

      }
    };
    

    $(document).bind("keydown", function(e){
      var ev = keyEventMap[e.keyCode];
      if(typeof ev !== "undefined"){
        $(document).trigger(ev);
      }
    });



    for(var ev in keyEventMap){
      ev = keyEventMap[ev];
      $(document).bind(ev, actions[ev]);
    }
    
    if(historyAPISupported){
      $(window).bind("popstate", function(e){
        var index = parseInt(location.pathname.substr(1) || 1, 10);
        if(!isNaN(index)){
          updateSlide(index-1, true);
        }
      });
    }

    var current = $(slides[parseInt(location.pathname.substr(1) || 1, 10) - 1]);
    current.addClass("selected");
    current.prevAll("article").addClass("prev");
    jQuery.merge(current.nextAll("article").addClass("next"), current).find("li").addClass("hidden");
    slides.parent().show();


/*

    (function(callback) {
      var keys = "38,38,40,40,37,39,37,39,66,65";
      var strokes = [];
      $(document).bind("keypress", function(e){
        strokes.push(e.keyCode);
        if (strokes.join().indexOf(keys) >= 0){
          $(document).unbind('keydown', arguments.callee);
          callback();
        }
      }, true);
    })(function(){
      isAdmin = true;
      if(console.log){
        console.log("You've hit the magic keys, admin now");
      }
    });
*/
    var socket  = io.connect();
    socket.on('connect', function() {
      log('Connected');
    });
    socket.on("next", function(){
      $(document).trigger("next");
    });
    socket.on("prev", function(){
      $(document).trigger("prev");
    });
  }
  $(init);
})(window, document, jQuery);