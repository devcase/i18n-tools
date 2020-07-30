"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ignoreAstPath = _interopRequireDefault(require("../commons/ignore-ast-path"));

var _defineKey = _interopRequireDefault(require("../commons/define-key"));

var _fluent = require("fluent");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var t = _interopRequireWildcard(require("@babel/types"));

var wordregex = /[0-9A-Za-zÀ-ÿ]/;

var _default = (0, _helperPluginUtils.declare)(function (api, options) {
  var locale = options.locale;
  var getText;

  if (locale) {
    //loads translation file from `i18n/<locale>/translations.ftl`
    var translationsFile = locale.length > 0 ? _path["default"].join("i18n", locale, "translations.ftl") : _path["default"].join("i18n", "translations.ftl");

    var translationFileContents = _fs["default"].readFileSync(translationsFile, {
      encoding: "utf8"
    });

    var bundle = new _fluent.FluentBundle(locale);
    bundle.addMessages((0, _fluent.ftl)([translationFileContents]));

    getText = function getText(key, text) {
      return bundle.getMessage(key) || text;
    };
  } else {
    getText = function getText(key, text) {
      return text;
    };
  }

  var manipulator = {
    exit: function exit(path) {
      if (!(0, _ignoreAstPath["default"])(path)) {
        var value = path.node.extra && path.node.extra.rawValue ? path.node.extra.rawValue : typeof path.node.value === "string" ? path.node.value : path.node.value.raw;
        if (!value || value.trim() === "" || !value.match(wordregex)) return;
        if (value.indexOf("i18n:") === 0) value = value.substring("i18n:".length);
        var limits = !value.match(wordregex) ? [0, value.length] : [value.match(wordregex).index, value.length - value.split("").reverse().join("").match(wordregex).index];
        var before = value.substring(0, limits[0]);
        var after = value.substring(limits[1]);
        value = value.substring(limits[0], limits[1]);
        var key = (0, _defineKey["default"])(value);
        var i18nvalue = getText(key, value);

        if (i18nvalue != null) {
          if (t.isStringLiteral(path.node)) {
            var newNode = t.stringLiteral(before + i18nvalue + after);
            newNode.extra = {
              rawValue: before + i18nvalue + after,
              raw: JSON.stringify(before + i18nvalue + after)
            };
            path.replaceWith(newNode);
          } else if (t.isJSXText(path.node)) {
            var _newNode = t.jsxText(before + i18nvalue + after);

            path.replaceWith(_newNode);
          } else if (t.isTemplateElement(path.node)) {
            var _newNode2 = t.templateElement({
              raw: before + i18nvalue + after
            }, path.node.tail);

            path.parent['__i18nenabled__'] = true;
            path.replaceWith(_newNode2);
          } else {
            path.node.value = before + i18nvalue + after;
          }
        }

        path.skip();
      }
    }
  };
  return {
    manipulateOptions: function manipulateOptions(opts, parserOpts) {
      ["jsx", "typescript", "optionalChaining", "objectRestSpread", "dynamicImport", "classProperties"].forEach(function (pl) {
        return parserOpts.plugins.push(pl);
      });
    },
    visitor: {
      StringLiteral: manipulator,
      JSXText: manipulator,
      TemplateElement: manipulator
    }
  };
});

exports["default"] = _default;