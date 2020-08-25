"use strict";

import { transformFromAstSync } from "@babel/core";
// const babelParser = require("@babel/parser");
import { parse, ParserOptions } from "@babel/parser";
import traverse from "@babel/traverse";
import { promisify } from "bluebird";
import loaderUtils from "loader-utils";
import babelPluginTranslate from "../babel-plugin-i18n-translate";
import { loader } from "webpack";

const notMatcher = (matcher) => {
  return (str) => {
    return !matcher(str);
  };
};

const orMatcher = (items) => {
  return (str) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i](str)) return true;
    }
    return false;
  };
};

const andMatcher = (items) => {
  return (str) => {
    for (let i = 0; i < items.length; i++) {
      if (!items[i](str)) return false;
    }
    return true;
  };
};

function normalizeCondition(condition) {
  if (!condition) throw new Error("Expected condition but got falsy value");
  if (typeof condition === "string") {
    return (str) => str.indexOf(condition) === 0;
  }
  if (typeof condition === "function") {
    return condition;
  }
  if (condition instanceof RegExp) {
    return condition.test.bind(condition);
  }
  if (Array.isArray(condition)) {
    const items = condition.map((c) => normalizeCondition(c));
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
  Object.keys(condition).forEach((key) => {
    const value = condition[key];
    switch (key) {
      case "or":
      case "include":
      case "test":
        if (value) matchers.push(normalizeCondition(value));
        break;
      case "and":
        if (value) {
          const items = value.map((c) => normalizeCondition(c));
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
  return {
    ImportDeclaration: function ImportDeclaration(path) {
      nodeProcessor(path.node.source);
    },
    ExportDeclaration: function(path) {
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
    },
  };
}

const I18nLoader: loader.Loader = function(this, content, map) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this);
  const condition = normalizeCondition(options.conditions || (() => false));
  const resolve = promisify(this.resolve);
  const parserOpts: ParserOptions = {
    plugins: options.parserPlugins || [
      "jsx",
      "dynamicImport",
      "objectRestSpread",
      "classProperties",
      "optionalChaining",
    ],
    sourceType: "module",
    sourceFilename: this.resource,
  };
  const ast = parse(content, parserOpts);

  const doStuff = async (content) => {
    const promises = [];
    const visitNode = async (node) => {
      const request = node.value;
      const resource = await resolve(this.context, request);
      if (resource && condition(resource)) {
        node.value = request + this.resourceQuery;
      }
    };

    //resolve all imports (async)
    traverse(
      ast,
      createVisitor((node) => {
        promises.push(visitNode(node));
      })
    );
    //wait for all requests done
    await Promise.all(promises);

    //generate code
    //   return generate(ast, { sourceMaps: this.sourceMap }, content)
    return transformFromAstSync(ast, content, {
      configFile: false,
      plugins: [[babelPluginTranslate, { locale: options.locale }]],
    });
  };

  doStuff(content)
    .then(({ code, map }) => callback(null, code, map))
    .catch((err) => callback(err));
};
I18nLoader.raw = false

module.exports = I18nLoader;
