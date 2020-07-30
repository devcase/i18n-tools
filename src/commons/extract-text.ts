import * as babelParser from "@babel/parser";
import traverse, { Visitor, NodePath } from "@babel/traverse";
import defineKey from "./define-key";
import ignorePath from "./ignore-ast-path";
import crypto from "crypto";
import { StringLiteral, JSXText, TemplateElement } from "@babel/types";

export default function extractText(input, filename, options) {
  const code = input;

  let ast;
  try {
    ast = babelParser.parse(code, {
      sourceFilename: filename,
      sourceType: "module",
      plugins: [
        "jsx",
        "typescript",
        "objectRestSpread",
        "dynamicImport",
        "classProperties",
        "optionalChaining",
      ],
    });
  } catch (ex) {
    throw new Error("Erro no arquivo " + filename + ": " + ex);
  }

  const strings = {};
  const hashmap = {};
  const ignored = {};
  const wordregex = /[0-9A-Za-zÀ-ÿ]/;

  function processStringPath(
    path: NodePath<StringLiteral | JSXText | TemplateElement>
  ) {
    let value =
      typeof path.node.value === "string"
        ? path.node.value
        : path.node.value.raw;
    if (!value || value.trim() === "" || !value.match(wordregex)) return;

    const limits = [
      value.match(wordregex).index,
      value.length -
        value
          .split("")
          .reverse()
          .join("")
          .match(wordregex).index,
    ];
    value = value.substring(limits[0], limits[1]);

    if (value === "") return;

    value = value.indexOf("i18n:") === 0 ? value.substring(5) : value;
    const hash = crypto
      .createHash("sha1")
      .update(value)
      .digest("base64");

    if (!hashmap[hash]) {
      const key = defineKey(value);
      hashmap[hash] = key;
      if (ignorePath(path)) {
        ignored[key] = value;
      } else {
        strings[key] = value;
      }
    }
  }

  const visitor: Visitor = {
    StringLiteral: processStringPath,
    JSXText: processStringPath,
    TemplateElement: processStringPath,
  };
  traverse(ast, visitor);

  return { strings, hashmap, ignored };
}
