var message = require('./message.js');

var image = require('./image.js');

var testString = "Hello World!";

var encryptedString = message.toBinary(testString);

image.encodeMessage('in.png', testString);