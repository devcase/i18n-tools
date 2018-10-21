"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var babel = require('@babel/core');

var loaderUtils = require('loader-utils');

var deasync = require('deasync');

var babelPluginTranslate = require('../babel-plugin-i18n-translate');

var notMatcher = function notMatcher(matcher) {
  return function (str) {
    return !matcher(str);
  };
};

var orMatcher = function orMatcher(items) {
  return function (str) {
    for (var i = 0; i < items.length; i++) {
      if (items[i](str)) return true;
    }

    return false;
  };
};

var andMatcher = function andMatcher(items) {
  return function (str) {
    for (var i = 0; i < items.length; i++) {
      if (!items[i](str)) return false;
    }

    return true;
  };
};

function normalizeCondition(condition) {
  if (!condition) throw new Error("Expected condition but got falsy value");

  if (typeof condition === "string") {
    return function (str) {
      return str.indexOf(condition) === 0;
    };
  }

  if (typeof condition === "function") {
    return condition;
  }

  if (condition instanceof RegExp) {
    return condition.test.bind(condition);
  }

  if (Array.isArray(condition)) {
    var items = condition.map(function (c) {
      return normalizeCondition(c);
    });
    return orMatcher(items);
  }

  if ((0, _typeof2.default)(condition) !== "object") {
    throw Error("Unexcepted " + (0, _typeof2.default)(condition) + " when condition was expected (" + condition + ")");
  }

  var matchers = [];
  Object.keys(condition).forEach(function (key) {
    var value = condition[key];

    switch (key) {
      case "or":
      case "include":
      case "test":
        if (value) matchers.push(normalizeCondition(value));
        break;

      case "and":
        if (value) {
          var _items = value.map(function (c) {
            return normalizeCondition(c);
          });

          matchers.push(andMatcher(_items));
        }

        break;

      case "not":
      case "exclude":
        if (value) {
          var matcher = normalizeCondition(value);
          matchers.push(notMatcher(matcher));
        }

        break;

      default:
        throw new Error("Unexcepted property " + key + " in condition");
    }
  });

  if (matchers.length === 0) {
    throw new Error("Excepted condition but got " + condition);
  }

  if (matchers.length === 1) {
    return matchers[0];
  }

  return andMatcher(matchers);
}

module.exports = function (content, map, meta) {
  var options = loaderUtils.getOptions(this);
  var callback = this.async();
  var condition = normalizeCondition(options.conditions || function () {
    return true;
  });
  var resolveSync = deasync(this.resolve);

  var transformRequest = function (request) {
    var resolved = resolveSync(this.context, request);

    if (resolved && condition(resolved)) {
      return request + this.resourceQuery;
    } else {
      return request;
    }
  }.bind(this);
  /**
     * Plugin Babel que modifica o import, forçando o uso deste loader
     * @param babel
     */


  function transformImportsPlugin(_ref) {
    var t = _ref.types;
    return {
      visitor: {
        ImportDeclaration: function ImportDeclaration(path) {
          path.node.source.value = transformRequest(path.node.source.value);
        },
        CallExpression: function CallExpression(path) {
          if (path.node.callee.type === "Import") {
            path.node.arguments[0].value = transformRequest(path.node.arguments[0].value);
          }

          if (path.node.callee.name === "require") {
            path.node.arguments[0].value = transformRequest(path.node.arguments[0].value);
          }
        }
      }
    };
  }

  babel.transform(content, {
    configFile: false,
    parserOpts: {
      plugins: ["jsx", "dynamicImports"]
    },
    plugins: [transformImportsPlugin, [babelPluginTranslate, {
      locale: options.locale
    }]]
  }, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result.code, map, meta);
    }
  });
};