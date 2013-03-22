/** File: app.js
 *  -----------------------------
 *  This is the server built with
 *  express.
 */

/* Module dependencies */
 var express = require('express')
 , http = require('http')
 , path = require('path');

 var app = express();

 var fs = require('fs');
 var message = require('./message.js');
 var image = require('./image.js');

/* Express config */
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

/* Sends the index.html file */
 app.get('/', function(req, res) {
   res.sendfile('index.html');
 });

/* Takes care of downloading files from cache/tmp folder.
 * This is useful as heroku doesn't permit permanent storage,
 * but allows for temporary files to be stored on the server.
 * For permanent storage Amazon S3 would have to be used.
 */
 app.get('/tmp/:file(*)', function(req, res, next){
  var file = req.params.file
  , path = '/tmp/' + file;

  res.download(path);
});

/* takes care of the encryption process */
 app.post('/encrypt', function(req, res, next) {

  /* the path to the file */
  var tmp_path = req.files.pic.path;
  /* retreives input from the form */
  var secretMessage = req.body.secretMessage;
  var secretPassword = req.body.secretPassword;
  /* creates the cipher text */
  var cipherText = message.encryptMessage(secretMessage, secretPassword);

  /* takes care of the encoding and returns a file download */
  image.encodeMessage(tmp_path, cipherText, function() {

          var end_path = '/tmp/encoded.png';

          fs.rename(tmp_path, end_path, function (err) {
            if (err) throw (err);

            var body = '<span>Click <a href=\"' + end_path + '\">here</a> for the image</span>';
            res.send(body); 
          });
        });

});

/* takes care of the decryption process */
app.post('/decrypt', function(req, res, next) {
    
    /* file path */
    var tmp_path = req.files.pic.path;
    /* retrieves password from form */
    var secretPassword = req.body.secretPassword;

    /* takes out the string from file, decrypts it, then outputs it */
    image.decodeMessage(tmp_path, function(msg) {

      msg = message.decryptMessage(msg, secretPassword);
      res.send(msg);
      
    });

});

/* port config */
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});