"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extractText = _interopRequireDefault(require("../extract-text"));

test("test 1", function () {
  var code = "\n        var x = \"Este texto precisa ser extra\xEDdo\"\n    ";
  var results = (0, _extractText.default)(code);
  expect(results).toHaveLength(1);
  expect(results[0]).toMatchObject({
    key: "este-texto-precisa-ser-extraido",
    value: "Este texto precisa ser extraído",
    hash: 2951570100
  });
});
test("test com jsx", function () {
  var code = "\n        import React from 'react'\n        \n        function Component(props) {\n            return <div \n                label=\"Este \xE9 um label e precisa ser extra\xEDdo\" \n                className=\"mb-2 ignorethis\"\n                max=\"3\">\n                Este texto precisa ser extra\xEDdo\n            </div>;\n        }\n    ";
  var results = (0, _extractText.default)(code);
  expect(results).toMatchSnapshot();
});