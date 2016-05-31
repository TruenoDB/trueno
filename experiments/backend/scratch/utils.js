"use strict";

/**
 * @author ebarsallo
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');


class utils {


  /**
   *
   * @param map
   * @returns {string}
   */

  static maptoString (map) {

    let out = '';
    let first = true;

    map.forEach((val, key) => {
      if (!first) {
        out += ',';
      } else first = false;
      out += ` '${key}' : ('${val.type}', '${val.value}') `;
    });

    return '{' + out + '}';

  };

}

/* exporting the module */
module.exports = utils;
