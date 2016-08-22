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
    this._status = param.status || null;
  }

  static buildMessage(param = {}) {

    /* init singleton if null */
    if (!msg) {
      msg = Object.seal(new Message());
    }

    /* Setting all properties */
    msg._meta = param.meta;
    msg._payload = param.payload;
    msg._type = param.type;
    msg._status = param.status;

    return msg;
  }

  /* Getters */
  getMeta() {
    return this._meta;
  }

  getPayload() {
    return this._payload;
  }

  getType() {
    return this._type;
  }

  getStatus() {
    return this._status;
  }


  /* Setters */
  setMeta(value) {
    this._meta = value;
  }

  setPayload(value) {
    this._payload = value;
  }

  setType(value) {
    this._type = value;
  }

  setStatus(value) {
    this._status = value;
  }

}


/* exporting the module */
module.exports = Message;
