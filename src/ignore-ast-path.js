

export default function (path, options) {

    let ignoredRegex = [
        /[a-z][A-Z]/,
        /[a-zA-Z]\.[a-zA-Z]/,
        /^http/,
        /^\//,
        /\_/,
        /^\./,
        /^\#/,
        /px$/,
        /^[A-Z][A-Z][A-Z]$/,
        /^(accept|acceptCharset|accessKey|action|allowFullScreen|alt|async|autoComplete|autoFocus|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|colSpan|cols|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|icon|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|manifest|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|noValidate|nonce|open|optimum|pattern|placeholder|poster|preload|profile|radioGroup|readOnly|rel|required|reversed|role|rowSpan|rows|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap)$/
    ]

    let requiredRegex = [
        /[a-zA-Z]/
    ]

    let validJsxAttributes = ["label", "value", "aria-label", "title", "placeholder"]


    if(findParentWithType(path, "ImportDeclaration"))
        return true

    var jsxAttributeParent = findParentWithType(path, "JSXAttribute");
    var jsxAttributeParentName = jsxAttributeParent && jsxAttributeParent.name.name;

    if(jsxAttributeParentName && !validJsxAttributes.find(t => t === jsxAttributeParentName))
        return true;

    // if(findParentWithType(path, "CallExpression")) {
    //     return true;
    // }

    const value = path.node.value.trim();

    if(requiredRegex.find(regexp => !value.match(regexp))) {
        return true;
    }

    if(ignoredRegex.find(regexp => value.match(regexp))) {
        return true;
    }

    return false;
}