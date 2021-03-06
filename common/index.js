"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "http", {
  enumerable: true,
  get: function get() {
    return _http.http;
  }
});
Object.defineProperty(exports, "withFetch", {
  enumerable: true,
  get: function get() {
    return _http.withFetch;
  }
});
Object.defineProperty(exports, "withGet", {
  enumerable: true,
  get: function get() {
    return _http.withGet;
  }
});
Object.defineProperty(exports, "withPost", {
  enumerable: true,
  get: function get() {
    return _http.withPost;
  }
});
Object.defineProperty(exports, "withStore", {
  enumerable: true,
  get: function get() {
    return _store.withStore;
  }
});
Object.defineProperty(exports, "Provider", {
  enumerable: true,
  get: function get() {
    return _store.Provider;
  }
});
exports.withRef = exports.withMemo = exports.withReducer = exports.withContext = exports.withInterval = exports.withWindowEventHandler = exports.withEventHandler = exports.withLayoutEffect = exports.withEffect = exports.withState = exports.compose = void 0;

var _react = require("react");

var _ramda = require("ramda");

var _utils = require("./utils");

var _http = require("./http");

var _store = require("./store");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (Comp) {
    return function (p) {
      return Comp((0, _ramda.flatten)(fns).reduce(function (r, n) {
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
    }, (0, _utils.f)(deps, p));
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
    }, (0, _utils.f)(deps, p));
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
  }, (0, _utils.f)(deps, p));
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

var withMemo = function withMemo(func, deps) {
  return function (p) {
    return (0, _react.useMemo)(function () {
      return func(p);
    }, (0, _utils.f)(deps, p));
  };
};

exports.withMemo = withMemo;

var withRef = function withRef(name, initialValue) {
  return function () {
    return _defineProperty({}, name, (0, _react.useRef)(initialValue || null));
  };
};

exports.withRef = withRef;