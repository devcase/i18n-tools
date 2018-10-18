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
  var wordregex = /\w/;

  function processStringPath(path) {
    var value = path.node.value;
    if (!value || value.trim() === "" || !value.match(wordregex)) return;
    var limits = [value.match(wordregex).index, value.length - value.split("").reverse().join("").match(wordregex).index];
    value = value.substring(limits[0], limits[1]);
    if (value === "") return;
    value = value.indexOf("i18n:") === 0 ? value.substring(5) : value;

    var hash = _farmhash.default.hash32(value);

    if (!hashmap[hash]) {
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