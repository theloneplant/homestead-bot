class State {
    constructor() {
        this.shakespeare = false;
        this.pirate = false;
        this.owo = false;
    }

    setState(state) {
        console.log(JSON.stringify(state))
        if (!state) {
            return;
        }
        this.setShakespeare(typeof state.shakespeare === 'undefined' ? this.shakespeare : state.shakespeare);
        this.setPirate(typeof state.pirate === 'undefined' ? this.pirate : state.pirate);
        this.setOWO(typeof state.owo === 'undefined' ? this.owo : state.owo);
    }

    getState() {
        return {
            'shakespeare': this.shakespeare,
            'pirate': this.pirate,
            'owo': this.owo
        }
    }

    setShakespeare(value) {
        if (value === undefined) return;
        this.shakespeare = !!value;
        console.log(this.shakespeare);
    }

    setPirate(value) {
        if (value === undefined) return;
        this.pirate = !!value;
        console.log(this.pirate);
    }

    setOWO(value) {
        if (value === undefined) return;
        this.owo = !!value;
        console.log(this.owo);
    }

    isShakespeare() {
        return this.shakespeare;
    }

    isPirate() {
        return this.pirate;
    }

    isOWO() {
        return this.owo;
    }
}

module.exports = State;
