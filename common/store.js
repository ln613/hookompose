"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withStore = exports.Provider = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ramda = require("ramda");

var _ipath = require("@ln613/ipath");

var _http = require("./http");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var RootContext =
/*#__PURE__*/
(0, _react.createContext)();

var rootReducer = function rootReducer(s, a) {
  switch (a.type) {
    case 'set':
      return (0, _ipath.update)(s, a.path, a.value);

    case 'api':
      (0, _http.http)(s, a);
      return s;

    default:
      return s;
  }
};

var commonState = {
  isLoading: false,
  error: null
};

var Provider = function Provider(_ref) {
  var initialValue = _ref.initialValue,
      children = _ref.children;

  var _useReducer = (0, _react.useReducer)(rootReducer, _objectSpread({}, commonState, {}, initialValue)),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var d = function d(type, payload) {
    return dispatch(_objectSpread({}, payload, {
      type: type,
      dispatch: d
    }));
  };

  return (
    /*#__PURE__*/
    _react["default"].createElement(RootContext.Provider, {
      value: {
        state: state,
        dispatch: d
      }
    }, children)
  );
};

exports.Provider = Provider;

var withStore = function withStore(selector, reqs) {
  return [function (p) {
    var _useContext = (0, _react.useContext)(RootContext),
        state = _useContext.state,
        dispatch = _useContext.dispatch;

    return _objectSpread({}, selector(state), {
      set: function set(path, value) {
        return dispatch('set', {
          path: path,
          value: value
        });
      },
      api: function api(req) {
        return dispatch('api', {
          req: req
        });
      } //...map(r => http(p, r), reqs)

    });
  } // ...Object.values(reqs)
  //   .filter(x => x.deps)
  //   .map(withFetch)
  ];
};

exports.withStore = withStore;