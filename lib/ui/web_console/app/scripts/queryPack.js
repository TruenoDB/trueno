"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: queryPack.js
 * Author: victor
 * Description:
 *
 */

function QueryPack(options) {

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
QueryPack.prototype.setQuery = function (q) {
  this._q = q;
}
QueryPack.prototype.setDescription = function (d) {
  this._desc = d;
}
QueryPack.prototype.setResult = function (r) {
  this._res = r;
}
QueryPack.prototype.setError = function (e) {
  this._err = e;
}
QueryPack.prototype.setStartTime = function (s) {
  this._sTime = s;
}
QueryPack.prototype.setEndTime = function (e) {
  this._eTime = e;
}
QueryPack.prototype.setDuration = function (d) {
  this._duration = d;
}
QueryPack.prototype.setSuccess = function (s) {
  this._success = s;
}
/* Getters */
QueryPack.prototype.getQuery = function () {
  return this._q;
}
QueryPack.prototype.getDescription = function () {
  return this._desc;
}
QueryPack.prototype.getResult = function () {
  return this._res;
}
QueryPack.prototype.getError = function () {
  return this._err;
}
QueryPack.prototype.getStartTime = function () {
  return this._sTime;
}
QueryPack.prototype.getEndTime = function () {
  return this._eTime;
}
QueryPack.prototype.getDuration = function () {
  return this._duration;
}
QueryPack.prototype.getSuccess = function () {
  return this._success;
}