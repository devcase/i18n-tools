"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slash = _interopRequireDefault(require("slash"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _fsReaddirRecursive = _interopRequireDefault(require("fs-readdir-recursive"));

var _extractText2 = _interopRequireDefault(require("../extract-text"));

function readdir(dirname, includeDotfiles, filter) {
  return (0, _fsReaddirRecursive.default)(dirname, function (filename, _index, currentDirectory) {
    var stat = _fs.default.statSync(_path.default.join(currentDirectory, filename));

    if (stat.isDirectory()) return true;
    return (includeDotfiles || filename[0] !== ".") && (!filter || filter(filename));
  });
}

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(cliOptions) {
    var filenames, handle, _handle, allstrings, allhashmap, handleFile, _handleFile;

    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _handleFile = function _ref5() {
              _handleFile = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee2(src, base) {
                var code, _extractText, strings, hashmap;

                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        code = _fs.default.readFileSync(src, {
                          encoding: "UTF-8"
                        });
                        _extractText = (0, _extractText2.default)(code), strings = _extractText.strings, hashmap = _extractText.hashmap;
                        Object.assign(allstrings, strings);
                        Object.assign(allhashmap, hashmap);

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));
              return _handleFile.apply(this, arguments);
            };

            handleFile = function _ref4(_x3, _x4) {
              return _handleFile.apply(this, arguments);
            };

            _handle = function _ref3() {
              _handle = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(filenameOrDir) {
                var stat, dirname, files, filename;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (_fs.default.existsSync(filenameOrDir)) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return", 0);

                      case 2:
                        stat = _fs.default.statSync(filenameOrDir);

                        if (!stat.isDirectory()) {
                          _context.next = 9;
                          break;
                        }

                        dirname = filenameOrDir;
                        files = readdir(dirname, cliOptions.includeDotfiles);
                        return _context.abrupt("return", Promise.all(files.map(function (filename) {
                          var src = _path.default.join(dirname, filename);

                          return handleFile(src, dirname);
                        })));

                      case 9:
                        filename = filenameOrDir;
                        return _context.abrupt("return", handleFile(filename, _path.default.dirname(filename)));

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));
              return _handle.apply(this, arguments);
            };

            handle = function _ref2(_x2) {
              return _handle.apply(this, arguments);
            };

            filenames = cliOptions.filenames;
            allstrings = {};
            allhashmap = {};
            _context3.next = 9;
            return Promise.all(filenames.map(function (filename) {
              return handle(filename);
            }));

          case 9:
            console.log(allstrings);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _ref.apply(this, arguments);
}