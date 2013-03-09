function encodeMessage(image, mes) {

	var message = mes;

	var fs = require('fs'),
	PNG = require('pngjs').PNG;

	fs.createReadStream(image)
	.pipe(new PNG({
		filterType: 4
	}))
	.on('parsed', function() {

		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var idx = (this.width * y + x) << 2;

				if (idx < message.length) {

					var item = message.charAt(idx);
					
					/* if the character in the encoded string is 0 */
					if (item == 0) {
					    /* if the pixel is odd, we want it to be even */
					    if (this.data[idx] % 2 == 1) {
						/* if the pixel is 0, add 1 to it */
						if (this.data[idx] == 0) {
						    this.data[idx] = this.data[idx] + 1;
						} else {
						    /* else substract 1 */
						    this.data[idx] = this.data[idx] - 1;
						}
					    }
					} else {
					    /* if the character in the encoded string is 1 */
					    if (this.data[idx] % 2 == 0) {
						if (this.data[idx] == 0) {
						    this.data[idx] = this.data[idx] + 1;
						} else {
						    this.data[idx] = this.data[idx] - 1;
						}
					    }
					}
					
					console.log(this.data[idx]);
					
				} else if (idx === message.length) {
					
				    /* do something to the first pixel following the end of the string */
				    this.data[idx] = 69;
				    this.data[idx+1] = 69;
				    this.data[idx+2] = 69;
				    console.log(this.data[idx]);
				    
				} else {
				    
				    /* do soemthing to the remaining pixels */

				}			       
			}
		}
		this.pack().pipe(fs.createWriteStream('encoded_' + image));
	});
}

function decodeMessage(image) {
	var message = "";

	var fs = require('fs'),
	PNG = require('pngjs').PNG;

	fs.createReadStream(image)
	.pipe(new PNG({
		filterType: 4
	}))
	.on('parsed', function() {

		dance:
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {

				var idx = (this.width * y + x) << 2;

				if (this.data[idx] == 69 && this.data[idx+1] == 69 && this.data[idx+2] == 69) {
					break dance;
				} else {

					if (this.data[idx] % 2 == 0) {
						message += "0";
					} else {
						message += "1";
					}

				}

			}
		}
		/* the message outputs correctly over here */
		console.log(message);
	});
	/* but the return of the variable here return message = "" */
	return message;
}

exports.encodeMessage = encodeMessage;
exports.decodeMessage = decodeMessage;