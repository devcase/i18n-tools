"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineKey = _interopRequireDefault(require("../define-key"));

test("Abraço", function () {
  expect((0, _defineKey.default)("Abraço")).toMatch("abraco");
});
test("Reserva de Hotéis", function () {
  expect((0, _defineKey.default)("Reserva de Hotéis")).toMatch("reserva-de-hoteis");
});
test("Marcadores", function () {
  expect((0, _defineKey.default)("Marcadores")).toMatch("marcadores");
});
test("Formato: +{código país}{código estado}{telefone}", function () {
  expect((0, _defineKey.default)("Formato: +{código país}{código estado}{telefone}")).toMatch("formato-codigo-pais-codigo-estado-telefone");
});