const path = require('path');
const shakespeare = require(path.join(__dirname, '../util/shakespeare'));
const pirate = require(path.join(__dirname, '../util/pirate'));
const owo = require(path.join(__dirname, '../util/owo'));

module.exports = function () {
    function message(message, state) {
        return filter(message, state);
    }

    function embed(embed, state) {
        var filtered = embed;
        if (!filtered) {
            return undefined;
        }
        console.log('stringify - ' + JSON.stringify(filtered))
        if (filtered) {
            if (filtered.title) {
                filtered.title = filter(filtered.title, state);
            }
            if (filtered.description) {
                filtered.description = filter(filtered.description, state);
            }
            if (filtered.footer && filtered.footer.text) {
                filtered.footer.text = filter(filtered.footer.text, state);
            }
            if (filtered.fields) {
                for (var i = 0; i < filtered.fields.length; i++) {
                    if (filtered.fields[i].name) {
                        filtered.fields[i].name = filter(filtered.fields[i].name, state);
                    }
                    if (filtered.fields[i].value) {
                        filtered.fields[i].value = filter(filtered.fields[i].value, state);
                    }
                }
            }
        }
        return filtered;
    }

    function filter(str, state) {
        if (!str) return '';
        var filtered = str;
        console.log(filtered);
        if (state.isShakespeare()) {
            filtered = shakespeare.translate(filtered);
        }
        console.log(filtered);
        if (state.isPirate()) {
            filtered = pirate.translate(filtered);
        }
        console.log(filtered);
        if (state.isOWO()) {
            filtered = owo.translate(filtered);
        }
        console.log(filtered);
        return filtered;
    }

    return { message, embed };
}();
