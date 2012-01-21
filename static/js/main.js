(function(window, document, $, io, undefined){

  "use strict";

  var doc = $(document);

  function init(){
  
    // handle keys
    var keyEventMap = {
      38: "prevSlide",
      40: "nextSlide",
      37: "prev",
      39: "next"
    },
    slides = $("article"),
    pages = $("#pages"),
    index = 0,
    isAdmin = false,
    last = slides.length - 1,
    historyAPISupported = !!("history" in window && history.pushState),
    console = window.console || {log: function(){}};

    var socket = io.connect();

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

      if(isAdmin) {
        socket.emit("slide", index+1);
      }
    }

    var actions = {
      prev: function(){
        if(isAdmin){
          $.get("/prev");
        }
        updateSlide(index-1);
      },
      next: function(){
        if (isAdmin){
          $.get("/next");
        }
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
    

    doc.bind("keydown", function(e){
      var ev = keyEventMap[e.keyCode];
      if(ev !== undefined){
        doc.trigger(ev);
        e.preventDefault();
      }
    });



    for(var ev in keyEventMap){
      ev = keyEventMap[ev];
      doc.bind(ev, actions[ev]);
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
    $.merge(current.nextAll("article").addClass("next"), current).find("li").addClass("hidden");
    slides.parent().show();

    var keys = "38,38,40,40,37,39,37,39,66,65";
    var strokes = [];
    doc.bind("keydown", function handleKonami(e){
      strokes.push(e.keyCode);
      if (strokes.join().indexOf(keys) >= 0){
        doc.unbind('keydown', handleKonami);
        isAdmin = true;
        console.log("You've hit the magic keys, admin now");
      }
    });

    socket.on('connect', function() {
      //console.log('Connected');
    });

    socket.on("slide", function(number){
      if(!isAdmin){
        $(slides[number]).find("li.hidden").removeClass("hidden");
        updateSlide(number-1, false);
      }
    });
  }

  $(init);

})(window, document, jQuery, io);