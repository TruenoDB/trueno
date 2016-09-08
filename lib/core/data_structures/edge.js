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
  _source: Joi.alternatives().try(null, Joi.string()).required(),
  _target: Joi.alternatives().try(null, Joi.string()).required(),
  _partition: Joi.number().integer(),
  _label: Joi.string().required(),
  _prop: Joi.object().required(),
  _comp: Joi.object().required(),
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
    this._property._source = param.from || null;
    /* The destination vertex id of the edge */
    this._property._target = param.to || null;
    /* The partition where the vertex resides */
    this._property._partition = param.partition || null;
    /* The relationship label */
    this._property._label = param.label || null;


    this.setMapping('fromv', 'source');
    this.setMapping('tov', 'target');
    this.setMapping('attributes', 'attributes');
    this.setMapping('computed', 'computed');
    this.setMapping('meta', 'meta');


    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  validate() {
    /* Validate this component with its schema */
    return Component.validate(this, _schema);
  }

  /*======================== GETTERS =======================*/

  get target() {
    return this._property._source;
  }

  get from() {
    return this._property._target;
  }

  get partition() {
    return this._property._partition;
  }

  get label() {
    return this._property._label;
  }

  /*======================== SETTERS =======================*/

  set target(value) {
    this._property._source = value;
  }

  set from(value) {
    this._property._target = value;
  }

  set partition(value) {
    this._property._partition = value;
  }

  set label(value) {
    this._property._label = value;
  }
}


/* exporting the module */
module.exports = Edge;
