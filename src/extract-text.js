import * as babel from "@babel/core"
import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import defineKey from "./define-key";
import farmhash from 'farmhash';
import ignorePath from './ignore-ast-path';

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
            sourceType: "module",
            plugins: ["jsx", "objectRestSpread", "dynamicImport", "classProperties"]
        });
    } catch(ex) {
        throw new Error("Erro no arquivo " + filename + ": " + ex)
    }
    
    const strings = {}
    const hashmap = {}
    const ignored = {}
    

    function processStringPath(path) {

        let value = path.node.value;
        if(!value || value.trim() === "") return;


        value = value.trim();
        if(value[value.length - 1] === ":") {
            value = value.substring(0, value.length - 1);
        }
        value = value.trim();
        if(value === "") return;

        let hash = farmhash.hash32(value);
        if(!hashmap[hash]) {
            hashmap[hash] = defineKey(value);
            if(ignorePath(path)) {
                ignored[defineKey(value) + "." + hash] = value;
            } else {
                strings[defineKey(value) + "." + hash] = value;
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