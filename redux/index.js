"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withRedux = exports.withDispatch = exports.withSelector = void 0;

var _reactRedux = require("react-redux");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var withSelector = function withSelector(selector, name) {
  return function (p) {
    return _defineProperty({}, name || 'state', (0, _reactRedux.useSelector)(selector));
  };
};

exports.withSelector = withSelector;

var withDispatch = function withDispatch() {
  return function (p) {
    return {
      dispatch: (0, _reactRedux.useDispatch)()
    };
  };
};

exports.withDispatch = withDispatch;

var withRedux = function withRedux(selector, name) {
  return function (p) {
    var _ref2;

    return _ref2 = {}, _defineProperty(_ref2, name || 'state', (0, _reactRedux.useSelector)(selector)), _defineProperty(_ref2, "dispatch", (0, _reactRedux.useDispatch)()), _ref2;
  };
};

exports.withRedux = withRedux;