"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseArgv;

var _commander = _interopRequireDefault(require("commander"));

_commander.default.option("-d, --out-dir [out]", "Compile an input directory of modules into an output directory");

function parseArgv(args) {
  //
  _commander.default.parse(args);

  var opts = _commander.default.opts();

  return opts;
}