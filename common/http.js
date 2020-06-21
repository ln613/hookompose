"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withPost = exports.withGet = exports.withFetch = exports.http = void 0;

var _react = require("react");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var formatUrl = function formatUrl(url, params) {
  return Object.entries(params).reduce(function (p, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return p.replace(new RegExp("{".concat(k, "}"), 'g'), v);
  }, url);
};

var http = function http(p, req) {
  return function (args) {
    var _f = (0, _utils.f)(req, args),
        path = _f.path,
        _f$method = _f.method,
        method = _f$method === void 0 ? 'get' : _f$method,
        url = _f.url,
        _f$params = _f.params,
        params = _f$params === void 0 ? {} : _f$params,
        body = _f.body,
        _f$headers = _f.headers,
        headers = _f$headers === void 0 ? {} : _f$headers,
        transform = _f.transform,
        done = _f.done,
        cond = _f.cond;

    if (!cond || cond(p)) {
      p.set('isLoading', true);
      url = (_readOnlyError("url"), formatUrl(url, (0, _utils.f)(params, p)));
      fetch(url, {
        method: method,
        headers: (0, _utils.f)(headers, p),
        body: JSON.stringify((0, _utils.f)(body, p))
      }).then(function (r) {
        return r.json();
      }).then(function (r) {
        return transform ? transform(r, p) : r;
      }).then(function (r) {
        done && done(r, p);
        path && p.set(path, r);
        p.set('isLoading', false);
      })["catch"](function (e) {
        console.log(e);
        p.set('error', e);
        p.set('isLoading', false);
      });
    }
  };
};

exports.http = http;

var withFetch = function withFetch(req) {
  return function (p) {
    return (0, _react.useEffect)(function () {
      return http(p, req)();
    }, (0, _utils.f)(req.deps, p));
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