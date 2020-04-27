import { useState, useEffect, useLayoutEffect, useContext, useReducer, useMemo, useRef } from 'react';

const f = (v, p) =>
  typeof v === 'function' ? v(p) : v

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

export const withEffect = (effect, cleanup, deps, useLayout) => p =>
  effect && (useLayout ? useLayoutEffect : useEffect)(() => {
    const id = effect(p);
    return cleanup ? (() => cleanup(p, id)) : undefined;
  }, f(deps, p));

export const withLayoutEffect = (effect, cleanup, deps) =>
  withEffect(effect, cleanup, deps, true);

const getElementsFromSelector = selector =>
  !selector ? [window] : (
    typeof selector === 'string' ? document.querySelectorAll(selector) : (
      [selector]
    )
  )

export const withEventHandler = (selector, event, handler, deps) => p =>
  useEffect(() => {
    const h = e => handler({ ...p, event: e });
    const elements = getElementsFromSelector(selector);
    elements.forEach(e => e.addEventListener(event, h));
    return () => elements.forEach(e => e.removeEventListener(event, h));
  }, f(deps, p));

export const withWindowEventHandler = (event, handler, deps) =>
  withEventHandler(null, event, handler, deps);

export const withInterval = (func, delay, deps) =>
  withEffect(
    p => setInterval(() => func(p), delay),
    (p, id) => clearInterval(id),
    f(deps, p)
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
  useMemo(() => func(p), f(deps, p));

export const withRef = (name, initialValue) => () =>
  ({ [name]: useRef(initialValue || null) });


const formatUrl = (url, params) => Object.entries(params).reduce((p, [k, v]) => p.replace(new RegExp(`{${k}}`, 'g'), v), url)
  
export const withFetch = ({ prop, method = 'get', url, params = {}, body, headers = {}, transform, done }, deps) => p =>
  useEffect(() => {
    fetch(formatUrl(url, f(params, p)), { method, headers: f(headers, p), body: f(body, p) })
      .then(r => r.json())
      .then(r => transform ? transform(r) : r)
      .then(r => done ? done(r) : p['set' + prop[0].toUpperCase() + prop.slice(1)](r))
      .catch(console.log)
  }, f(deps, p))


export const withGet = withFetch

export const withPost = (p, deps) => withFetch({ ...p, method: 'post' }, deps)