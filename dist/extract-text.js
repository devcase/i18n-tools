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

var _ignoreAstPath = _interopRequireDefault(require("./ignore-ast-path"));

function extractText(input, filename, options) {
  // let {code} = babel.transform(input, {
  //     presets: [
  //         "@babel/preset-env"
  //     ]
  // })
  var code = input;
  var ast;

  try {
    ast = babelParser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "objectRestSpread", "dynamicImport", "classProperties"]
    });
  } catch (ex) {
    throw new Error("Erro no arquivo " + filename + ": " + ex);
  }

  var strings = {};
  var hashmap = {};
  var ignored = {};

  function processStringPath(path) {
    var value = path.node.value;
    if (!value || value.trim() === "") return;
    value = value.trim();

    if (value[value.length - 1] === ":") {
      value = value.substring(0, value.length - 1);
    }

    value = value.trim();
    if (value === "") return;

    var hash = _farmhash.default.hash32(value);

    if (!hashmap[hash]) {
      value = value.indexOf("i18n:") === 0 ? value.substring(5) : value;
      var key = (0, _defineKey.default)(value);
      hashmap[hash] = key;

      if ((0, _ignoreAstPath.default)(path)) {
        ignored[key] = value;
      } else {
        strings[key] = value;
      }
    }
  }

  var visitor = {
    StringLiteral: processStringPath,
    JSXText: processStringPath
  };
  (0, _traverse.default)(ast, visitor);
  return {
    strings: strings,
    hashmap: hashmap,
    ignored: ignored
  };
}