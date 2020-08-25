"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _core = require("@babel/core");

var _parser = require("@babel/parser");

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _bluebird = require("bluebird");

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _babelPluginI18nTranslate = _interopRequireDefault(require("../babel-plugin-i18n-translate"));

// const babelParser = require("@babel/parser");
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
  return {
    ImportDeclaration: function ImportDeclaration(path) {
      nodeProcessor(path.node.source);
    },
    ExportDeclaration: function ExportDeclaration(path) {
      if (path.node.source) {
        nodeProcessor(path.node.source);
      }
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

var I18nLoader = function I18nLoader(content, map) {
  var _this = this;

  var callback = this.async();

  var options = _loaderUtils["default"].getOptions(this);

  var condition = normalizeCondition(options.conditions || function () {
    return false;
  });
  var resolve = (0, _bluebird.promisify)(this.resolve);
  var parserOpts = {
    plugins: options.parserPlugins || ["jsx", "dynamicImport", "objectRestSpread", "classProperties", "optionalChaining"],
    sourceType: "module",
    sourceFilename: this.resource
  };
  var ast = (0, _parser.parse)(content, parserOpts);

  var doStuff =
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(content) {
      var promises, visitNode;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              promises = [];

              visitNode =
              /*#__PURE__*/
              function () {
                var _ref2 = (0, _asyncToGenerator2["default"])(
                /*#__PURE__*/
                _regenerator["default"].mark(function _callee(node) {
                  var request, resource;
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          request = node.value;
                          _context.next = 3;
                          return resolve(_this.context, request);

                        case 3:
                          resource = _context.sent;

                          if (resource && condition(resource)) {
                            node.value = request + _this.resourceQuery;
                          }

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function visitNode(_x2) {
                  return _ref2.apply(this, arguments);
                };
              }(); //resolve all imports (async)


              (0, _traverse["default"])(ast, createVisitor(function (node) {
                promises.push(visitNode(node));
              })); //wait for all requests done

              _context2.next = 5;
              return Promise.all(promises);

            case 5:
              return _context2.abrupt("return", (0, _core.transformFromAstSync)(ast, content, {
                configFile: false,
                plugins: [[_babelPluginI18nTranslate["default"], {
                  locale: options.locale
                }]]
              }));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function doStuff(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  doStuff(content).then(function (_ref3) {
    var code = _ref3.code,
        map = _ref3.map;
    return callback(null, code, map);
  })["catch"](function (err) {
    return callback(err);
  });
};

I18nLoader.raw = false;
module.exports = I18nLoader;