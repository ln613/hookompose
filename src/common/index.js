import { useState, useEffect, useLayoutEffect, useContext, useReducer, useMemo, useRef } from 'react';

export const compose = (...fns) => Comp => p =>
  Comp(fns.reduce((r, n) => ({ ...r, ...n(r) }), p));

export const withState = (name, value) => p => {
  if (!name) return {};

  const s = useState(value);
  return {
    [name]: s[0],
    ['set' + name[0].toUpperCase() + name.slice(1)]: s[1]
  };
}

const getDeps = (deps, p) =>
  deps
    ? (typeof deps === 'function'
      ? deps(p)
      : deps.map(x => p[x]))
    : null;

export const withEffect = (effect, cleanup, deps, useLayout) => p =>
  effect && (useLayout ? useLayoutEffect : useEffect)(() => {
    const id = effect(p);
    return cleanup ? (() => cleanup(p, id)) : undefined;
  }, getDeps(deps, p));

export const withLayoutEffect = (effect, cleanup, deps) =>
  withEffect(effect, cleanup, deps, true);

export const withEventHandler = (selector, event, handler, deps) => p =>
  useEffect(() => {
    const h = e => handler({ ...p, event: e });
    const elements = selector ? document.querySelectorAll(selector) : [window];
    elements.forEach(e => e.addEventListener(event, h));
    return () => elements.forEach(e => e.removeEventListener(event, h));
  }, getDeps(deps, p));

export const withWindowEventHandler = (event, handler, deps) =>
  withEventHandler(null, event, handler, deps);

export const withInterval = (func, delay, deps) =>
  withEffect(
    p => setInterval(() => func(p), delay),
    (p, id) => clearInterval(id),
    deps
  );

export const withContext = (context, name) => p =>
  ({ [name || 'context']: useContext(context) });

export const withReducer = (reducer, initialValue, stateName, dispatchName) => p => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  return {
    [stateName || 'state']: state,
    [dispatchName || 'dispatch']: dispatch
  };
};

export const withMemo = (func, deps) => p =>
  useMemo(() => func(p), getDeps(deps, p));

export const withRef = (name, initialValue) => () =>
  ({ [name]: useRef(initialValue || null) });