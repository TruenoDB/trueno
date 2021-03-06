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
  _prop: Joi.object().required(),
  _comp: Joi.object().required(),
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
    //this._property._name = param.name || null;
    /* If true, graph is directed, if false is undirected(default) */
    //this._property._directed = param.directed || false;
    this.setAttribute('directed', param.directed || false);
    /* True if the graph is dynamic, default static */
    //this._property._dynamic = param.dynamic || false;
    this.setAttribute('dynamic', param.dynamic || false);
    /* True if the graph is a multi graph(parallel edges between same vertices */
    //this._property._multi = param.multi || false;
    this.setAttribute('multigraph', param.multi || false);

    this._property._graphid = param.id || null;

    this.setMapping('id', 'id');
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

  get name() {
    return this._property._id;
  }

  get directed() {
    return this.getAttribute('directed');
    //return this._property._directed;
  }

  get dynamic() {
    return this.getAttribute('dynamic');
    //return this._property._dynamic;
  }

  get multi() {
    return this.getAttribute('multigraph');
    //return this._property._multi;
  }

  /*======================== SETTERS =======================*/

  set name(value) {
    this._property._id = value;
  }

  set directed(value) {
    this.setAttribute('directed', value);
    //this._property._directed = value;
  }

  set dynamic(value) {
    this.setAttribute('dynamic', value);
    //this._property._dynamic = value;
  }

  set multi(value) {
    this.setAttribute('multigraph', value);
    //this._property._multi = value;
  }
}


/* exporting the module */
module.exports = Graph;
