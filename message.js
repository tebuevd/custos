/** Method: toBinary(string)
 *  -----------------------
 *  This method takes a string as a parameter and creates a node.js buffer
 *  of that string. Node.js buffer contains the hexadecimal values of each
 *  character in the string, and is similar to an array.
 *
 *  A module called 'base-converter' is used to convert each value in the
 *  buffer from hexadecimal to decimal and then from decimal to binary.
 *
 *  Finally, the method returns the binary string.
 */
function toBinary(str) {
    /* import 'base-converter' */
    var base = require('base-converter');

    /* creates the Buffer */
    var buf = new Buffer(str);

    /* sets up the output string */
    var binary = (function () {

	var output = "";

	/* loops through each value in the buffer  */
	for (var i = 0; i < str.length; i++) {

	    var temp = buf[i];
	    //console.log(temp);
	    /* converts from hex to dec to bin */
	    temp = base.decToBin(temp);
	    //console.log(temp);
	    
	    /* formats the string to have exactly 8 digits (8bit binary string)*/
	    output += format8Bit(temp);
	    //console.log(output);
	}

	return output;
	})();

    return binary;
}

/** Method: toText(binary string)
 *  ------------------------------
 *  This method takes in a binary string as its only argument and converts it back
 *  into text form. This is done by splitting the string into 8-bit parts, where
 *  each part represents a single ASCII character. Each binary string is converted
 *  to its decimal value, and each value is then written into a buffer. Once the
 *  whole string has been processed, the buffer is converted to a string.
 */
function toText(bin) {

    var base = require('base-converter');

    //console.log(bin);

    /* determines the size of the buffer needed! */
    var buf_size = bin.length / 8;
    //console.log(bin_size);

    /* creates a buffer of the specified size */
    var buf = new Buffer(buf_size);
    //console.log(buf);

    /* goes through 8-bit chunks, converts them to decimal then writes to buffer */
    for (var i = 0; i < bin.length; i = i + 8) {
	var temp = bin.slice(i, i + 8);
	//console.log(temp);

	temp = base.binToDec(temp);
	//console.log(temp);

	buf[i / 8] = temp;
	//console.log(buf);

    }

    return buf.toString();

}

/** Method: format8Bit(input)
 *  -------------------------
 *  This method takes in a binary string and if its length is less than 8, it appends
 *  0s to the start of the string, so that it has exactly 8 digits.
 */
function format8Bit(input) {

    while (input.length < 8) {
	input = 0 + input;
    }
    
    return input;
}

/** Method encryptMessage(message, password)
 *  ----------------------------------------
 *  This method takes in a message and a password as its two arguments,
 *  and return an encrypted binary string of the message encrypted (via XOR)
 *  by the password.
 */
function encryptMessage(message, password) {
	/* converts the meessage to binary! */
	var binString = toBinary(message);
	/* converts the string password to binary! */
	var binPass = toBinary(password);
	/* creates a new string for the binary password */
	var binPassString = "";

	while (binString.length > binPassString.length) {

		binPassString += String(binPass);

	}

	binPassString.slice(0, binString.length - 1);
	/*
	console.log("String: " + binString);
	console.log(toText(binString));
	console.log("Passwo: " + binPassString);
	console.log(toText(binPassString));
	*/

	var cipherText = xor(binString, binPassString);
	/*
	console.log("Cipher: " + cipherText);
	console.log(toText(cipherText));
	*/

	return cipherText;

}

/** Method: decryptMessage(message, password)
 *  --------------------------------------------
 *  This method takes in an encrypted string and its password, decrypts and returns the decrypted message.
 *  The encryption is assumed to be via XOR.
 */
function decryptMessage(msg, pass) {

	pass = toBinary(pass);

	var binPassString = "";

	while (msg.length > binPassString.length) {

		binPassString += String(pass);

	}

	binPassString.slice(0, msg.length - 1);

	var decipher = xor(msg, binPassString);

	return toText(decipher);
    
}

/** Method: xor(string1, string2)
 *  -----------------------------
 *  This method takes in 2 binary strings of equal lengths, and returns the XOR product of them.
 *  Very useful for encryption purposes!
 */
function xor(s1, s2) {
	var s3 = "";

	for (var i = 0; i < s1.length; i++) {
		if (s1.charAt(i) == s2.charAt(i)) {
			s3 += '0';
		} else {
			s3 += '1';
		}
	}

	return s3;
}

exports.toBinary = toBinary;
exports.toText = toText;
exports.encryptMessage = encryptMessage;
exports.decryptMessage = decryptMessage;