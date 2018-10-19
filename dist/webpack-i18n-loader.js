"use strict";

var path = require('path');

var babel = require('@babel/core');

var loaderUtils = require('loader-utils');

var babelPluginTranslate = require('./babel-plugin-i18n-translate');

module.exports = function (content, map, meta) {
  var options = loaderUtils.getOptions(this);
  if (this.resourcePath.match(/node_modules/)) return content;
  var callback = this.async();
  var loaderQuery = path.resolve(__filename) + "?" + JSON.stringify(options) + "!";
  /**
   * Plugin Babel que modifica o import, forçando o uso deste loader
   * @param babel 
   */

  function transformImportsPlugin(_ref) {
    var t = _ref.types;
    return {
      visitor: {
        ImportDeclaration: function ImportDeclaration(path) {
          path.node.source = t.stringLiteral(loaderQuery + path.node.source.value);
        },
        CallExpression: function CallExpression(path) {
          if (path.node.callee.type === "Import") {
            path.node.arguments[0].value = loaderQuery + path.node.arguments[0].value;
          }
        }
      }
    };
  }

  babel.transform(content, {
    configFile: false,
    plugins: [transformImportsPlugin, [babelPluginTranslate, {
      "locale": options.locale
    }]]
  }, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result.code, map, meta);
    }
  });
};