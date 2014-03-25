// Generated by LiveScript 1.2.0
var Padnews, pad, pub, express, x$, app, server, y$, io, opFromEvent;
if (process.env.NODETIME_ACCOUNT_KEY) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_ACCOUNT_KEY,
    appName: 'congress-text-live'
  });
}
Padnews = require('padnews');
pad = new Padnews('FRzDUBto4Vj');
pub = './public';
express = require('express');
x$ = app = express();
x$.use(app.router);
x$.use(express['static'](pub));
x$.set('view engine', 'jade');
x$.get('/', function(req, res){
  return res.render('index', {
    news: pad.news
  });
});
x$.get('/json/all', function(req, res){
  var x$;
  x$ = res;
  x$.setHeader('Access-Control-Allow-Origin', '*');
  x$.json(pad.news);
  return x$;
});
x$.get('/json', function(req, res){
  var x$;
  x$ = res;
  x$.setHeader('Access-Control-Allow-Origin', '*');
  x$.json({
    total: pad.news.length,
    latest: pad.news.slice(pad.news.length - 42)
  });
  return x$;
});
x$.get('/json/:id(\\d+)', function(req, res){
  var entry, x$;
  entry = pad.news[parseInt(req.params.id, 10)];
  x$ = res;
  x$.setHeader('Access-Control-Allow-Origin', '*');
  x$.json(entry, entry ? 200 : 404);
  return x$;
});
server = require('http').Server(app);
y$ = io = require('socket.io').listen(server);
y$.set('log level', 1);
opFromEvent = {
  create: 'add',
  update: 'replace',
  remove: 'remove'
};
pad.run(10000, function(event, data, i, diff){
  var patch;
  if (event === 'ready') {
    return server.listen(process.env.PORT) || 5000;
  } else {
    patch = {
      op: opFromEvent[event],
      path: "/" + i,
      value: data
    };
    return io.sockets.emit('patch', patch);
  }
});