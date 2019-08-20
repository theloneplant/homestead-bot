module.exports = function () {
    /**
     * Convewts a message to owo speech
     * @param {string} message Message to twanswate to Shakespeawean Engwish
     * @returns {string} Convewted message
     */
    function translate(message, cb) {
        if (!message) return;
        var converted = message;
        converted = converted.replace(/[rl]/gm, 'w')
        console.log('MSG: ' + converted);
        converted = converted[0].toUpperCase() + converted.substr(1);
        return converted;
    }

    return {
        translate
    };
}();
