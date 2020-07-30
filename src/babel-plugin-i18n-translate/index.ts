import ignorePath from "../commons/ignore-ast-path";
import defineKey from "../commons/define-key";
import { FluentBundle, ftl } from "fluent";
import fs from "fs";
import path from "path";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";
import { StringLiteral, JSXText, TemplateElement } from "@babel/types";
import { NodePath } from "@babel/traverse";

const wordregex = /[0-9A-Za-zÀ-ÿ]/;

export default declare((api, options) => {
  const locale = options.locale;
  let getText;

  if (locale) {
    //loads translation file from `i18n/<locale>/translations.ftl`
    const translationsFile =
      locale.length > 0
        ? path.join("i18n", locale, "translations.ftl")
        : path.join("i18n", "translations.ftl");
    const translationFileContents = fs.readFileSync(translationsFile, {
      encoding: "utf8",
    });

    const bundle = new FluentBundle(locale);
    bundle.addMessages(ftl([translationFileContents]));
    getText = (key, text) => bundle.getMessage(key) || text;
  } else {
    getText = (key, text) => text;
  }

  const manipulator = {
    exit(path: NodePath<StringLiteral | JSXText | TemplateElement>) {
      if (!ignorePath(path)) {
        let value: string =
          path.node.extra && path.node.extra.rawValue
            ? path.node.extra.rawValue
            : typeof path.node.value === "string"
              ? path.node.value
              : path.node.value.raw;
        if (!value || value.trim() === "" || !value.match(wordregex)) return;

        if (value.indexOf("i18n:") === 0)
          value = value.substring("i18n:".length);
        const limits = !value.match(wordregex)
          ? [0, value.length]
          : [
              value.match(wordregex).index,
              value.length -
                value
                  .split("")
                  .reverse()
                  .join("")
                  .match(wordregex).index,
            ];
        const before = value.substring(0, limits[0]);
        const after = value.substring(limits[1]);
        value = value.substring(limits[0], limits[1]);

        const key = defineKey(value);
        const i18nvalue = getText(key, value);

        if (i18nvalue != null) {
          if (t.isStringLiteral(path.node)) {
            const newNode = t.stringLiteral(before + i18nvalue + after);
            newNode.extra = {
              rawValue: before + i18nvalue + after,
              raw: JSON.stringify(before + i18nvalue + after),
            };
            path.replaceWith(newNode);
          } else if (t.isJSXText(path.node)) {
            const newNode = t.jsxText(before + i18nvalue + after);
            path.replaceWith(newNode);
          } else if (t.isTemplateElement(path.node)) {
            const newNode = t.templateElement(
              { raw: before + i18nvalue + after },
              path.node.tail
            );
            path.parent['__i18nenabled__'] = true
            path.replaceWith(newNode);
          } else {
            path.node.value = before + i18nvalue + after;
          }
        }
        path.skip();
      }
    },
  };

  return {
    manipulateOptions(opts, parserOpts) {
      [
        "jsx",
        "typescript",
        "optionalChaining",
        "objectRestSpread",
        "dynamicImport",
        "classProperties",
      ].forEach((pl) => parserOpts.plugins.push(pl));
    },
    visitor: {
      StringLiteral: manipulator,
      JSXText: manipulator,
      TemplateElement: manipulator,
    },
  };
});
