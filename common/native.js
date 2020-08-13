"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withPermission = void 0;

var Permissions = _interopRequireWildcard(require("expo-permissions"));

var _ = require("./");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var isGranted = function isGranted(r) {
  return r.status === 'granted';
};

var getPermission = function getPermission() {
  for (var _len = arguments.length, p = new Array(_len), _key = 0; _key < _len; _key++) {
    p[_key] = arguments[_key];
  }

  return Permissions.getAsync.apply(Permissions, p).then(function (r) {
    return isGranted(r) ? r : Permissions.askAsync.apply(Permissions, p);
  }).then(function (r) {
    return !isGranted(r) && Promise.reject(p + ' is not permitted.');
  });
};

var withPermission = function withPermission() {
  for (var _len2 = arguments.length, p = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    p[_key2] = arguments[_key2];
  }

  return (0, _.withEffect)(function () {
    return getPermission.apply(void 0, p);
  }, null, []);
};

exports.withPermission = withPermission;