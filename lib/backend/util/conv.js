"use strict";

/**
 * @author ebarsallo
 * Utils library.
 * @module lib/backend/utils/conv
 */

/** Import modules */


/** Utilities functions to convert data. */
class conv {


  /**
   * Returns datatype of a variable
   * @param x
   * @returns {*}
   */
  static getType(x) {
    let t = typeof(x);

    if (t == 'object')
      if (x instanceof Date)
        return 'date';

    return t;
  }

  /**
   * Converts an object (dictionary) to required string format (need by C*).
   * Used for serialization of fields: attributes, metadata.
   * @param obj
   * @returns {string}
   */
  static objtoString(obj) {

    let out = '';
    let first = true;

    for (var i in obj) {
      if (!first) {
        out += ',';
      } else first = false;
      out += ` '${i}' : ('${this.getType (obj[i])}', '${obj[i]}') `;
    }

    return '{' + out + '}';

  }

  /**
   * Converts a map of values to required string format (needed by C*).
   * Used for serialization of fields: attributes, metadata.,
   * metadata.
   * @param map
   * @returns {string}
   */
  static maptoString(map) {

    let out = '';
    let first = true;

    map.forEach((val, key) => {
      if (!first) {
        out += ',';
      } else first = false;
      out += ` '${key}' : ('${this.getType (val)}', '${val}') `;
    });

    return '{' + out + '}';

  };

  /**
   * Converts a map of map of values to the required string format. Used for the serialization of fields: computed
   * data from algorithms.
   * @param map
   */
  static mapmaptoString(map) {

    let out = '';
    let first = true;

    map.forEach((val, key) => {
      if (!first) {
        out += ',';
      } else first = false;
      out += this.maptoString(val);
    });

    return '{' + out + '}';
  };


  static castObject(obj) {

    switch (obj.type) {

      case "boolean" :
        return obj.value == "true";
        break;

      case "number" :
        return Number(obj.value);
        break;

      case "string" :
        return obj.value;
        break;

      case "Date" :
        return  new Date(obj.value);
        break;
    }

  }

  static datatoObject(data) {

    /* No data to convert */
    if (!data) return null;

    let obj = {}
    Object.keys(data).forEach((key) => {
      obj[key] = this.castObject(data[key]);
    })

    return obj;
  }

  static datatoMap(data) {

    /* No data to convert */
    if (!data) return null;

    let obj = new Map();
    Object.keys(data).forEach((key) => {
      obj.set(key, this.castObject(data[key]));
    })

    return obj;
  }

}

/* exporting the module */
module.exports = conv;
