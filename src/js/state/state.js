const path = require('path');
const ytstream = require('youtube-audio-stream');
const Discord = require('discord.js');
const file = require(path.join(__dirname, '../util/file'));

class State {
    constructor() {
        this.shakespeare = false;
    }

    setState(state) {
        console.log(JSON.stringify(state))
        if (!state) {
            return;
        }
        this.setShakespeare(state.shakespeare);
    }

    getState() {
        return {
            'shakespeare': this.shakespeare
        }
    }

    setShakespeare(value) {
        if (value === undefined) return;
        this.shakespeare = !!value;
        console.log(this.shakespeare);
    }

    isShakespeare() {
        return this.shakespeare;
    }
}

module.exports = State;