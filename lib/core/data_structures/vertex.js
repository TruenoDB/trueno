"use strict";

/**
 * @author Your Name Goes Here
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Description of the class */
class Vertex {

    /**
     * Create a template object.
     * @param {object} [param= {}] - Parameter with default value of object {}.
     */
	constructor(param = {}){

		this._property = param.prop || 'someValue';
	}

  /**
   * Class function description.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */
	myfunction(myParam) {
		
		/* This instance object reference */
		var self = this;
		
		/* some async execution */
		setTimeout(() => {
			self._property = myParam;
		}, 1000);

		return true;
	}
}


/* exporting the module */
module.exports = Vertex;