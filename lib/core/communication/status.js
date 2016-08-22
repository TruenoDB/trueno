"use strict";

/**
 * Created by: Victor Santos on 2016.08.20
 * Source: status.js
 * Author: Victor Santos
 * Description: Status enumerators for the API.
 */

function Status() {

  this.response = {
    ERROR: "error",
    SUCCESS: 'success'
  };

}

/* Immutable for security reasons */
module.exports = Object.freeze(new Status());
