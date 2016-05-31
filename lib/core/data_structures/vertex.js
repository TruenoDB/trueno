"use strict";

/**
 * @author Victor O. Santos Uceta
 * Vertex class data structure.
 * @module lib/core/data_structures/vertex
 * @see module:core/api/external-api
 */

/* Joi object schema validation library */
const Joi = require('joi');
const Component = require('./component');

/* validation schema constant */
const _schema = Joi.object().keys({
  _id: Joi.alternatives().try(null, Joi.string()).required(),
  _partition: Joi.number().integer(),
  _attributes: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The edge data structure class */
class Vertex extends Component {
  /**
   * Create a Vertex object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* invoke super constructor */
    super(param);

    /* The partition where the vertex resides */
    this._partition = param.partition || null;

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  validate() {
    /* Validate this component with its schema */
    return Component.validate(this, _schema);
  }

  /*********************** GETTERS ***********************/

  get partition() {
    return this._partition;
  }

  /*********************** SETTERS ***********************/

  set partition(value) {
    this._partition = value;
  }

}


/* exporting the module */
module.exports = Vertex;