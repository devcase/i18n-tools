"use strict";

var babel = require('@babel/core');
var babelParser = require('@babel/parser');
var generate = require('@babel/generator').default;
var traverse = require('@babel/traverse').default;
var loaderUtils = require('loader-utils');
var promisify = require("bluebird").promisify;
const babelPluginTranslate = require('../babel-plugin-i18n-translate')

const notMatcher = matcher => {
	return str => {
		return !matcher(str);
	};
};

const orMatcher = items => {
	return str => {
		for (let i = 0; i < items.length; i++) {
			if (items[i](str)) return true;
		}
		return false;
	};
};

const andMatcher = items => {
	return str => {
		for (let i = 0; i < items.length; i++) {
			if (!items[i](str)) return false;
		}
		return true;
	};
};

function normalizeCondition(condition) {
  if (!condition) 
    throw new Error("Expected condition but got falsy value");
  if (typeof condition === "string") {
    return str => str.indexOf(condition) === 0;
  }
  if (typeof condition === "function") {
    return condition;
  }
  if (condition instanceof RegExp) {
    return condition
      .test
      .bind(condition);
  }
  if (Array.isArray(condition)) {
    const items = condition.map(c => normalizeCondition(c));
    return orMatcher(items);
  }
  if (typeof condition !== "object") {
    throw Error("Unexcepted " + typeof condition + " when condition was expected (" + condition + ")");
  }
  
  const matchers = [];
  Object.keys(condition).forEach(key => {
    const value = condition[key];
    switch (key) {
      case "or":
      case "include":
      case "test":
        if (value) matchers.push(normalizeCondition(value));
        break;
      case "and":
        if (value) {
          const items = value.map(c => normalizeCondition(c));
          matchers.push(andMatcher(items));
        }
        break;
      case "not":
      case "exclude":
        if (value) {
          const matcher = normalizeCondition(value);
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
  const t = babel.types;
  return {
    ImportDeclaration: function ImportDeclaration(path) {
      nodeProcessor(path.node.source)
    },
    CallExpression: function CallExpression(path) {
      if (path.node.callee.type === "Import") {
        nodeProcessor(path.node.arguments[0])
      }
      if(path.node.callee.name === "require") {
        nodeProcessor(path.node.arguments[0])
      }
    }
  };
}

const asyncFunction = async function(content) {
  var options = loaderUtils.getOptions(this);
  const condition = normalizeCondition(options.conditions || (() => false))
  const resolve = promisify(this.resolve);

  const resources = {}
  const parserOpts = {
    sourceMaps: this.sourceMap,
    plugins: ["jsx", "dynamicImport", "objectRestSpread", "classProperties"],
    sourceType: "module",
    sourceFilename: this.resource
  }

  var ast = babelParser.parse(content, parserOpts);

  //resolve all imports (async)
  traverse(ast, createVisitor(function(node) {
    const request = node.value;
    resources[request] = resolve(this.context, request);
  }.bind(this)))

  //wait for all requests done
  await Promise.all(Object.keys(resources).map(async request => {resources[request] = await resources[request]}))

  //transform imports from ast
  traverse(ast, createVisitor(function(node) {
    var request = node.value;
    var resource = resources[node.value];
    if(resource && condition(resource)) {
      node.value = request + this.resourceQuery
    }
  }.bind(this)))

  //generate code
  //   return generate(ast, { sourceMaps: this.sourceMap }, content)
  return babel.transformFromAstSync(ast, content, {
    configFile: false,
    plugins: [[babelPluginTranslate, { locale: options.locale }]]
  })
}

module.exports = function (content, map, meta) {
  var callback = this.async();
  asyncFunction.bind(this)(content)
  .then( ({ code, map }) => callback(null, code, map, meta))
  .catch(err => callback(err));


  // const transformRequest = function (request) {
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
};

// const babel = require('@babel/core')
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