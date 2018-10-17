

function findParentWithType(path, type) {
    if(path.parent && path.parent.type === type) {
        return path.parent;
    }
    if(!path.parentPath) {
        return null;
    }
    return findParentWithType(path.parentPath, type)
}

export default function (path, options) {

    //todo - pegar das opções estes parâmetros
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

    let validJsxAttributes = ["label", "aria-label", "title", "placeholder"]
    let validObjectPropertyKeys = ["text", "label", "labelPlural", "hint", "message", "placeholder"]
    let validCallExpressionCallees = [/NotificationManager/]

    const value = path.node.value.trim();

    if(path.node.value.match(/^i18n:/)) {
        return false;
    }

    if(findParentWithType(path, "ImportDeclaration"))
        return true;

    var jsxAttributeParent = findParentWithType(path, "JSXAttribute");
    var jsxAttributeParentName = jsxAttributeParent && jsxAttributeParent.name.name;

    var _return = true;

    if(jsxAttributeParentName) {
        if(validJsxAttributes.find(t => t === jsxAttributeParentName)) {
            return false;
        } else {
            _return = true;
        }
    } 

    var objectProperty;
    if(objectProperty = findParentWithType(path, "ObjectProperty")) {
        if(objectProperty.key === path.node) {
            return true;
        }
        if(validObjectPropertyKeys.find(k => k === objectProperty.key.value || k === objectProperty.key.name)) {
            return false;
        } else {
            _return = true;
        }
    }
    
    var callExpression
    if(callExpression = findParentWithType(path, "CallExpression")) {
        var calleeName = !callExpression.callee ? undefined 
            : callExpression.callee.name ? callExpression.callee.name
            : callExpression.callee.object && callExpression.callee.property ? callExpression.callee.object.name + "." + callExpression.callee.property.name
            : callExpression.callee.property ? callExpression.callee.property.name
            : undefined
        if(validCallExpressionCallees.find(c => calleeName && c instanceof RegExp ? calleeName.match(c) : c === calleeName)) {
            return false;
        } else {
            _return = true;
        }
    }

    if(requiredRegex.find(regexp => !value.match(regexp))) {
        return true;
    }

    if(ignoredRegex.find(regexp => value.match(regexp))) {
        return true;
    }

    if(path.node.type === "JSXText") {
        return false;
    }

    return _return;
}