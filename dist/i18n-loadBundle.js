"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _fluentLangneg = require("fluent-langneg");

var queryString = _interopRequireWildcard(require("query-string"));

function _default(availableLocales) {
  var parsed = queryString.parse(location.search);
  var supportedLocales = (0, _fluentLangneg.negotiateLanguages)(parsed.locale ? [parsed.locale].concat((0, _toConsumableArray2.default)(navigator.languages)) : navigator.languages, // requested locales
  availableLocales // available locales
  );
  var locale = supportedLocales[0];
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.charset = 'utf-8';
  script.timeout = 120;
  script.src = locale + "/" + locale + ".bundle.js";
  head.appendChild(script);
}