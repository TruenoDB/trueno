"use strict";


/**
 * Created by: victor on 2/1/15.
 * Source: app.js
 * Author: victor
 * Description:
 *
 */

function App(options) {

  this._scope = options.scope;
  this._timeout = options.timeout;
  this._mdSidenav = options.mdSidenav;
  this._conn = options.conn;

}

App.prototype.init = function () {

  this._scope.openLeftMenu = this.onLeftMenuOpen.bind(this);
  this._scope.$watch('selectedIndex', this.onTabSelected.bind(this));
};

App.prototype.onLeftMenuOpen = function () {

  this._mdSidenav('left').toggle();
};

App.prototype.onTabSelected = function (current, old) {

  console.log('selected tab: ', current);
};
