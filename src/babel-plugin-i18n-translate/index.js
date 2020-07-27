import ignorePath from '../commons/ignore-ast-path'
import defineKey from '../commons/define-key'
import { FluentBundle, ftl } from 'fluent';
import fs from 'fs'
import path from 'path'
import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

const wordregex = /\w/

export default declare((api, options) => {
    
    let locale = options.locale;
    var getText;

    if(locale) {
        //loads translation file from `i18n/<locale>/translations.ftl`
        var translationsFile = locale.length > 0 ? path.join('i18n', locale, 'translations.ftl') : path.join('i18n', 'translations.ftl')
        var translationFileContents = fs.readFileSync(translationsFile, { encoding: "UTF-8"})

        const bundle = new FluentBundle(locale);
        bundle.addMessages(ftl([translationFileContents]));
        getText = (key, text) => bundle.getMessage(key) || text
    } else {
        getText = (key, text) => text
    }
        

    const manipulator = {
        exit(path) {
            if (!ignorePath(path)) {
                let value = path.node.extra && path.node.extra.rawValue ? path.node.extra.rawValue : path.node.value;
                if(!value || value.trim() === "" || !value.match(wordregex)) return;

                const limits = [
                    value.match(wordregex).index,
                    value.length - value.split("").reverse().join("").match(wordregex).index
                ]
                const before = value.substring(0, limits[0]);
                const after = value.substring(limits[1]);

                value = value.substring(limits[0], limits[1]);
                
                
                if (value.indexOf("i18n:") === 0) value = value.substring("i18n:".length)
                let key = defineKey(value);
                let i18nvalue = getText(key, value);

                if(i18nvalue) {
                    let newNode
                    if(t.isStringLiteral(path.node)) {
                        newNode = (t.stringLiteral(before + i18nvalue + after));
                        newNode.extra = { rawValue: before + i18nvalue + after, raw: `'${before + i18nvalue + after}'`}
                        path.replaceWith(newNode)
                    } else if(t.isJSXText(path.node)) {
                        newNode = (t.jsxText(before + i18nvalue + after));
                        path.replaceWith(newNode)
                    } else {
                        path.node.value = before + i18nvalue + after
                    }
                }
                path.skip();
            }
        }
    }

    return {
        manipulateOptions(opts, parserOpts) {
            ["jsx", "objectRestSpread", "dynamicImport", "classProperties"].forEach(pl => parserOpts.plugins.push(pl))
        },
        visitor: {
            StringLiteral: manipulator,
            JSXText: manipulator
        }
    }
})