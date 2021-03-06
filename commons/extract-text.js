"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extractText;

var babelParser = _interopRequireWildcard(require("@babel/parser"));

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _defineKey = _interopRequireDefault(require("./define-key"));

var _ignoreAstPath = _interopRequireDefault(require("./ignore-ast-path"));

var _crypto = _interopRequireDefault(require("crypto"));

function extractText(input, filename, options) {
  var code = input;
  var ast;

  try {
    ast = babelParser.parse(code, {
      sourceFilename: filename,
      sourceType: "module",
      plugins: ["jsx", "typescript", "objectRestSpread", "dynamicImport", "classProperties", "optionalChaining"]
    });
  } catch (ex) {
    throw new Error("Erro no arquivo " + filename + ": " + ex);
  }

  var strings = {};
  var hashmap = {};
  var ignored = {};
  var wordregex = /[0-9A-Za-zÀ-ÿ]/;

  function processStringPath(path) {
    var value = typeof path.node.value === "string" ? path.node.value : path.node.value.raw;
    if (!value || value.trim() === "" || !value.match(wordregex)) return;
    var limits = [value.match(wordregex).index, value.length - value.split("").reverse().join("").match(wordregex).index];
    value = value.substring(limits[0], limits[1]);
    if (value === "") return;
    value = value.indexOf("i18n:") === 0 ? value.substring(5) : value;

    var hash = _crypto["default"].createHash("sha1").update(value).digest("base64");

    if (!hashmap[hash]) {
      var key = (0, _defineKey["default"])(value);
      hashmap[hash] = key;

      if ((0, _ignoreAstPath["default"])(path)) {
        ignored[key] = value;
      } else {
        strings[key] = value;
      }
    }
  }

  var visitor = {
    StringLiteral: processStringPath,
    JSXText: processStringPath,
    TemplateElement: processStringPath
  };
  (0, _traverse["default"])(ast, visitor);
  return {
    strings: strings,
    hashmap: hashmap,
    ignored: ignored
  };
}