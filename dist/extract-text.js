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

function findParentWithType(path, type) {
  if (path.parent && path.parent.type === type) {
    return path.parent;
  }

  if (!path.parentPath) {
    return null;
  }

  return findParentWithType(path.parentPath, type);
}

function ignorePath(path) {
  if (path.parent && path.parent.type === "ImportDeclaration") return true;
  var jsxAttributeParent = findParentWithType(path, "JSXAttribute");
  var jsxAttributeParentName = jsxAttributeParent && jsxAttributeParent.name.name;
  if (jsxAttributeParentName && jsxAttributeParentName !== "label" && jsxAttributeParentName !== "value" && jsxAttributeParentName !== "aria-label" && jsxAttributeParentName !== "placeholder") return true; // if(findParentWithType(path, "CallExpression")) {
  //     return true;
  // }

  var value = path.node.value.trim();

  if (value.match(/[a-zA-Z]/) === null) {
    return true;
  }

  if (value.match(/[a-z][A-Z]/) !== null) {
    return true;
  }

  if (value.indexOf("http") === 0) return true;
  if (value.indexOf("/") === 0) return true;
  if (value.indexOf("_") >= 0) return true;
  if (new Set(['accept', 'acceptCharset', 'accessKey', 'action', 'allowFullScreen', 'alt', 'async', 'autoComplete', 'autoFocus', 'autoPlay', 'capture', 'cellPadding', 'cellSpacing', 'challenge', 'charSet', 'checked', 'cite', 'classID', 'className', 'colSpan', 'cols', 'content', 'contentEditable', 'contextMenu', 'controls', 'controlsList', 'coords', 'crossOrigin', 'data', 'dateTime', 'default', 'defer', 'dir', 'disabled', 'download', 'draggable', 'encType', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'frameBorder', 'headers', 'height', 'hidden', 'high', 'href', 'hrefLang', 'htmlFor', 'httpEquiv', 'icon', 'id', 'inputMode', 'integrity', 'is', 'keyParams', 'keyType', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'manifest', 'marginHeight', 'marginWidth', 'max', 'maxLength', 'media', 'mediaGroup', 'method', 'min', 'minLength', 'multiple', 'muted', 'name', 'noValidate', 'nonce', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'profile', 'radioGroup', 'readOnly', 'rel', 'required', 'reversed', 'role', 'rowSpan', 'rows', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'spellCheck', 'src', 'srcDoc', 'srcLang', 'srcSet', 'start', 'step', 'style', 'summary', 'tabIndex', 'target', 'title', 'type', 'useMap', 'value', 'width', 'wmode', 'wrap']).has(value)) return true;
  return false;
}

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
      hashmap[hash] = (0, _defineKey.default)(value);

      if (ignorePath(path)) {
        ignored[(0, _defineKey.default)(value) + "." + hash] = value;
      } else {
        strings[(0, _defineKey.default)(value) + "." + hash] = value;
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