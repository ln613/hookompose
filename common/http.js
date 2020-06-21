"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.http = void 0;

var _react = require("react");

var _ramda = require("ramda");

var _utils = require("./utils");

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

var http = function http(s, a) {
  var _a$req = a.req(s),
      path = _a$req.path,
      _a$req$method = _a$req.method,
      method = _a$req$method === void 0 ? 'get' : _a$req$method,
      url = _a$req.url,
      _a$req$params = _a$req.params,
      params = _a$req$params === void 0 ? {} : _a$req$params,
      body = _a$req.body,
      _a$req$headers = _a$req.headers,
      headers = _a$req$headers === void 0 ? {} : _a$req$headers,
      transform = _a$req.transform,
      done = _a$req.done,
      isValid = _a$req.isValid;

  var set = function set(path, value) {
    return a.dispatch('set', {
      path: path,
      value: value
    });
  };

  if ((0, _ramda.isNil)(isValid) || isValid) {
    set('isLoading', true);
    fetch(formatUrl(url, params), {
      method: method,
      headers: headers,
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json();
    }).then(function (r) {
      return transform ? transform(r, s) : r;
    }).then(function (r) {
      done && done(r, s);
      path && set(path, r);
      set('isLoading', false);
    })["catch"](function (e) {
      console.log(e);
      set('error', e);
      set('isLoading', false);
    });
  }
}; // export const withFetch = req => p =>
//   useEffect(() => http(p, req)(), f(req.deps, p))
// export const withGet = withFetch
// export const withPost = req => withFetch({ ...req, method: 'post' })


exports.http = http;