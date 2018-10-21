/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _level1_locale_en_US__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./level1?locale=en-US */ \"./src/level1.js?locale=en-US\");\n/* harmony import */ var _level1_locale_en_US__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_level1_locale_en_US__WEBPACK_IMPORTED_MODULE_0__);\n\r\n\r\nconsole.log(_level1_locale_en_US__WEBPACK_IMPORTED_MODULE_0___default.a)\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/level1.js?locale=en-US":
/*!************************************!*\
  !*** ./src/level1.js?locale=en-US ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from C:/Users/hirata/git/i18n-tools/src/webpack-i18n-loader/index.js):\\nC:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\src\\\\babel-plugin-i18n-translate\\\\index.js:1\\n(function (exports, require, module, __filename, __dirname) { import ignorePath from '../commons/ignore-ast-path'\\n                                                                     ^^^^^^^^^^\\n\\nSyntaxError: Unexpected identifier\\n    at new Script (vm.js:74:7)\\n    at NativeCompileCache._moduleCompile (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:226:18)\\n    at Module._compile (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:172:36)\\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)\\n    at Module.load (internal/modules/cjs/loader.js:599:32)\\n    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)\\n    at Function.Module._load (internal/modules/cjs/loader.js:530:3)\\n    at Module.require (internal/modules/cjs/loader.js:637:17)\\n    at require (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:159:20)\\n    at Object.<anonymous> (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\src\\\\webpack-i18n-loader\\\\index.js:9:30)\\n    at Module._compile (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:178:30)\\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)\\n    at Module.load (internal/modules/cjs/loader.js:599:32)\\n    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)\\n    at Function.Module._load (internal/modules/cjs/loader.js:530:3)\\n    at Module.require (internal/modules/cjs/loader.js:637:17)\\n    at require (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:159:20)\\n    at loadLoader (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\loader-runner\\\\lib\\\\loadLoader.js:13:17)\\n    at iteratePitchingLoaders (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\loader-runner\\\\lib\\\\LoaderRunner.js:169:2)\\n    at runLoaders (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\loader-runner\\\\lib\\\\LoaderRunner.js:362:2)\\n    at NormalModule.doBuild (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\webpack\\\\lib\\\\NormalModule.js:265:3)\\n    at NormalModule.build (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\webpack\\\\lib\\\\NormalModule.js:412:15)\\n    at Compilation.buildModule (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\webpack\\\\lib\\\\Compilation.js:619:10)\\n    at factory.create (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\webpack\\\\lib\\\\Compilation.js:860:14)\\n    at factory (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\webpack\\\\lib\\\\NormalModuleFactory.js:405:6)\\n    at hooks.afterResolve.callAsync (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\webpack\\\\lib\\\\NormalModuleFactory.js:155:13)\\n    at AsyncSeriesWaterfallHook.eval [as callAsync] (eval at create (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\tapable\\\\lib\\\\HookCodeFactory.js:32:10), <anonymous>:6:1)\\n    at resolver (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\webpack\\\\lib\\\\NormalModuleFactory.js:138:29)\\n    at process.nextTick (C:\\\\Users\\\\hirata\\\\git\\\\i18n-tools\\\\node_modules\\\\webpack\\\\lib\\\\NormalModuleFactory.js:342:9)\\n    at process._tickCallback (internal/process/next_tick.js:61:11)\");\n\n//# sourceURL=webpack:///./src/level1.js?");

/***/ })

/******/ });