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

var wordregex = /\w/;

var _default = (0, _helperPluginUtils.declare)(function (api, options) {
  var locale = options.locale || "";
  var translationsFile = locale.length > 0 ? _path.default.join('i18n', locale, 'translations.ftl') : _path.default.join('i18n', 'translations.ftl');

  var translationFileContents = _fs.default.readFileSync(translationsFile, {
    encoding: "UTF-8"
  });

  var bundle = new _fluent.FluentBundle(locale);
  bundle.addMessages((0, _fluent.ftl)([translationFileContents]));
  var manipulator = {
    exit: function exit(path) {
      if (!(0, _ignoreAstPath.default)(path)) {
        var value = path.node.value;
        if (!value || value.trim() === "" || !value.match(wordregex)) return;
        var limits = [value.match(wordregex).index, value.length - value.split("").reverse().join("").match(wordregex).index];
        var before = value.substring(0, limits[0]);
        var after = value.substring(limits[1]);
        value = value.substring(limits[0], limits[1]);
        if (value.indexOf("i18n:") === 0) value = value.substring("i18n:".length);
        var key = (0, _defineKey.default)(value);
        var i18nvalue = bundle.getMessage(key);

        if (i18nvalue) {
          path.replaceWith(_core.types.stringLiteral(before + i18nvalue + after));
        }

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