"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withPost = exports.withGet = exports.withFetch = exports.http = void 0;

var _react = require("react");

var _utils = require("./utils");

var _store = require("./store");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var formatUrl = function formatUrl(url, params) {
  return Object.entries(params).reduce(function (p, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return p.replace(new RegExp("{".concat(k, "}"), 'g'), v);
  }, url);
};

var http = function http(_ref3, set) {
  var path = _ref3.path,
      _ref3$method = _ref3.method,
      method = _ref3$method === void 0 ? 'get' : _ref3$method,
      url = _ref3.url,
      _ref3$params = _ref3.params,
      params = _ref3$params === void 0 ? {} : _ref3$params,
      body = _ref3.body,
      _ref3$headers = _ref3.headers,
      headers = _ref3$headers === void 0 ? {} : _ref3$headers,
      _ref3$isValid = _ref3.isValid,
      isValid = _ref3$isValid === void 0 ? true : _ref3$isValid,
      transform = _ref3.transform,
      done = _ref3.done;

  if (isValid) {
    set('isLoading', true);
    url = formatUrl(url, params);
    fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json();
    }).then(function (r) {
      return transform ? transform(r) : r;
    }).then(function (r) {
      done && done(r);
      path && set(path, r);
      set('isLoading', false);
    })["catch"](function (e) {
      console.log(e);
      set('error', e);
      set('isLoading', false);
    });
  }
};

exports.http = http;

var withFetch = function withFetch(req) {
  return function (p) {
    var opt = (0, _utils.f)(req, p);
    if (opt.deps) (0, _react.useEffect)(function () {
      return http(opt, (0, _store.dispatchSet)(p.dispatch));
    }, (0, _utils.f)(opt.deps, p));
  };
};

exports.withFetch = withFetch;
var withGet = withFetch;
exports.withGet = withGet;

var withPost = function withPost(req) {
  return withFetch(_objectSpread({}, req, {
    method: 'post'
  }));
};

exports.withPost = withPost;