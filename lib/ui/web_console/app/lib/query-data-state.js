"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: query-data-state.js
 * Author: victor
 * Description:
 *
 */

function QueryDataState(options) {

  /* Set default parameter */
  options = options || {};

  this._q = options.q || '';
  this._desc = options.desc || '';
  this._res = options.res || null;
  this._err = options.err || null;
  this._sTime = options.sTime || null;
  this._eTime = options.eTime || null;
  this._duration = null;
  this._success = null;
}

/* Setters */
QueryDataState.prototype.setQuery = function (q) {
  this._q = q;
}
QueryDataState.prototype.setDescription = function (d) {
  this._desc = d;
}
QueryDataState.prototype.setResult = function (r) {
  this._res = r;
}
QueryDataState.prototype.setError = function (e) {
  this._err = e;
}
QueryDataState.prototype.setStartTime = function (s) {
  this._sTime = s;
}
QueryDataState.prototype.setEndTime = function (e) {
  this._eTime = e;
}
QueryDataState.prototype.setDuration = function (d) {
  this._duration = d;
}
QueryDataState.prototype.setSuccess = function (s) {
  this._success = s;
}
/* Getters */
QueryDataState.prototype.getQuery = function () {
  return this._q;
}
QueryDataState.prototype.getDescription = function () {
  return this._desc;
}
QueryDataState.prototype.getResult = function () {
  return this._res;
}
QueryDataState.prototype.getError = function () {
  return this._err;
}
QueryDataState.prototype.getStartTime = function () {
  return this._sTime;
}
QueryDataState.prototype.getEndTime = function () {
  return this._eTime;
}
QueryDataState.prototype.getDuration = function () {
  return this._duration;
}
QueryDataState.prototype.getSuccess = function () {
  return this._success;
}