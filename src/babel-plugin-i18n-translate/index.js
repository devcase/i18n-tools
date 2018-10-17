import ignorePath from '../ignore-ast-path'
import defineKey from '../define-key'
import { FluentBundle, ftl } from 'fluent';
import fs from 'fs'
import path from 'path'
import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

export default declare((api, options) => {
    let locale = options.locale || "";
    var translationsFile = locale.length > 0 ? path.join('i18n', locale, 'translations.ftl') : path.join('i18n', 'translations.ftl')
    var translationFileContents = fs.readFileSync(translationsFile, { encoding: "UTF-8"})
    const bundle = new FluentBundle(locale);
    bundle.addMessages(ftl([translationFileContents]));

    const manipulator = {
        exit(path) {
            if (!ignorePath(path)) {
                let nodevalue = path.node.value.trim();
                if (nodevalue.indexOf("i18n:") === 0) nodevalue = nodevalue.substring("i18n:".length)
                let key = defineKey(nodevalue);
                path.replaceWith(t.stringLiteral(bundle.getMessage(key) || "???"));
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