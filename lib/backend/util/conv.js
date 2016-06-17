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

  /**
   * Converts an object which enclosed other objects (dictionary) to the required string format. Used for the
   * serialization of fields: computed data from algorithms.
   * @param obj
   * @returns {string}
   */
  static objobjtoString(obj) {

    let out = '';
    let first = true;

    for (var i in obj) {
      if (!first) {
        out += ',';
      } else first = false;
      out +=  `'${i}' : ` + this.objtoString(obj[i]);
    }

    return '{' + out + '}';
  };

  /**
   * Cast an object with value {obj.value} to its corresponding type {obj.type}
   * @param obj
   * @returns {*}
   */
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
  };

  /**
   * Converts a object retrieved from Cassandra to a Object of Object (dictionary).Used for the deserialization of
   * fields: computed data from algorithms.
   * @param data
   * @returns {*}
   */
  static datatoObjectObject(data) {

    /* No data to convert */
    if (!data) return null;

    let obj = {}
    Object.keys(data).forEach((okey) => {
      obj[okey] = {};
     Object.keys(data[okey]).forEach((key) => {
        obj[okey][key] = this.castObject(data[okey][key]);
      });
    });

    return obj;
  };

  /**
   * Converts a object retrieved from Cassandra to a Object (dictionary).Used for the deserialization of fields:
   * attributes, metadata.
   * @param data
   * @returns {*}
   */
  static datatoObject(data) {

    /* No data to convert */
    if (!data) return null;

    let obj = {}
    Object.keys(data).forEach((key) => {
      obj[key] = this.castObject(data[key]);
    });

    return obj;
  };

  /**
   * Converts a object retrieved from Cassandra to a Map Object. Used for the deserialization of fields:
   * attributes, metadata.
   * @param data
   * @returns {*}
   */
  static datatoMap(data) {

    /* No data to convert */
    if (!data) return null;

    let obj = new Map();
    Object.keys(data).forEach((key) => {
      obj.set(key, this.castObject(data[key]));
    })

    return obj;
  };

}


/* exporting the module */
module.exports = conv;
