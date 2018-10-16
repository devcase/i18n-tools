"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractText;

var babel = _interopRequireWildcard(require("@babel/core"));

var babelParser = _interopRequireWildcard(require("@babel/parser"));

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _defineKey = _interopRequireDefault(require("./define-key"));

var _farmhash = _interopRequireDefault(require("farmhash"));

function ignorePath(path) {
  if (path.parent) {
    if (path.parent.type === "ImportDeclaration" || path.parent.name && path.parent.type === "JSXAttribute" && path.parent.name.name === "className") return true;
  }

  if (path.node.value.match(/\a/) === null) {
    return true;
  }

  return false;
}

function extractText(input) {
  // let {code} = babel.transform(input, {
  //     presets: [
  //         "@babel/preset-env"
  //     ]
  // })
  var code = input;
  var options = {
    sourceType: "module",
    plugins: ["jsx"]
  };
  var ast = babelParser.parse(code, options);
  var strings = [];
  var hashset = new Set();

  function processStringPath(path) {
    if (ignorePath(path)) {
      return;
    }

    var value = path.node.value;
    value = value.trim();

    if (value[value.length - 1] === ":") {
      value = value.substring(0, value.lenght - 1);
    }

    var hash = _farmhash.default.hash32(value);

    if (!hashset.has(hash)) {
      strings.push({
        key: (0, _defineKey.default)(value),
        value: value,
        hash: hash
      });
    }
  }

  var visitor = {
    StringLiteral: processStringPath,
    JSXText: processStringPath
  };
  (0, _traverse.default)(ast, visitor);
  return strings;
}