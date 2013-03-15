var message = require('./message.js');

var image = require('./image.js');

var testString = "welcome to the jungle!<3";

var testPass = "pass";

var binString = message.toBinary(testString);

var encryptString = message.encryptBinary(binString, testPass);