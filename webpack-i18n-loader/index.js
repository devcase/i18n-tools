"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var babel = require("@babel/core");

var babelParser = require("@babel/parser");

var generate = require("@babel/generator")["default"];

var traverse = require("@babel/traverse")["default"];

var loaderUtils = require("loader-utils");

var promisify = require("bluebird").promisify;

var babelPluginTranslate = require("../babel-plugin-i18n-translate");

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

  if ((0, _typeof2["default"])(condition) !== "object") {
    throw Error("Unexcepted " + (0, _typeof2["default"])(condition) + " when condition was expected (" + condition + ")");
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

function createVisitor(nodeProcessor) {
  var t = babel.types;
  return {
    ImportDeclaration: function ImportDeclaration(path) {
      nodeProcessor(path.node.source);
    },
    CallExpression: function CallExpression(path) {
      if (path.node.callee.type === "Import") {
        nodeProcessor(path.node.arguments[0]);
      }

      if (path.node.callee.name === "require") {
        nodeProcessor(path.node.arguments[0]);
      }
    }
  };
}

module.exports = function (content, map, meta) {
  var _this = this;

  var callback = this.async();

  var asyncFunction =
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(content) {
      var options, condition, resolve, resources, parserOpts, ast;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // return 'HI'
              options = loaderUtils.getOptions(_this);
              condition = normalizeCondition(options.conditions || function () {
                return false;
              });
              resolve = promisify(_this.resolve);
              resources = {};
              parserOpts = {
                sourceMaps: _this.sourceMap,
                plugins: ["jsx", "dynamicImport", "objectRestSpread", "classProperties", "optionalChaining"],
                sourceType: "module",
                sourceFilename: _this.resource
              }; // return { code: "const x" }

              ast = babelParser.parse(content, parserOpts); //resolve all imports (async)

              traverse(ast, createVisitor(function (node) {
                var request = node.value;
                resources[request] = resolve(_this.context, request);
              })); //wait for all requests done

              _context2.next = 9;
              return Promise.all(Object.keys(resources).map(
              /*#__PURE__*/
              function () {
                var _ref2 = (0, _asyncToGenerator2["default"])(
                /*#__PURE__*/
                _regenerator["default"].mark(function _callee(request) {
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return resources[request];

                        case 2:
                          resources[request] = _context.sent;

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }()));

            case 9:
              //transform imports from ast
              traverse(ast, createVisitor(function (node) {
                var request = node.value;
                var resource = resources[node.value];

                if (resource && condition(resource)) {
                  node.value = request + _this.resourceQuery;
                }
              })); //generate code
              //   return generate(ast, { sourceMaps: this.sourceMap }, content)

              return _context2.abrupt("return", babel.transformFromAstSync(ast, content, {
                configFile: false,
                plugins: [[babelPluginTranslate, {
                  locale: options.locale
                }]]
              }));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function asyncFunction(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  asyncFunction(content).then(function (_ref3) {
    var code = _ref3.code,
        map = _ref3.map;
    return callback(null, code, map, meta);
  })["catch"](function (err) {
    return callback(err);
  });
};