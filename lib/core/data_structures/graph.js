"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph class data structure.
 * @module lib/core/data_structures/graph
 * @see module:core/api/external-api
 */

/* Joi object schema validation library */
const Joi = require('joi');
const Component = require('./component');

/* validation schema constant */
const _schema = Joi.object().keys({
  _id: Joi.alternatives().try(null, Joi.string()),
  _name: Joi.string().required(),
  _directed: Joi.boolean().required(),
  _dynamic: Joi.boolean().required(),
  _multi: Joi.boolean().required(),
  _attributes: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The graph data structure class */
class Graph extends Component {
  /**
   * Create a Graph object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* invoke super constructor */
    super(param);

    /* The name of the graph */
    this._name = param.name || null;
    /* If true, graph is directed, if false is undirected(default) */
    this._directed = param.directed || false;
    /* True if the graph is dynamic, default static */
    this._dynamic = param.dynamic || false;
    /* True if the graph is a multi graph(parallel edges between same vertices */
    this._multi = param.multi || false;

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  validate() {
    /* Validate this component with its schema */
    return Component.validate(this, _schema);
  }

  /*********************** GETTERS ***********************/

  get name() {
    return this._name;
  }

  get directed() {
    return this._directed;
  }

  get dynamic() {
    return this._dynamic;
  }

  get multi() {
    return this._multi;
  }

  /*********************** SETTERS ***********************/
  set name(value) {
    this._name = value;
  }

  set directed(value) {
    this._directed = value;
  }

  set dynamic(value) {
    this._dynamic = value;
  }

  set multi(value) {
    this._multi = value;
  }
}


/* exporting the module */
module.exports = Graph;