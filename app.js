var express = require('express'),
         io = require('socket.io'),
        app = express.createServer(),
         io = io.listen(app);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.enable('view cache');
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));

  // Catch all unhandled routes ... i dont like 404s
  app.use(function(eq, resp){
    resp.redirect("/");
  });

});

app.get("/[1-9]?([0-9])?/?", function(req, resp){
  resp.render("main", {
    "title": "Realtime Web"
  });
});

/*
app.get("/next", function(req, resp){
  io.sockets.emit("next");
  resp.end();
});

app.get("/prev", function(req, resp){
  io.sockets.emit("prev");
  resp.end();
});

app.get("/slide", function(req, resp){
  io.sockets.emit("slide", 0);
  resp.end();
});
*/

if (!module.parent) {
  app.listen(process.env.app_port || 10875);
  console.info("Started on port %d", app.address().port);
}

io.configure(function(){
  io.set('log level', 1);
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
});

io.sockets.on('connection', function(client){
  client.on("slide", function(index) {
    console.log(index);
    client.broadcast.emit("slide", index);
  });
});
