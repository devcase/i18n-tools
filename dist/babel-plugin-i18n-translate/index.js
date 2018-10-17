"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _ignoreAstPath = _interopRequireDefault(require("../ignore-ast-path"));

var _defineKey = _interopRequireDefault(require("../define-key"));

var _fluent = require("fluent");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    h2951570100_este-texto-precisa-ser-extraido = This text must be extracted\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var bundle = new _fluent.FluentBundle('en-US');
bundle.addMessages((0, _fluent.ftl)(_templateObject()));

function _default(babel) {
  var t = babel.types;
  var manipulator = {
    exit: function exit(path) {
      if (!(0, _ignoreAstPath.default)(path)) {
        var nodevalue = path.node.value.trim();
        if (nodevalue.indexOf("i18n:") === 0) nodevalue = nodevalue.substring("i18n:".length);
        var key = (0, _defineKey.default)(nodevalue);
        path.replaceWith(t.stringLiteral(bundle.getMessage(key) || nodevalue));
        path.skip();
      }
    }
  };
  return {
    manipulateOptions: function manipulateOptions(opts, parserOpts) {
      ["jsx", "objectRestSpread", "dynamicImport", "classProperties"].forEach(function (pl) {
        return parserOpts.plugins.push(pl);
      });
    },
    visitor: {
      StringLiteral: manipulator,
      JSXText: manipulator
    }
  };
}