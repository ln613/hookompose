"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.f = void 0;

var f = function f(v, p) {
  return typeof v === 'function' ? v(p) : v;
};

exports.f = f;