"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function findParentWithType(path, type) {
  if (path.parent && path.parent.type === type) {
    return path.parent;
  }

  if (!path.parentPath) {
    return null;
  }

  return findParentWithType(path.parentPath, type);
}

function _default(path, options) {
  var ignoredRegex = [/[a-z][A-Z]/, /[a-zA-Z]\.[a-zA-Z]/, /^http/, /^\//, /\_/, /^\./, /^\#/, /px$/, /^[A-Z][A-Z][A-Z]$/, /^(accept|acceptCharset|accessKey|action|allowFullScreen|alt|async|autoComplete|autoFocus|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|colSpan|cols|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|icon|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|manifest|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|noValidate|nonce|open|optimum|pattern|placeholder|poster|preload|profile|radioGroup|readOnly|rel|required|reversed|role|rowSpan|rows|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap)$/];
  var requiredRegex = [/[a-zA-Z]/];
  var validJsxAttributes = ["label", "value", "aria-label", "title", "placeholder"];
  var validObjectPropertyKeys = ["text", "label", "labelPlural"];
  var value = path.node.value.trim();

  if (path.node.value.match(/^i18n:/)) {
    return false;
  }

  if (findParentWithType(path, "ImportDeclaration")) return true;
  var jsxAttributeParent = findParentWithType(path, "JSXAttribute");
  var jsxAttributeParentName = jsxAttributeParent && jsxAttributeParent.name.name;
  if (jsxAttributeParentName && !validJsxAttributes.find(function (t) {
    return t === jsxAttributeParentName;
  })) return true;

  if (findParentWithType(path, "CallExpression")) {
    return true;
  }

  var objectProperty;

  if (objectProperty = findParentWithType(path, "ObjectProperty")) {
    console.log(objectProperty.key);

    if (objectProperty.key === path.node) {
      return true;
    }

    if (!validObjectPropertyKeys.find(function (k) {
      return k === objectProperty.key.value || k === objectProperty.key.name;
    })) {
      return true;
    }
  }

  if (requiredRegex.find(function (regexp) {
    return !value.match(regexp);
  })) {
    return true;
  }

  if (ignoredRegex.find(function (regexp) {
    return value.match(regexp);
  })) {
    return true;
  }

  return false;
}