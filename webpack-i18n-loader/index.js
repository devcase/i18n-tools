"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var babel = require('@babel/core');

var babelParser = require('@babel/parser');

var generate = require('@babel/generator').default;

var traverse = require('@babel/traverse').default;

var loaderUtils = require('loader-utils');

var promisify = require("bluebird").promisify;

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

var asyncFunction =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(content) {
    var options, condition, resolve, resources, parserOpts, ast;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = loaderUtils.getOptions(this);
            condition = normalizeCondition(options.conditions || function () {
              return false;
            });
            resolve = promisify(this.resolve);
            resources = {};
            parserOpts = {
              sourceMaps: this.sourceMap,
              plugins: ["jsx", "dynamicImport", "objectRestSpread", "classProperties"],
              sourceType: "module",
              sourceFilename: this.resource
            };
            ast = babelParser.parse(content, parserOpts); //resolve all imports (async)

            traverse(ast, createVisitor(function (node) {
              var request = node.value;
              resources[request] = resolve(this.context, request);
            }.bind(this))); //wait for all requests done

            _context2.next = 9;
            return Promise.all(Object.keys(resources).map(
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(request) {
                return _regenerator.default.wrap(function _callee$(_context) {
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
                }, _callee, this);
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
                node.value = request + this.resourceQuery;
              }
            }.bind(this))); //generate code
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
    }, _callee2, this);
  }));

  return function asyncFunction(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = function (content, map, meta) {
  var callback = this.async();
  asyncFunction.bind(this)(content).then(function (_ref3) {
    var code = _ref3.code,
        map = _ref3.map;
    return callback(null, code, map, meta);
  }).catch(function (err) {
    return callback(err);
  }); // const transformRequest = function (request) {
  //   console.log("Import encontrado: " + request)
  //   var resolved = resolveSync(this.context, request)
  //   console.log("Resolved to: " + resolved)
  //   if(resolved && condition(resolved)) {
  //     console.log("Reescrevendo: " + request +  " para " + request + this.resourceQuery)
  //     return request + this.resourceQuery
  //   } else {
  //     return request;
  //   }
  // }.bind(this);
  // /**
  //  * Plugin Babel que modifica o import, forçando o uso deste loader
  //  * @param babel
  //  */
  // return;
  // babel
  //   .transform(content, {
  //     configFile: false,
  //     parserOpts: {
  //       plugins: ["jsx", "dynamicImport"]
  //     },
  //     plugins: []
  //   }, function (err, result) {
  //     if (err) {
  //       callback(err);
  //     } else {
  //       callback(null, result.code, map, meta);
  //     }
  //   });
}; // const babel = require('@babel/core')
// const loaderUtils = require('loader-utils')
// const deasync = require('deasync');
// const babelPluginTranslate = require('../babel-plugin-i18n-translate')
// const notMatcher = matcher => {
//     return str => {
//         return !matcher(str);
//     };
// };
// const orMatcher = items => {
//     return str => {
//         for (let i = 0; i < items.length; i++) {
//             if (items[i](str)) 
//                 return true;
//             }
//         return false;
//     };
// };
// const andMatcher = items => {
//     return str => {
//         for (let i = 0; i < items.length; i++) {
//             if (!items[i](str)) 
//                 return false;
//             }
//         return true;
//     };
// };
// function normalizeCondition(condition) {
//     if (!condition) 
//         throw new Error("Expected condition but got falsy value");
//     if (typeof condition === "string") {
//         return str => str.indexOf(condition) === 0;
//     }
//     if (typeof condition === "function") {
//         return condition;
//     }
//     if (condition instanceof RegExp) {
//         return condition
//             .test
//             .bind(condition);
//     }
//     if (Array.isArray(condition)) {
//         const items = condition.map(c => normalizeCondition(c));
//         return orMatcher(items);
//     }
//     if (typeof condition !== "object") {
//         throw Error("Unexcepted " + typeof condition + " when condition was expected (" + condition + ")");
//     }
//     const matchers = [];
//     Object
//         .keys(condition)
//         .forEach(key => {
//             const value = condition[key];
//             switch (key) {
//                 case "or":
//                 case "include":
//                 case "test":
//                     if (value) 
//                         matchers.push(normalizeCondition(value));
//                     break;
//                 case "and":
//                     if (value) {
//                         const items = value.map(c => normalizeCondition(c));
//                         matchers.push(andMatcher(items));
//                     }
//                     break;
//                 case "not":
//                 case "exclude":
//                     if (value) {
//                         const matcher = normalizeCondition(value);
//                         matchers.push(notMatcher(matcher));
//                     }
//                     break;
//                 default:
//                     throw new Error("Unexcepted property " + key + " in condition");
//             }
//         });
//     if (matchers.length === 0) {
//         throw new Error("Excepted condition but got " + condition);
//     }
//     if (matchers.length === 1) {
//         return matchers[0];
//     }
//     return andMatcher(matchers);
// }
// module.exports = function (content, map, meta) {
//     var options = loaderUtils.getOptions(this);
//     var callback = this.async();
//     const condition = normalizeCondition(options.conditions || (() => true))
//     const resolve = Promise.promisify(this.resolve);
//     const transformRequest = function (request) {
//         var resolved = resolveSync(this.context, request)
//         if (resolved && condition(resolved)) {
//             return request + this.resourceQuery
//         } else {
//             return request;
//         }
//     }.bind(this);
//     /**
//        * Plugin Babel que modifica a importação de módulos, acrescentando o resourceQuery
//        * que ativou este loader
//        * @param babel
//        */
//     function transformImportsPlugin(_ref) {
//         var t = _ref.types;
//         return {
//             visitor: {
//                 ImportDeclaration: function ImportDeclaration(path) {
//                     path.node.source.value = transformRequest(path.node.source.value);
//                 },
//                 CallExpression: function CallExpression(path) {
//                     if (path.node.callee.type === "Import") {
//                         path.node.arguments[0].value = transformRequest(path.node.arguments[0].value)
//                     }
//                     if (path.node.callee.name === "require") {
//                         path.node.arguments[0].value = transformRequest(path.node.arguments[0].value)
//                     }
//                 }
//             }
//         };
//     }
//     babel
//         .transform(content, {
//         }, function (err, result) {
//             if (err) {
//                 callback(err);
//             } else {
//                 callback(null, result.code, map, meta);
//             }
//         });
// };