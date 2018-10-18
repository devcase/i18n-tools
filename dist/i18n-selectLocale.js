"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var queryString = _interopRequireWildcard(require("query-string"));

function _default(locale) {
  var parsed = queryString.parse(location.search);
  parsed = (0, _objectSpread2.default)({}, parsed, {
    locale: locale
  });
  location.search = queryString.stringify(parsed);
}