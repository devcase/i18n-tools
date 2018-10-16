"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(text) {

  var r = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\W/g, "-").replace(/\-{2,}/g, "-").toLowerCase();
  return r;
}