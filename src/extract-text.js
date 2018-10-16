import * as babel from "@babel/core"
import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import defineKey from "./define-key";
import farmhash from 'farmhash';

function ignorePath (path) {
    if(path.parent) {
        if(
            path.parent.type === "ImportDeclaration"
            || (path.parent.name && path.parent.type === "JSXAttribute" && path.parent.name.name === "className")
        )
            return true
    }

    if(path.node.value.match(/\a/) === null) {
        return true;
    }
    
    return false;
}

export default function extractText(input) {
    // let {code} = babel.transform(input, {
    //     presets: [
    //         "@babel/preset-env"
    //     ]
    // })
    let code = input;

    const options = {
        sourceType: "module",
        plugins: ["jsx", "objectRestSpread"]
    }
    const ast = babelParser.parse(code, options);
    const strings = {}
    const hashmap = {}
    

    function processStringPath(path) {
        if(ignorePath(path)) {
            return;
        }

        let value = path.node.value;
        value = value.trim();
        if(value[value.length - 1] === ":") {
            value = value.substring(0, value.lenght - 1);
        }
        let hash = farmhash.hash32(value);
        if(!hashmap[hash]) {
            strings[defineKey(value)] = value;
            hashmap[hash] = value
        }
    }
    
    const visitor = {
        StringLiteral: processStringPath,
        JSXText: processStringPath
    };
    traverse(ast, visitor);
    
    return {strings, hashmap}
}