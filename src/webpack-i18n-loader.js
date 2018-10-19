const path = require('path')
const babel = require('@babel/core')
const loaderUtils = require('loader-utils')
const babelPluginTranslate = require('./babel-plugin-i18n-translate')

module.exports = function (content, map, meta) {
    const options = loaderUtils.getOptions(this);

    var callback = this.async();
    const loaderQuery = path.resolve(__filename) + "?" + JSON.stringify(options) +  "!"
    
    /**
     * Plugin Babel que modifica o import, forçando o uso deste loader
     * @param babel 
     */
    function transformImportsPlugin({types: t}) {
        return {
            visitor: {
                ImportDeclaration(path)  {
                    path.node.source = t.stringLiteral(loaderQuery + path.node.source.value)
                },
                CallExpression(path) {
                    if(path.node.callee.type === "Import") {
                        path.node.arguments[0].value = (loaderQuery + path.node.arguments[0].value)
                    }
                }
            }
        }
    }

    babel.transform(content, { 
        configFile: false,
        plugins: [transformImportsPlugin, [babelPluginTranslate, { "locale": options.locale}]]
    }, function(err, result) {
        if(err) {
            callback(err)
        } else {
            callback(null, result.code, map, meta)
        }
    })
};