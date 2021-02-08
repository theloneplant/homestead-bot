const path = require('path');
const file = require(path.join(__dirname, '../util/file'));
const config = file.read(path.join(__dirname, '../../../config/pirate.json'));

module.exports = function () {
    /**
     * Converts a message to an exaggerated Pirate English. It uses two
     * different maps as a source for translation - one that replaces whole words
     * or phrases, and another that only replaces the end of words. This is to
     * separate contractions and replace common patterns of words that occur in
     * this type of speech.
     * @param {string} message Message to translate to Pirate English
     * @returns {string} Converted Pirate message
     */
    function translate(message, cb) {
        if (!message) return;
        var converted = message;
        for (var key in config.replacePriority) {
            var regex = new RegExp('\\b' + key + '\\b', 'gmi');
            converted = converted.replace(regex, config.replacePriority[key]);
        }
        for (var key in config.startsWith) {
            var regex = new RegExp('\\b' + key, 'gmi');
            converted = converted.replace(regex, config.startsWith[key]);
        }
        for (var key in config.endsWith) {
            var regex = new RegExp(key + '\\b', 'gmi');
            converted = converted.replace(regex, config.endsWith[key]);
        }
        for (var key in config.replace) {
            var regex = new RegExp('\\b' + key + '\\b', 'gmi');
            converted = converted.replace(regex, config.replace[key]);
        }
        converted = converted.replace(/([.?!]\s*)\w/gmi, (match) => {
            if (match.length === 0) {
                return match;
            }
            return match.substr(0, match.length - 1) + match[match.length - 1].toUpperCase();
        })
        console.log('MSG: ' + converted);
        converted = converted[0].toUpperCase() + converted.substr(1);
        return converted;
    }

    return { translate };
}();
