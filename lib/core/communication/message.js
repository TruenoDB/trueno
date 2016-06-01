"use strict";

/**
 * @author Victor O. Santos Uceta
 * Communication message class.
 * @module lib/core/communication/message
 */

/* Singleton variable */
let msg = null;

/** Communication message class */
class Message {

  /**
   * Create a message object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._meta = param.meta || null;
    this._payload = param.payload || null;
    this._type = param.type || null;

  }

  static buildMessage(param = {}) {

    /* init singleton if null */
    if (!msg) {
      msg = Object.seal(new Message());
    }

    /* Setting all properties */
    msg.meta = param.meta;
    msg.payload = param.payload;
    msg.type = param.type;

    return msg;
  }

  /* Getters */
  get meta() {
    return this._meta;
  }

  get payload() {
    return this._payload;
  }

  get type() {
    return this._type;
  }

  /* Setters */
  set meta(value) {
    this._meta = value;
  }

  set payload(value) {
    this._payload = value;
  }

  set type(value) {
    this._type = value;
  }

}


/* exporting the module */
module.exports = className;