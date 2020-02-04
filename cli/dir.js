"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _fsReaddirRecursive = _interopRequireDefault(require("fs-readdir-recursive"));

var _extractText2 = _interopRequireDefault(require("../commons/extract-text"));

var _mkdirp = require("mkdirp");

function readdir(dirname, includeDotfiles, filter) {
  return (0, _fsReaddirRecursive["default"])(dirname, function (filename, _index, currentDirectory) {
    var stat = _fs["default"].statSync(_path["default"].join(currentDirectory, filename));

    if (stat.isDirectory()) return true;
    return (includeDotfiles || filename[0] !== ".") && (!filter || filter(filename));
  });
}

function deleteDir(path) {
  if (_fs["default"].existsSync(path)) {
    _fs["default"].readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;

      if (_fs["default"].lstatSync(curPath).isDirectory()) {
        // recurse
        deleteDir(curPath);
      } else {
        // delete file
        _fs["default"].unlinkSync(curPath);
      }
    });

    _fs["default"].rmdirSync(path);
  }
}

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(cliOptions) {
    var filenames, stringDest, ignoredDest, hashMapDest, getDest, handle, _handle, allstrings, allhashmap, allignored, handleFile, _handleFile;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _handleFile = function _ref6() {
              _handleFile = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee2(src, base) {
                var code, _extractText, strings, hashmap, ignored;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(_path["default"].extname(src) !== ".js")) {
                          _context2.next = 2;
                          break;
                        }

                        return _context2.abrupt("return");

                      case 2:
                        console.log("File: ".concat(src));
                        code = _fs["default"].readFileSync(src, {
                          encoding: "UTF-8"
                        });
                        _extractText = (0, _extractText2["default"])(code, src), strings = _extractText.strings, hashmap = _extractText.hashmap, ignored = _extractText.ignored;
                        Object.assign(allstrings, strings);
                        Object.assign(allhashmap, hashmap);
                        allignored[src] = ignored;

                      case 8:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _handleFile.apply(this, arguments);
            };

            handleFile = function _ref5(_x3, _x4) {
              return _handleFile.apply(this, arguments);
            };

            _handle = function _ref4() {
              _handle = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee(filenameOrDir) {
                var stat, dirname, files, filename;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (_fs["default"].existsSync(filenameOrDir)) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return", 0);

                      case 2:
                        console.log("Handling: ".concat(filenameOrDir));
                        stat = _fs["default"].statSync(filenameOrDir);

                        if (!stat.isDirectory()) {
                          _context.next = 10;
                          break;
                        }

                        dirname = filenameOrDir;
                        files = readdir(dirname, cliOptions.includeDotfiles);
                        return _context.abrupt("return", Promise.all(files.map(function (filename) {
                          var src = _path["default"].join(dirname, filename);

                          return handleFile(src, dirname);
                        })));

                      case 10:
                        filename = filenameOrDir;
                        return _context.abrupt("return", handleFile(filename, _path["default"].dirname(filename)));

                      case 12:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _handle.apply(this, arguments);
            };

            handle = function _ref3(_x2) {
              return _handle.apply(this, arguments);
            };

            getDest = function _ref2(filename, base) {
              if (cliOptions.relative) {
                return _path["default"].join(base, cliOptions.outDir, filename);
              }

              return _path["default"].join(cliOptions.outDir, filename);
            };

            filenames = cliOptions.filenames;
            (0, _mkdirp.sync)(cliOptions.outDir);
            stringDest = getDest("translations.ftl", cliOptions.outDir);
            ignoredDest = getDest("ignored.ftl", cliOptions.outDir);
            hashMapDest = getDest("hashmap.i18n", cliOptions.outDir);

            if (cliOptions.deleteDirOnStart) {
              if (_fs["default"].existsSync(stringDest)) _fs["default"].unlinkSync(stringDest);
              if (_fs["default"].existsSync(ignoredDest)) _fs["default"].unlinkSync(ignoredDest);
              if (_fs["default"].existsSync(hashMapDest)) _fs["default"].unlinkSync(hashMapDest);
            }

            allstrings = {};
            allhashmap = {};
            allignored = {};
            _context3.next = 16;
            return Promise.all(filenames.map(function (filename) {
              return handle(filename);
            }));

          case 16:
            Object.keys(allstrings).sort(function (a, b) {
              return a.substring(11).localeCompare(b.substring(11));
            }).forEach(function (key) {
              _fs["default"].appendFileSync(stringDest, "".concat(key, " = ").concat(allstrings[key], "\n"));
            });
            Object.keys(allignored).forEach(function (src) {
              _fs["default"].appendFileSync(ignoredDest, "\n\n## ".concat(src, "\n\n"));

              Object.keys(allignored[src]).sort(function (a, b) {
                return a.substring(11).localeCompare(b.substring(11));
              }).forEach(function (key) {
                _fs["default"].appendFileSync(ignoredDest, "".concat(key, " = ").concat(allignored[src][key], "\n"));
              });
            });

            _fs["default"].appendFileSync(hashMapDest, JSON.stringify(allhashmap, null, 2));

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _ref.apply(this, arguments);
}