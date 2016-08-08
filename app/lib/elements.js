module.exports = {
	/**
	 * Convert objectData to new returnObject that only contains keys/attributes that are accepted to store in the database
	 * for example: objectData.hello, and 'hello' is in acceptedKeysInArray, returnObject.hello,
	 * if 'hello' is not in acceptedKeysInArray, it will not stored in the returnObject.
	 * convert objectData to new returnObject that only contains keys/attributes that are accepted to store in the database
	 * for example: objectData.hello, and 'hello' is in acceptedKeysInArray, returnObject.hello,
	 * if 'hello' is not in acceptedKeysInArray, it will not stored in the returnObject.
	 *
	 * return: Object
	 */
	availableElements: function(availableKeysInArray, objectData) {
		var returnObject = {};
		for (var i = 0; i < availableKeysInArray.length; i++) {
			if (availableKeysInArray[i] in objectData) {
				returnObject[availableKeysInArray[i]] = objectData[availableKeysInArray[i]];
			} else {

			}
		};
		return returnObject;
	},


	checkElementsNotEmptyString: function(requiredKeysInArray, objectData) {
		var validated = true;
		for (var i = 0; i < requiredKeysInArray.length; i++) {
			//
			if (!(requiredKeysInArray[i] in objectData &&
				  (typeof objectData[requiredKeysInArray[i]] === "string" && objectData[requiredKeysInArray[i]] !== '') || 
				  (typeof objectData[requiredKeysInArray[i]] === "boolean") ||
				  (typeof objectData[requiredKeysInArray[i]] === "number")
				  )) {
				validated = false;
				break;
			};
		}
		return validated;
	},

	/**
	 * checkRequiredElements: checks fields/keys that exist and can't be empty
	 * @param  {Array} requiredKeysInArray   List you would to require
	 * @param  {Object} objectData           Object with keys, that needs to be validated
	 * @return {Boolean}                     Returns true/ false
	 */
	checkRequiredElements: function(requiredKeysInArray, objectData) {
		var validated = true;
		for (var i = 0; i < requiredKeysInArray.length; i++) {
			//
			if (!(requiredKeysInArray[i] in objectData)) {
				validated = false;
				break;
			};
		}

		return validated;
	}
}