"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseArgv;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _commander = _interopRequireDefault(require("commander"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _glob = _interopRequireDefault(require("glob"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

_commander["default"].option("-d, --out-dir [out]", "Compile an input directory of modules into an output directory", "i18n");

_commander["default"].option("--delete-dir-on-start", "Delete the out directory before compilation");

function parseArgv(args) {
  //
  _commander["default"].parse(args);

  var filenames = _commander["default"].args.reduce(function (globbed, input) {
    var files = _glob["default"].sync(input);

    if (!files.length) files = [input];
    return globbed.concat(files);
  }, []);

  filenames = (0, _uniq["default"])(filenames);

  var opts = _commander["default"].opts();

  return _objectSpread(_objectSpread({}, opts), {}, {
    filenames: filenames
  });
}