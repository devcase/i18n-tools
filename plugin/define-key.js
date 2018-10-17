"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _farmhash = _interopRequireDefault(require("farmhash"));

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function _default(text) {
  var r = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\W/g, "-").replace(/\-{2,}/g, "-").toLowerCase();
  if (r[0] === "-") r = r.substring(1);
  if (r[r.length - 1] === "-") r = r.substring(0, r.length - 1);
  return "h" + pad(_farmhash.default.hash32(text), 10) + "_" + r;
}