"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function findParentWithType(path, type) {
  if (path.parent && path.parent.type === type) {
    return path.parent;
  }

  if (!path.parentPath) {
    return null;
  }

  return findParentWithType(path.parentPath, type);
}

function _default(path) {
  var _templateParent$quasi, _templateParent$quasi2;

  //todo - pegar das opções estes parâmetros
  var ignoredRegex = [/[a-z][A-Z]/, /[a-zA-Z]\.[a-zA-Z]/, /^http/, /^\//, /\_/, /^\./, /^\#/, /px$/, /^[A-Z][A-Z][A-Z]$/, /^(accept|acceptCharset|accessKey|action|allowFullScreen|alt|async|autoComplete|autoFocus|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|colSpan|cols|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|icon|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|manifest|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|noValidate|nonce|open|optimum|pattern|placeholder|poster|preload|profile|radioGroup|readOnly|rel|required|reversed|role|rowSpan|rows|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap)$/];
  var requiredRegex = [/[a-zA-Z]/];
  var validJsxAttributes = ["label", "aria-label", "title", "placeholder"];
  var validObjectPropertyKeys = ["text", "label", "labelPlural", "hint", "message", "placeholder"];
  var validCallExpressionCallees = [/NotificationManager/];
  var value = typeof path.node.value === "string" ? path.node.value.trim() : path.node.value.raw.trim();

  if (value.indexOf("i18n:") === 0) {
    return false;
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

  if (findParentWithType(path, "ImportDeclaration")) return true;
  var jsxAttributeParent = findParentWithType(path, "JSXAttribute");
  var jsxAttributeParentName = jsxAttributeParent && jsxAttributeParent.name.name;

  if (jsxAttributeParentName) {
    if (validJsxAttributes.find(function (t) {
      return t === jsxAttributeParentName;
    })) {
      return false;
    }
  }

  var objectProperty = findParentWithType(path, "ObjectProperty");

  if (objectProperty) {
    if (objectProperty.key === path.node) {
      return true;
    }

    if (validObjectPropertyKeys.find(function (k) {
      return k === objectProperty.key.value || k === objectProperty.key.name;
    })) {
      return false;
    }
  }

  var templateParent = findParentWithType(path, "TemplateLiteral");
  if ((templateParent === null || templateParent === void 0 ? void 0 : templateParent['__i18nenabled__']) || (templateParent === null || templateParent === void 0 ? void 0 : (_templateParent$quasi = templateParent.quasis) === null || _templateParent$quasi === void 0 ? void 0 : (_templateParent$quasi2 = _templateParent$quasi[0]) === null || _templateParent$quasi2 === void 0 ? void 0 : _templateParent$quasi2.value.raw.startsWith("i18n:"))) return false;
  var callExpression = findParentWithType(path, "CallExpression");

  if (callExpression) {
    var calleeName = !callExpression.callee ? undefined : callExpression.callee.name ? callExpression.callee.name : callExpression.callee.object && callExpression.callee.property ? callExpression.callee.object.name + "." + callExpression.callee.property.name : callExpression.callee.property ? callExpression.callee.property.name : undefined;

    if (validCallExpressionCallees.find(function (c) {
      return calleeName && c instanceof RegExp ? calleeName.match(c) : c === calleeName;
    })) {
      return false;
    }
  }

  if (path.node.type === "JSXText") {
    return false;
  }

  return true;
}