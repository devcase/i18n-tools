import ignorePath from '../ignore-ast-path'
import defineKey from '../define-key'
import { FluentBundle, ftl } from 'fluent';


const bundle = new FluentBundle('en-US');
bundle.addMessages(ftl`
    h2951570100_este-texto-precisa-ser-extraido = This text must be extracted
`);

export default function (babel) {
    const { types: t } = babel;

    const manipulator = {
        exit(path) {
            if (!ignorePath(path)) {
                let nodevalue = path.node.value.trim();
                if(nodevalue.indexOf("i18n:") === 0) nodevalue = nodevalue.substring("i18n:".length)
                let key = defineKey(nodevalue);
                path.replaceWith(t.stringLiteral(bundle.getMessage(key) || nodevalue));
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
}