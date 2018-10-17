import ignorePath from '../ignore-ast-path'

export default function (babel) {
    const { types: t } = babel;

    const manipulator = {
        exit(path) {
            if (!ignorePath(path)) {
                path.replaceWith(t.stringLiteral("i18n:" + path.node.value.trim()));
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