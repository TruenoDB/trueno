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

const Edge = require ('./edge');

/* validation schema constant */
const _schema = Joi.object().keys({
  _id: Joi.alternatives().try(null, Joi.number()).required(),
  _partition: Joi.number().integer(),
  _attributes: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()

  ,_internal: Joi.object()
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
    this._property._partition = param.partition || null;


    this.setMapping('id', 'id');
    this.setMapping('partition', 'partition');
    this.setMapping('attributes', 'attributes');
    this.setMapping('computed', 'computed');
    this.setMapping('meta', 'meta');

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  validate() {
    /* Validate this component with its schema */
    return Component.validate(this._property, _schema);
  }

  /*======================== GETTERS =======================*/

  get partition() {
    return this._property._partition;
  }

  /*======================== SETTERS =======================*/

  set partition(value) {
    this._property._partition = value;
  }

  /*====================== OPERATIONS ======================*/

  /**
   * Add an edge to the vertex
   * @param vertexj
   * @returns {Edge}
   */
  addEdge(vertexj) {
    return new Edge({ from : this._property._id, to : vertexj._property._id, graphid : this._property._graphid });
  }

}


/* exporting the module */
module.exports = Vertex;
