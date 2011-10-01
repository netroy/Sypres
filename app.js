var express = require('express'),
         io = require('socket.io'),
        app = express.createServer();

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

if (!module.parent) {
  app.listen(process.env.app_port || 10875);
  console.info("Started on port %d", app.address().port);
}

var io = io.listen(app);
io.set('log level', 1);
io.sockets.on('connection', function(client){
  // do something
});
