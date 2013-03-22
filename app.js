
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

var fs = require('fs');
var message = require('./message.js');
var image = require('./image.js');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
	res.sendfile('index.html');
    });

app.post('/upload', function(req, res, next) {
    //console.log(req.body);
    //console.log(req.files);
    var tmp_path = req.files.pic.path;
    var target_path = './public/img/' + req.files.pic.name;
    var encoded_path = '/img/' + req.files.pic.name + '_encoded.png';
    var secretMessage = req.body.secretMessage;
    var secretPassword = req.body.secretPassword;
    var cipherText = message.encryptMessage(secretMessage, secretPassword);

    image.encodeMessage(tmp_path, cipherText, function() {
          
          //console.log(encoded_path);
          var body = '<a href=\"' + tmp_path + '\">Click here for the image</a>';
          res.send(body);
          
        });
/*
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;

      fs.unlink(tmp_path, function() {
        if (err) throw err;

        image.encodeMessage(target_path, cipherText, function() {
          
          console.log(encoded_path);
          var body = '<a href=\"' + encoded_path + '\">Click here for the image</a>';
          res.send(body);
          fs.unlink(target_path);
        })
      })
    })
*/
});

app.post('/decrypt', function(req, res, next) {
    //console.log(req.body);
    //console.log(req.files);
    var tmp_path = req.files.pic.path;
    var target_path = './public/img/' + req.files.pic.name;
    var secretPassword = req.body.secretPassword;
    var cipherText = "";

    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;

      fs.unlink(tmp_path, function() {
        if (err) throw err;

        image.decodeMessage(target_path, function(msg) {
          if (err) throw err;
          msg = message.decryptMessage(msg, secretPassword);
          res.send(msg);
          fs.unlink(target_path);
        });
      });
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
    });