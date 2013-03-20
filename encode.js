var message = require('./message.js');

var image = require('./image.js');

var testString = "welcome to the jungle!<3";

var testPass = "pass";

/* ------------------------------------------------------------------------- */

var cipherText = message.encryptMessage(testString, testPass);

//console.log(message.toBinary(testString));
//console.log(cipherText);

//image.encodeMessage('test-jpg.png', cipherText);

var x = "";

image.decodeMessage('encoded_test-jpg.png', function(decoded) {
	x = decoded;
});

if (x != "") console.log(x);