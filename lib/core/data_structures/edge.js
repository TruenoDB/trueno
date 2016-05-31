"use strict";

/**
 * @author Victor O. Santos Uceta
 * Edge class data structure.
 * @module lib/core/data_structures/edge
 * @see module:core/api/external-api
 */

/* Joi object schema validation library */
const Joi = require('joi');
const Component = require('./component');

/* validation schema constant */
const _schema = Joi.object().keys({
  _id: Joi.alternatives().try(null, Joi.string()).required(),
  _from: Joi.alternatives().try(null, Joi.string()).required(),
  _to: Joi.alternatives().try(null, Joi.string()).required(),
  _partition: Joi.number().integer(),
  _label: Joi.string().required(),
  _attributes: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The edge data structure class */
class Edge extends Component {
  /**
   * Create a Edge object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* invoke super constructor */
    super(param);

    /* The source vertex id of the edge */
    this._from = param.from || null;
    /* The destination vertex id of the edge */
    this._to = param.to || null;
    /* The partition where the vertex resides */
    this._partition = param.partition || null;
    /* The relationship label */
    this._label = param.label || null;

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  validate() {
    /* Validate this component with its schema */
    return Component.validate(this, _schema);
  }

  /*********************** GETTERS ***********************/

  get from() {
    return this._from;
  }

  get to() {
    return this._to;
  }

  get partition() {
    return this._partition;
  }

  get label() {
    return this._label;
  }

  /*********************** SETTERS ***********************/
  set from(value) {
    this._from = value;
  }

  set to(value) {
    this._to = value;
  }

  set partition(value) {
    this._partition = value;
  }

  set label(value) {
    this._label = value;
  }
}


/* exporting the module */
module.exports = Edge;