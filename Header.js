/** Email header field **/
module.exports = class Header {
    
    /**
        Field name
        @type {string}
    **/
    name;
    
    /**
        Field value
        @type {string}
    **/
    value;
    
    /**
        Return the display name of a from header
        @return {string}
    **/
    get fromDisplay() {
        if(this.name.toLowerCase() !== 'from') return null;
        if(!this.value.match(/</)) return this.value;
        let result;
        if(result = this.value.match(/^<(.+?)>/)) return result[1];
        if(result = this.value.match(/^(.+?)[:<]/)) return result[1];
        return null;
    }
    
    /**
        Create header field interface
        @param {string} name
        @param {string} value
    **/
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    
    /**
        String conversion method
        @return {string}
    **/
    toString() {
        return `${this.name}: ${this.value}`;
    }
};
