"use strict";

var babel = require("@babel/core");
var babelParser = require("@babel/parser");
var generate = require("@babel/generator").default;
var traverse = require("@babel/traverse").default;
var loaderUtils = require("loader-utils");
var promisify = require("bluebird").promisify;
const babelPluginTranslate = require("../babel-plugin-i18n-translate");

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
  if (!condition) throw new Error("Expected condition but got falsy value");
  if (typeof condition === "string") {
    return str => str.indexOf(condition) === 0;
  }
  if (typeof condition === "function") {
    return condition;
  }
  if (condition instanceof RegExp) {
    return condition.test.bind(condition);
  }
  if (Array.isArray(condition)) {
    const items = condition.map(c => normalizeCondition(c));
    return orMatcher(items);
  }
  if (typeof condition !== "object") {
    throw Error(
      "Unexcepted " +
        typeof condition +
        " when condition was expected (" +
        condition +
        ")"
    );
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

module.exports = function(content, map, meta) {
  var callback = this.async();

  const asyncFunction = async content => {
    // return 'HI'

    var options = loaderUtils.getOptions(this);
    const condition = normalizeCondition(options.conditions || (() => false));
    const resolve = promisify(this.resolve);

    const resources = {};
    const parserOpts = {
      sourceMaps: this.sourceMap,
      plugins: options.parserPlugins || [
        "jsx",
        "dynamicImport",
        "objectRestSpread",
        "classProperties",
        "optionalChaining"
      ],
      sourceType: "module",
      sourceFilename: this.resource
    };

    var ast = babelParser.parse(content, parserOpts);

    //resolve all imports (async)
    traverse(
      ast,
      createVisitor(node => {
        const request = node.value;
        resources[request] = resolve(this.context, request);
      })
    );

    //wait for all requests done
    await Promise.all(
      Object.keys(resources).map(async request => {
        resources[request] = await resources[request];
      })
    );

    //transform imports from ast
    traverse(
      ast,
      createVisitor(
        (node) => {
          var request = node.value;
          var resource = resources[node.value];
          if (resource && condition(resource)) {
            node.value = request + this.resourceQuery;
          }
        }
      )
    );

    //generate code
    //   return generate(ast, { sourceMaps: this.sourceMap }, content)
    return babel.transformFromAstSync(ast, content, {
      configFile: false,
      plugins: [[babelPluginTranslate, { locale: options.locale }]]
    });
  };

  asyncFunction(content)
    .then(({ code, map }) => callback(null, code, map, meta))
    .catch(err => callback(err));
};
