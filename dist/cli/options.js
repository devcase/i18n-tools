"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseArgv;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _commander = _interopRequireDefault(require("commander"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _glob = _interopRequireDefault(require("glob"));

_commander.default.option("-d, --out-dir [out]", "Compile an input directory of modules into an output directory");

function parseArgv(args) {
  //
  _commander.default.parse(args);

  var filenames = _commander.default.args.reduce(function (globbed, input) {
    var files = _glob.default.sync(input);

    if (!files.length) files = [input];
    return globbed.concat(files);
  }, []);

  filenames = (0, _uniq.default)(filenames);

  var opts = _commander.default.opts();

  return (0, _objectSpread2.default)({}, opts, {
    filenames: filenames
  });
}