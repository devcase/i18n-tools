import {
  StringLiteral,
  JSXText,
  TemplateElement,
  TemplateLiteral,
  ObjectProperty,
  JSXAttribute,
  CallExpression,
  Node,
} from "@babel/types";
import { NodePath } from "@babel/traverse";

function findParentWithType<T>(path: NodePath, type): T {
  if (path.parent && path.parent.type === type) {
    return (path.parent as unknown) as T;
  }
  if (!path.parentPath) {
    return null;
  }
  return findParentWithType(path.parentPath, type);
}

export default function(
  path: NodePath<StringLiteral | JSXText | TemplateElement>
): boolean {
  //todo - pegar das opções estes parâmetros
  const ignoredRegex = [
    /[a-z][A-Z]/,
    /[a-zA-Z]\.[a-zA-Z]/,
    /^http/,
    /^\//,
    /\_/,
    /^\./,
    /^\#/,
    /px$/,
    /^[A-Z][A-Z][A-Z]$/,
    /^(accept|acceptCharset|accessKey|action|allowFullScreen|alt|async|autoComplete|autoFocus|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|colSpan|cols|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|icon|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loop|low|manifest|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|noValidate|nonce|open|optimum|pattern|placeholder|poster|preload|profile|radioGroup|readOnly|rel|required|reversed|role|rowSpan|rows|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap)$/,
  ];

  const requiredRegex = [/[a-zA-Z]/];

  const validJsxAttributes = ["label", "aria-label", "title", "placeholder"];
  const validObjectPropertyKeys = [
    "text",
    "label",
    "labelPlural",
    "hint",
    "message",
    "placeholder",
  ];
  const validCallExpressionCallees = [/NotificationManager/];

  const value =
    typeof path.node.value === "string"
      ? path.node.value.trim()
      : path.node.value.raw.trim();

  if (value.indexOf("i18n:") === 0) {
    return false;
  }

  if (requiredRegex.find((regexp) => !value.match(regexp))) {
    return true;
  }

  if (ignoredRegex.find((regexp) => value.match(regexp))) {
    return true;
  }

  if (findParentWithType(path, "ImportDeclaration")) return true;

  const jsxAttributeParent = findParentWithType<JSXAttribute>(
    path,
    "JSXAttribute"
  );
  const jsxAttributeParentName =
    jsxAttributeParent && jsxAttributeParent.name.name;

  if (jsxAttributeParentName) {
    if (validJsxAttributes.find((t) => t === jsxAttributeParentName)) {
      return false;
    }
  }

  const objectProperty = findParentWithType<ObjectProperty>(
    path,
    "ObjectProperty"
  );
  if (objectProperty) {
    if (objectProperty.key === path.node) {
      return true;
    }
    if (
      validObjectPropertyKeys.find(
        (k) => k === objectProperty.key.value || k === objectProperty.key.name
      )
    ) {
      return false;
    }
  }

  const templateParent = findParentWithType<TemplateLiteral>(
    path,
    "TemplateLiteral"
  );
  if (templateParent?.['__i18nenabled__'] || templateParent?.quasis?.[0]?.value.raw.startsWith("i18n:")) return false;

  const callExpression = findParentWithType<CallExpression>(
    path,
    "CallExpression"
  );
  if (callExpression) {
    const calleeName = !callExpression.callee
      ? undefined
      : callExpression.callee.name
        ? callExpression.callee.name
        : callExpression.callee.object && callExpression.callee.property
          ? callExpression.callee.object.name +
            "." +
            callExpression.callee.property.name
          : callExpression.callee.property
            ? callExpression.callee.property.name
            : undefined;
    if (
      validCallExpressionCallees.find(
        (c) =>
          calleeName && c instanceof RegExp
            ? calleeName.match(c)
            : c === calleeName
      )
    ) {
      return false;
    }
  }

  if (path.node.type === "JSXText") {
    return false;
  }

  return true;
}
