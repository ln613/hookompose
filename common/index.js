"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withPost = exports.withGet = exports.withFetch = exports.withRef = exports.withMemo = exports.withStore = exports.Provider = exports.withReducer = exports.withContext = exports.withInterval = exports.withWindowEventHandler = exports.withEventHandler = exports.withLayoutEffect = exports.withEffect = exports.withState = exports.compose = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fp = require("lodash/fp");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var f = function f(v, p) {
  return typeof v === 'function' ? v(p) : v;
};

var RootContext = (0, _react.createContext)();

var rootReducer = function rootReducer(s, a) {
  switch (a.type) {
    case 'set':
      return (0, _fp.set)(a.path, a.value, s);

    default:
      return s;
  }
};

var compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (Comp) {
    return function (p) {
      return Comp(fns.reduce(function (r, n) {
        return _objectSpread({}, r, {}, n(r));
      }, p));
    };
  };
};

exports.compose = compose;

var withState = function withState(name, value) {
  return function (p) {
    var _ref;

    if (!name) return {};
    var s = (0, _react.useState)(value);
    return _ref = {}, _defineProperty(_ref, name, s[0]), _defineProperty(_ref, 'set' + name[0].toUpperCase() + name.slice(1), s[1]), _ref;
  };
};

exports.withState = withState;

var withEffect = function withEffect(effect, cleanup, deps, useLayout) {
  return function (p) {
    return effect && (useLayout ? _react.useLayoutEffect : _react.useEffect)(function () {
      var id = effect(p);
      return cleanup ? function () {
        return cleanup(p, id);
      } : undefined;
    }, f(deps, p));
  };
};

exports.withEffect = withEffect;

var withLayoutEffect = function withLayoutEffect(effect, cleanup, deps) {
  return withEffect(effect, cleanup, deps, true);
};

exports.withLayoutEffect = withLayoutEffect;

var getElementsFromSelector = function getElementsFromSelector(selector) {
  return !selector ? [window] : typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
};

var withEventHandler = function withEventHandler(selector, event, handler, deps) {
  return function (p) {
    return (0, _react.useEffect)(function () {
      var h = function h(e) {
        return handler(_objectSpread({}, p, {
          event: e
        }));
      };

      var elements = getElementsFromSelector(selector);
      elements.forEach(function (e) {
        return e.addEventListener(event, h);
      });
      return function () {
        return elements.forEach(function (e) {
          return e.removeEventListener(event, h);
        });
      };
    }, f(deps, p));
  };
};

exports.withEventHandler = withEventHandler;

var withWindowEventHandler = function withWindowEventHandler(event, handler, deps) {
  return withEventHandler(null, event, handler, deps);
};

exports.withWindowEventHandler = withWindowEventHandler;

var withInterval = function withInterval(func, delay, deps) {
  return withEffect(function (p) {
    return setInterval(function () {
      return func(p);
    }, delay);
  }, function (p, id) {
    return clearInterval(id);
  }, f(deps, p));
};

exports.withInterval = withInterval;

var withContext = function withContext(context, name) {
  return function (p) {
    return _defineProperty({}, name || 'context', (0, _react.useContext)(context));
  };
};

exports.withContext = withContext;

var withReducer = function withReducer(reducer, initialValue, stateName, dispatchName) {
  return function (p) {
    var _ref3;

    var _useReducer = (0, _react.useReducer)(reducer, initialValue),
        _useReducer2 = _slicedToArray(_useReducer, 2),
        state = _useReducer2[0],
        dispatch = _useReducer2[1];

    return _ref3 = {}, _defineProperty(_ref3, stateName || 'state', state), _defineProperty(_ref3, dispatchName || 'dispatch', dispatch), _ref3;
  };
};

exports.withReducer = withReducer;
var commonState = {
  isLoading: false,
  error: null
};

var Provider = function Provider(_ref4) {
  var initialValue = _ref4.initialValue,
      children = _ref4.children;

  var _useReducer3 = (0, _react.useReducer)(rootReducer, _objectSpread({}, commonState, {}, initialValue)),
      _useReducer4 = _slicedToArray(_useReducer3, 2),
      state = _useReducer4[0],
      dispatch = _useReducer4[1];

  return /*#__PURE__*/_react["default"].createElement(RootContext.Provider, {
    value: {
      state: state,
      dispatch: dispatch
    }
  }, children);
};

exports.Provider = Provider;

var withStore = function withStore(selector) {
  return function (p) {
    var _useContext = (0, _react.useContext)(RootContext),
        state = _useContext.state,
        dispatch = _useContext.dispatch;

    return _objectSpread({}, selector(state), {
      set: function set(path, value) {
        return dispatch({
          type: 'set',
          path: path,
          value: value
        });
      }
    });
  };
};

exports.withStore = withStore;

var withMemo = function withMemo(func, deps) {
  return function (p) {
    return (0, _react.useMemo)(function () {
      return func(p);
    }, f(deps, p));
  };
};

exports.withMemo = withMemo;

var withRef = function withRef(name, initialValue) {
  return function () {
    return _defineProperty({}, name, (0, _react.useRef)(initialValue || null));
  };
};

exports.withRef = withRef;

var formatUrl = function formatUrl(url, params) {
  return Object.entries(params).reduce(function (p, _ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        k = _ref7[0],
        v = _ref7[1];

    return p.replace(new RegExp("{".concat(k, "}"), 'g'), v);
  }, url);
};

var withFetch = function withFetch(_ref8, deps) {
  var prop = _ref8.prop,
      _ref8$method = _ref8.method,
      method = _ref8$method === void 0 ? 'get' : _ref8$method,
      url = _ref8.url,
      _ref8$params = _ref8.params,
      params = _ref8$params === void 0 ? {} : _ref8$params,
      body = _ref8.body,
      _ref8$headers = _ref8.headers,
      headers = _ref8$headers === void 0 ? {} : _ref8$headers,
      transform = _ref8.transform,
      done = _ref8.done,
      cond = _ref8.cond;
  return function (p) {
    return (0, _react.useEffect)(function () {
      if (!cond || cond(p)) {
        p.set('isLoading', true);
        url = formatUrl(url, f(params, p));
        fetch(url, {
          method: method,
          headers: f(headers, p),
          body: JSON.stringify(f(body, p))
        }).then(function (r) {
          return r.json();
        }).then(function (r) {
          return transform ? transform(r, p) : r;
        }).then(function (r) {
          console.log("request ".concat(url, " finished."));
          done && done(r, p);
          prop && p['set' + prop[0].toUpperCase() + prop.slice(1)](r);
          p.set('isLoading', false);
        })["catch"](function (e) {
          console.log(e);
          p.set('error', e);
          p.set('isLoading', false);
        });
      }
    }, f(deps, p));
  };
};

exports.withFetch = withFetch;
var withGet = withFetch;
exports.withGet = withGet;

var withPost = function withPost(p, deps) {
  return withFetch(_objectSpread({}, p, {
    method: 'post'
  }), deps);
};

exports.withPost = withPost;