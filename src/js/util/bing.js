const path = require('path');
const entities = require('entities');
const web = require(path.join(__dirname, 'web'));

module.exports = function() {
	const bingUrl = 'https://www.bing.com';
	const bingSearchUrl = 'https://www.bing.com/search?q=';
	const bingImageUrl = 'https://www.bing.com/images/search?q=';
	var searchMap = {};
	var imageMap = {};

	function search(search, group, cb) {
		var url = bingSearchUrl + escape(search);
		var selector = 'ol#b_results';
		web.scrape(url, selector, function(err, $, element) {
			var result;
			element.children().each(function() {
				if ($(this).hasClass('b_ans') && $(this).hasClass('b_top')) {
					result = findAnswer($(this));
					if (result) {
						cb(null, result);
						return false;
					}
				}
				else if ($(this).hasClass('b_algo')) {
					result = findLink(group, $(this));
					if (result) {
						cb(null, result);
						return false;
					}
				}
			});
			if (!result) {
				cb('Unable to scrape web page', null);
			}
		});
	}

	function searchImages(search, group, cb) {
		var url = bingImageUrl + escape(search);
		var selector = '#b_content #canvas .content';
		web.scrape(url, selector, (err, $, element) => {
			var result;
			element.children().each(function() {
				if ($(this).hasClass('row')) {
					result = findImage(group, $, $(this));
					// TODO: Save searches and avoid posting the same image twice
					if (result) {
						cb(null, result);
						return false;
					}
				}
			});
			if (!result) {
				cb('Unable to scrape web page', null);
			}
		});
	}

	function findImage(group, $, element) {
		try {
			var imageUrl;
			element.children().each(function() {
				if ($(this).hasClass('item')) {
					var url = $(this).find('a.thumb').attr('href');
					if (!imageMap[group]) {
						imageMap[group] = {};
					}
					if (!imageMap[group][url]) {
						imageMap[group][url] = true;
						imageUrl = url;
						return false;
					}
				}
				else {
					return false;
				}
			});
			return imageUrl;
		}
		catch (err) {
			console.log(err);
			return null;
		}
	}

	function findAnswer(group, element) {
		try {
			var container = element.find('.tpft .sf_tc');
			// Strings in the header are formatted as 'TITLE · TYPE'
			var title = container.children('div:nth-child(1)').children('div:nth-child(1)').html();
			// Decode xml characters, remove tags, and only return the title of the result
			title = entities.decodeXML(title).replace(/<\/?\b[^>]*>/g, '').split('·')[0].trim();
			var result = container.children('div:nth-child(2)').children('div:nth-child(1)').html();
			var upcoming = Date.parse(result.match(/[a-zA-Z]+ \d+, \d+/g)[0]) > Date.now();

			if (result && title && upcoming !== null) {
				return {
					'result': result,
					'title': title,
					'upcoming': upcoming,
					'type': 'answer'
				};
			}
			else {
				return null;
			}
		}
		catch (err) {
			return null;
		}
	}

	function findLink(group, element) {
		try {
			var link = element.find('h2 a');
			var url = link.attr('href');
			var title = entities.decodeXML(link.html());
			var body = entities.decodeXML(element.find('.b_caption p').html());
			// Remove all span/a tags inside of body (separated by '·')
			body = body.replace(/<span.*?>.*?<\/span>|<a.*?>.*?<\/a>|\s*·\s*/g, '');
			title = title.replace(/<strong>|<\/strong>/g, '');

			if (title && body && url) {
				return {
					'title': title,
					'body': body,
					'url': url,
					'type': 'link'
				};
			}
			else {
				return null;
			}
		}
		catch (err) {
			return null;
		}
	}

	return { search, searchImages };
}();
