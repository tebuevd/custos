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
			
			if (message.length > 1) {
			    var item = message.charAt(0);
			    message = message.slice(1, message.length - 1);

			    if (item === 0) {
				if (this.data[idx] % 2 === 1) {
				    this.data[idx]--;
				}
			    } else {
				if (this.data[idx] % 2 === 0) {
				    this.data[idx]--;
				}
			    }

			} else {
			    message = "";
			}

		    }
		}

		this.pack().pipe(fs.createWriteStream('encoded_' + image));
	    });
}

exports.encodeMessage = encodeMessage;