const request = require('request');
const cheerio = require('cheerio');

module.exports = function() {
	function getDom(url, cb) {
		request(url, function(err, res, html) {
			if (err) {
				console.log(err);
				cb(err);
			}
			else {
				cb(null, cheerio.load(html));
			}
		});
	}

	function scrape(url, selector, cb) {
		getDom(url, (err, $) => {
			if (err) {
				cb(err);
			}
			else {
				var element = $(selector);
				if (!element) {
					console.log('Unable to scrape ' + url + ' with selector: ' + selector);
				}
				cb(null, $, element);
				console.log('done');
			}
		});
	}

	return { scrape };
}();
