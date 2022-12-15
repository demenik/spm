/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Spm"] = factory();
	else
		root["Spm"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/Cache.ts":
/*!******************************!*\
  !*** ./src/classes/Cache.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Cache {\n    constructor(name) {\n        const fm = FileManager.iCloud();\n        const spmPath = fm.joinPath(fm.documentsDirectory(), \"spm\");\n        this.filename = name + \".json\";\n        this.dir = fm.joinPath(spmPath, \"cache\");\n        this.path = fm.joinPath(this.dir, this.filename);\n    }\n    set(data) {\n        const fm = FileManager.iCloud();\n        if (!fm.fileExists(this.dir)) {\n            fm.createDirectory(this.dir);\n        }\n        fm.writeString(this.path, JSON.stringify(data, null, 2));\n    }\n    get() {\n        const fm = FileManager.iCloud();\n        if (!fm.fileExists(this.path)) {\n            return {};\n        }\n        return JSON.parse(fm.readString(this.path));\n    }\n    exists() {\n        const fm = FileManager.iCloud();\n        return fm.fileExists(this.path);\n    }\n    getKey(key) {\n        const data = this.get();\n        return data[key];\n    }\n    setKey(key, value) {\n        const data = this.get();\n        data[key] = value;\n        this.set(data);\n    }\n    deleteKey(key) {\n        const data = this.get();\n        delete data[key];\n        this.set(data);\n    }\n}\nexports[\"default\"] = Cache;\n\n\n//# sourceURL=webpack://Spm/./src/classes/Cache.ts?");

/***/ }),

/***/ "./src/classes/Config.ts":
/*!*******************************!*\
  !*** ./src/classes/Config.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Cache_1 = __webpack_require__(/*! ./Cache */ \"./src/classes/Cache.ts\");\nclass Config extends Cache_1.default {\n    constructor(name, defaults) {\n        super(name);\n        this.defaults = defaults;\n        const fm = FileManager.iCloud();\n        const spmPath = fm.joinPath(fm.documentsDirectory(), \"spm\");\n        this.dir = fm.joinPath(spmPath, \"config\");\n        this.path = fm.joinPath(this.dir, this.filename);\n        // Create config file with defaults, if it doesn't exist\n        if (!this.exists()) {\n            this.set(defaults);\n        }\n    }\n}\nexports[\"default\"] = Config;\n\n\n//# sourceURL=webpack://Spm/./src/classes/Config.ts?");

/***/ }),

/***/ "./src/classes/Package.ts":
/*!********************************!*\
  !*** ./src/classes/Package.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Console_1 = __webpack_require__(/*! ../utils/Console */ \"./src/utils/Console.ts\");\nconst Request_1 = __webpack_require__(/*! ./Request */ \"./src/classes/Request.ts\");\nclass Package {\n    constructor(author, name, version) {\n        this.packageId = `${author}>${name}>${version}`;\n        this.author = author;\n        this.name = name;\n        this.version = version;\n    }\n    async fetchPackageInfo() {\n        const url = `https://raw.githubusercontent.com/demenik/spm/main/packages/${this.author}/${this.name}/spm.json`;\n        const data = await new Request_1.default(url).loadJSON();\n        const version = data.versions[this.version];\n        if (!version) {\n            throw new Error(\"Version not found\");\n        }\n        this.url = `https://raw.githubusercontent.com/demenik/spm/main/packages/${this.author}/${this.name}/${version.file}`;\n        this.description = data.description;\n    }\n    async fetchFileData(force = false) {\n        if (this.fileData && !force) {\n            return this.fileData;\n        }\n        if (!this.url) {\n            await this.fetchPackageInfo();\n        }\n        this.fileData = await new Request_1.default(this.url).loadString();\n        return this.fileData;\n    }\n    async installFile() {\n        const fm = FileManager.iCloud();\n        const spmPath = fm.joinPath(fm.documentsDirectory(), \"spm\");\n        const path = fm.joinPath(spmPath, `${this.packageId}.js`);\n        if (!fm.fileExists(spmPath)) {\n            fm.createDirectory(spmPath);\n        }\n        // Check if file exists\n        if (fm.fileExists(path)) {\n            return path;\n        }\n        Console_1.default.log(`${this.author}>${this.name}>${this.version} : downloading...`);\n        await this.fetchFileData();\n        fm.writeString(path, this.fileData);\n        Console_1.default.log(`${this.author}>${this.name}>${this.version} : downloaded`);\n        return path;\n    }\n    async import() {\n        const path = await this.installFile();\n        return importModule(path);\n    }\n}\nexports[\"default\"] = Package;\n\n\n//# sourceURL=webpack://Spm/./src/classes/Package.ts?");

/***/ }),

/***/ "./src/classes/Request.ts":
/*!********************************!*\
  !*** ./src/classes/Request.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass _Request {\n    constructor(url, method = \"GET\", headers = {}) {\n        this.request = new Request(url);\n        this.request.method = method;\n        this.request.headers = headers;\n    }\n    checkStatus(req) {\n        const response = req.response;\n        if (response.statusCode >= 400) {\n            throw new Error(`Request failed with status code ${response.statusCode} for ${response.url}`);\n        }\n        else if (response.statusCode >= 300) {\n            throw new Error(`Request redirected with status code ${response.statusCode} for ${response.url}`);\n        }\n        else if (response.statusCode >= 200) {\n            return;\n        }\n        else {\n            throw new Error(`Request failed with unknown status code ${response.statusCode} for ${response.url}`);\n        }\n    }\n    async loadJSON() {\n        const req = this.request;\n        const response = await req.loadJSON();\n        this.checkStatus(req);\n        return response;\n    }\n    async loadString() {\n        const req = this.request;\n        const response = await req.loadString();\n        this.checkStatus(req);\n        return response;\n    }\n}\nexports[\"default\"] = _Request;\n\n\n//# sourceURL=webpack://Spm/./src/classes/Request.ts?");

/***/ }),

/***/ "./src/package/index.ts":
/*!******************************!*\
  !*** ./src/package/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Cache_1 = __webpack_require__(/*! ../classes/Cache */ \"./src/classes/Cache.ts\");\nconst Package_1 = __webpack_require__(/*! ../classes/Package */ \"./src/classes/Package.ts\");\nconst Console_1 = __webpack_require__(/*! ../utils/Console */ \"./src/utils/Console.ts\");\nconst purge_1 = __webpack_require__(/*! ./purge */ \"./src/package/purge.ts\");\nexports[\"default\"] = {\n    version: \"0.0.7\",\n    purgeCache: new Cache_1.default(\"purge\"),\n    async import(author, name, version) {\n        this.purgeCache.setKey(`${author}>${name}>${version}`, Date.now());\n        const _package = new Package_1.default(author, name, version);\n        const _import = await _package.import();\n        Console_1.default.log(`${author}>${name}>${version} : imported`);\n        return _import;\n    },\n};\n// Delete packages that haven't been used in a week\n(0, purge_1.default)();\n\n\n//# sourceURL=webpack://Spm/./src/package/index.ts?");

/***/ }),

/***/ "./src/package/purge.ts":
/*!******************************!*\
  !*** ./src/package/purge.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Cache_1 = __webpack_require__(/*! ../classes/Cache */ \"./src/classes/Cache.ts\");\nconst Config_1 = __webpack_require__(/*! ../classes/Config */ \"./src/classes/Config.ts\");\nconst Console_1 = __webpack_require__(/*! ../utils/Console */ \"./src/utils/Console.ts\");\nfunction purge() {\n    // Package cache\n    const cache = new Cache_1.default(\"purge\");\n    const packages = cache.get();\n    // Purge config\n    const config = new Config_1.default(\"purge\", {\n        enablePurge: true,\n        deleteAfterDays: 7, // 1 week\n    });\n    const enablePurge = config.getKey(\"enablePurge\");\n    const deleteAfter = config.getKey(\"deleteAfterDays\") * 24 * 60 * 60 * 1000;\n    if (!enablePurge) {\n        Console_1.default.warn(\"Purge is disabled. This will cause packages to pile up. To enable purge, set 'purgeEnabled' in 'spm/config/purge.json' to 'true'.\");\n        return;\n    }\n    const fm = FileManager.iCloud();\n    const spmPath = fm.joinPath(fm.documentsDirectory(), \"spm\");\n    for (const [name, timestamp] of Object.entries(packages)) {\n        if (timestamp + deleteAfter < Date.now()) {\n            cache.deleteKey(name);\n            fm.remove(fm.joinPath(spmPath, name + \".js\"));\n            Console_1.default.log(`purge : ${name} was last used ${new Date(timestamp).toLocaleString()}, and therefore has been deleted.`);\n        }\n    }\n    Console_1.default.log(\"purge : completed\");\n}\nexports[\"default\"] = purge;\n\n\n//# sourceURL=webpack://Spm/./src/package/purge.ts?");

/***/ }),

/***/ "./src/utils/Console.ts":
/*!******************************!*\
  !*** ./src/utils/Console.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports[\"default\"] = {\n    log(m) {\n        console.log(`[spm] ${m}`);\n    },\n    warn(m) {\n        console.warn(`[spm] ${m}`);\n    },\n    error(m) {\n        console.error(`[spm] ${m}`);\n    },\n};\n\n\n//# sourceURL=webpack://Spm/./src/utils/Console.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/package/index.ts");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});