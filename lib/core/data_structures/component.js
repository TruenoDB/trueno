"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph component super class.
 * @module lib/core/data_structures/component
 * @see module:core/data_structure/graph
 */

const Joi = require('joi');
const Promise = require("bluebird");

/** Graph component super class */
class Component {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The internal id of the component */
    this._id = param.id || null;
    /* Component custom attributes */
    this._attributes = param.attributes || {};
    /* Component custom computed fields */
    this._computed = param.computed || {};
    /* Component metadata */
    this._meta = param.meta || {};
  }

  /**
   * Validates the Graph object schema.
   * @return {promise} A promise for the validation result.
   */
  static validate(c, schema) {
    /* return validation promise */
    return new Promise((resolve, reject)=> {
      Joi.validate(c, schema, {abortEarly: false}, (err, value)=> {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  /*********************** GETTERS ***********************/
  get id() {
    return this._id;
  }

  get attributes() {
    return Object.freeze(this._attributes);
  }

  get computed() {
    return Object.freeze(this._computed);
  }

  get meta() {
    return Object.freeze(this._meta);
  }

  /*********************** SETTERS ***********************/

  set id(value) {
    this._id = value;
  }

  /*********************** ATTRIBUTES ***********************/

  /* Attributes collection methods */
  setAttribute(attr, value) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, value);
    /* Adding the attribute */
    this._attributes[attr] = value;
  }

  getAttribute(attr) {
    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* getting the attribute */
    return this._attributes[attr]
  }

  removeAttribute(attr) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* Removing the attribute */
    delete this._attributes[attr];
  }

  /*********************** COMPUTED ***********************/
  setComputedAlgorithm(algo) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* if algo attribute exist */
    if (this._computed[algo]) {
      throw new Error('Provided algorithm(' + algo + ') is already present');
    }
    /* removing the attribute */
    this._computed[algo] = {};
  }

  getComputedAlgorithm(algo) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* if algo attribute exist */
    if (this._computed[algo]) {
      throw new Error('Provided algorithm(' + algo + ') is already present');
    }
    /* removing the attribute */
    Object.freeze(this._computed[algo]);
  }

  removeComputedAlgorithm(algo) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* if algo attribute exist */
    if (!this._computed[algo]) {
      throw new Error('Provided algorithm (' + algo + ') is not present');
    }
    /* removing the attribute */
    delete this._computed[algo];
  }

  /* Computed collection methods */
  setComputedAttribute(algo, attr, value) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the attr type */
    this._validateAttrAndVal(attr, value);
    /* if algo attribute does not exist, create it */
    if (!this._computed[algo]) {
      this._computed[algo] = {};
    }
    /* Adding the attribute */
    this._computed[algo][attr] = value;

  }

  getComputedAttribute(algo, attr) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* if algo attribute does not exist */
    if (!this._computed[algo]) {
      throw new Error('Provided algorithm property(' + algo + ') is not present');
    }
    /* Getting the attribute */
    return this._computed[algo][attr];

  }

  removeComputedAttribute(algo, attr) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* if algo attribute does not exist */
    if (!this._computed[algo]) {
      throw new Error('Provided algorithm property(' + algo + ') is not present');
    }
    /* removing the attribute */
    delete this._computed[algo][attr];
  }

  /*********************** META ***********************/

  /* Attributes collection methods */
  setMetaAttribute(attr, value) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, value);
    /* Adding the attribute */
    this._meta[attr] = value;
  }

  getMetaAttribute(attr) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* Getting the attribute */
    return this._meta[attr];
  }

  removeMetaAttribute(attr) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* Removing the attribute */
    delete this._meta[attr];
  }

  /*********************** VALIDATION ***********************/
  /* Validation methods */
  _validateAlgoType(algo) {
    if (!/^string$/.test(typeof algo)) {
      throw new Error('Algorithm name must be of type: string');
    }
  }

  _validateAttrAndVal(attr, value) {

    /* validating the attr type */
    if (!/^string$/.test(typeof attr)) {
      throw new Error('Attribute name must be of type: string');
    }
    /* validating the value type */
    if (!/^(boolean|number|string)$/.test(typeof value) && !(value instanceof Date)) {
      throw new Error('Attribute value must be of type: boolean | number | string | Date');
    }
  }

}


/* exporting the module */
module.exports = Component;