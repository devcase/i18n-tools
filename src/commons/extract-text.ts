import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import defineKey from "./define-key";
import ignorePath from './ignore-ast-path';
import crypto from 'crypto'

export default function extractText(input, filename, options) {
    // let {code} = babel.transform(input, {
    //     presets: [
    //         "@babel/preset-env"
    //     ]
    // })
    let code = input;

    var ast;
    try {
        ast = babelParser.parse(code, {
            sourceFilename: filename,
            sourceType: "module",
            plugins: ["jsx", "typescript", "objectRestSpread", "dynamicImport", "classProperties", "optionalChaining"]
        });
    } catch(ex) {
        throw new Error("Erro no arquivo " + filename + ": " + ex)
    }
    
    const strings = {}
    const hashmap = {}
    const ignored = {}
    const wordregex = /[0-9A-Za-zÀ-ÿ]/

    function processStringPath(path) {

        let value = path.node.value;
        if(!value || value.trim() === "" || !value.match(wordregex)) return;

        
        var limits = [
            value.match(wordregex).index,
            value.length - value.split("").reverse().join("").match(wordregex).index
        ]
        value = value.substring(limits[0], limits[1]);

        if(value === "") return;

        value = value.indexOf("i18n:") === 0 ? value.substring(5): value
        let hash = crypto.createHash('sha1').update(value).digest('base64');
        
        if(!hashmap[hash]) {
            let key = defineKey(value);
            hashmap[hash] = key;
            if(ignorePath(path)) {
                ignored[key] = value;
            } else {
                strings[key] = value;
            }
        }
    }
    
    const visitor = {
        StringLiteral: processStringPath,
        JSXText: processStringPath
    };
    traverse(ast, visitor);
    
    return {strings, hashmap, ignored}
}