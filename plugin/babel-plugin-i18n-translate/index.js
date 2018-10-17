"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ignoreAstPath = _interopRequireDefault(require("../ignore-ast-path"));

var _defineKey = _interopRequireDefault(require("../define-key"));

var _fluent = require("fluent");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _core = require("@babel/core");

var _default = (0, _helperPluginUtils.declare)(function (api, options) {
  var locale = options.locale || "";

  var translationsFile = _path.default.join('i18n', 'translations' + (locale ? "." + locale : "") + '.ftl');

  var translationFileContents = _fs.default.readFileSync(translationsFile, {
    encoding: "UTF-8"
  });

  console.log(locale);
  console.log(translationFileContents);
  var bundle = new _fluent.FluentBundle(locale);
  bundle.addMessages((0, _fluent.ftl)([translationFileContents]));
  console.log(bundle.getMessage("h3527609692_ex-nome-sobrenome-nome-setor-nome"));
  var manipulator = {
    exit: function exit(path) {
      if (!(0, _ignoreAstPath.default)(path)) {
        var nodevalue = path.node.value.trim();
        if (nodevalue.indexOf("i18n:") === 0) nodevalue = nodevalue.substring("i18n:".length);
        var key = (0, _defineKey.default)(nodevalue);
        path.replaceWith(_core.types.stringLiteral(bundle.getMessage(key) || "???"));
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
});

exports.default = _default;