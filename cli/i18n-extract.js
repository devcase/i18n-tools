#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _dir = _interopRequireDefault(require("./dir"));

var _options = _interopRequireDefault(require("./options"));

var opts = (0, _options["default"])(process.argv);
(0, _dir["default"])(opts)["catch"](function (err) {
  console.error(err);
  process.exit(1);
});