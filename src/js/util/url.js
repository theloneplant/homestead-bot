const path = require('path');
const math = require(path.join(__dirname, 'math'));

class URL {
    constructor(url) {
        this.setUrl(url);
    }

    setURL(url) {
        if (typeof url !== "string") {
            console.log("invalid param")
            this.valid = false;
            return;
        }
        this.fullURL = url;
        var urlArray = url.split("?");
        this.url = urlArray[0];
        this.params = urlArray.length > 1 ? urlArray[1] : "";
        this.hasParams = this.params === "";

        // Check for http/https
        var domainArray = this.url.split("/");
        var startsWithHttp = domainArray[0] === "http:" || domainArray[0] === "https:";
        if (startsWithHttp) {
            if (domainArray.length > 2) {
                domainArray = domainArray.slice(2);
            }
            else {
                console.log("invalid http")
                this.valid = false;
                return;
            }
        }
        else if (domainArray[0].includes(":")) {
            console.log("invalid www")
            this.valid = false;
            return;
        }
        
        // Get remaining path
        this.domain = domainArray[0];
        domainArray = domainArray.slice(1);
        if (domainArray.length > 0) {
            this.path = domainArray.join("/");
        }

        // Build param map
        var paramArray = this.params.split("&");
        for (var i = 0; i < paramArray.length; i++) {
            var param = paramArray[i].split("=");
            if (param.length > 1) {
                this.params[param[0]] = param.slice(1).join("=");
            }
            else if (param.length === 1) {
                this.params[param[0]] = true;
            }
        }
    }

    isValid() {
        return this.valid;
    }

    getFullURL() {
        return this.fullURL;
    }

    getURL() {
        return this.url;
    }

    getParams() {
        return this.params || {};
    }
}

module.exports = URL;
