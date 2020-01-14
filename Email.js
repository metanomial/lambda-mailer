const Header = require('./Header.js');

/**
	Regular expression to separate email contents 
	@type {regex}
**/
const contentParser = /^(?<header>(?:.+\r?\n)*)(?<body>\r?\n(?:.*\s+)*)/m;

/**
	Regular expression to separate headers
	@type {regex}
**/
const headerParser = /^.+?:.*(\r?\n\s+.*)*\r?\n/mg;

/**
	Regular expression to seperate header field name and value
	@type {regex}
**/
const fieldParser = /^(?<name>.+?):\s+(?<value>.*(?:\r?\n\s+.*)*)\r?\n/;


/** Email interface **/
module.exports = class Email {
	
	/**
		Email body
		@type {string}
	**/
	body;
	
	/**
		Email headers
		@type {object}
	**/
	headers = {
		
		/**
			Headers list
			@type {Headers[]}
		**/
		list: [],
		
		/**
			Get first matching header
			@param {string} name
			@return {Header}
		**/
		get(name) {
			return this.list.find(header => header.name.toLowerCase() === name.toLowerCase());
		},
		
		/**
			 Get all matching headers
			 @param {string} name
			 @return {Header[]}
		**/
		getAll(name) {
			return this.list.filter(header => header.name.toLowerCase() === name.toLowerCase());
		},
		
		/**
			Add a new header
			@param {string} name
			@param {string} value
			@return {object}
		**/
		add(name, value) {
			this.list.push(new Header(name, value));
			return this.headers;
		},
		
		/**
			Remove matching headers
			@param {string} name
			@return {object}
		**/
		remove(name) {
			this.list = this.list.filter(header => header.name.toLowerCase() !== name.toLowerCase());
			return this;
		},
		
		/**
			Check if a matching header exists
			@param {string} name
			@return {boolean}
		**/
		has(name) {
			return this.get(name) != null;
		},
		
		/** String conversion method **/
		toString() {
			return this.list.map(header => header.toString()).join('\r\n');
		}
	};
	
	/**
		String conversion method
		@return {string} - Composed email contents
	**/
	toString() {
		return this.headers.toString() + '\r\n\r\n' + this.body;
	}
	
	/**
		Create an email interface
		@param {string} contents - Email contents
	**/
	constructor(contents) {
		const { header, body } = contents.match(contentParser).groups;
		this.body = body;
		header.match(headerParser)
			.map(field => field.match(fieldParser).groups)
			.forEach(({name, value}) => this.headers.add(name, value));
	}
};
