/**
	Array filter to remove duplicates
	@param {*} item - The item in the array
	@param {number} number - The index of the item
	@param {array} array - The full array
	@return {boolean} - true if the item is the first matching instance in the array, else false
**/
exports.deduplicate = (item, index, array) => array.indexOf(item) === index;
