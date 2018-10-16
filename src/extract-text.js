import * as babel from "@babel/core"
import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import defineKey from "./define-key";
import farmhash from 'farmhash';

function findParentWithType(path, type) {
    if(path.parent && path.parent.type === type) {
        return path.parent;
    }
    if(!path.parentPath) {
        return null;
    }
    return findParentWithType(path.parentPath, type)
}

function ignorePath (path) {
    if(path.parent && path.parent.type === "ImportDeclaration")
        return true

    var jsxAttributeParent = findParentWithType(path, "JSXAttribute");
    var jsxAttributeParentName = jsxAttributeParent && jsxAttributeParent.name.name;

    if(jsxAttributeParentName && (
            jsxAttributeParentName !== "label"
            && jsxAttributeParentName !== "value"
            && jsxAttributeParentName !== "aria-label"
            && jsxAttributeParentName !== "placeholder"
            ))
        return true;

    // if(findParentWithType(path, "CallExpression")) {
    //     return true;
    // }

    const value = path.node.value.trim();

    if(value.match(/[a-zA-Z]/) === null) {
        return true;
    }
    if(value.match(/[a-z][A-Z]/) !== null) {
        return true;
    }
    if(value.indexOf("http") === 0) return true;
    if(value.indexOf("/") === 0) return true;
    if(value.indexOf("_") >= 0) return true;
    if(new Set(['accept', 'acceptCharset', 'accessKey', 'action', 'allowFullScreen', 'alt', 'async', 'autoComplete', 'autoFocus', 'autoPlay', 'capture', 'cellPadding', 'cellSpacing', 'challenge', 'charSet', 'checked', 'cite', 'classID', 'className', 'colSpan', 'cols', 'content', 'contentEditable', 'contextMenu', 'controls', 'controlsList', 'coords', 'crossOrigin', 'data', 'dateTime', 'default', 'defer', 'dir', 'disabled', 'download', 'draggable', 'encType', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'frameBorder', 'headers', 'height', 'hidden', 'high', 'href', 'hrefLang', 'htmlFor', 'httpEquiv', 'icon', 'id', 'inputMode', 'integrity', 'is', 'keyParams', 'keyType', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'manifest', 'marginHeight', 'marginWidth', 'max', 'maxLength', 'media', 'mediaGroup', 'method', 'min', 'minLength', 'multiple', 'muted', 'name', 'noValidate', 'nonce', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'profile', 'radioGroup', 'readOnly', 'rel', 'required', 'reversed', 'role', 'rowSpan', 'rows', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'spellCheck', 'src', 'srcDoc', 'srcLang', 'srcSet', 'start', 'step', 'style', 'summary', 'tabIndex', 'target', 'title', 'type', 'useMap', 'value', 'width', 'wmode', 'wrap']).has(value))
        return true;
    
    return false;
}

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