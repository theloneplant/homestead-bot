const path = require('path');

class State {
    constructor() {
        this.shakespeare = false;
    }

    setState(state) {
        console.log(JSON.stringify(state))
        if (!state) {
            return;
        }
        this.setShakespeare(typeof state.shakespeare === 'undefined' ? this.shakespeare : state.shakespeare);
        this.setOWO(typeof state.owo === 'undefined' ? this.owo : state.owo);
    }

    getState() {
        return {
            'shakespeare': this.shakespeare,
            'owo': this.owo
        }
    }

    setShakespeare(value) {
        if (value === undefined) return;
        this.shakespeare = !!value;
        console.log(this.shakespeare);
    }

    setOWO(value) {
        if (value === undefined) return;
        this.owo = !!value;
        console.log(this.owo);
    }

    isShakespeare() {
        return this.shakespeare;
    }

    isOWO() {
        return this.owo;
    }
}

module.exports = State;