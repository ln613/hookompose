import { useState, useEffect, useLayoutEffect, useContext, useReducer, useCallback, useMemo, useRef } from 'react';

export const compose = (...fns) => Comp => p =>
  Comp({ ...fns.reduce((r, n) => ({ ...r, ...n(r) }), p) });

export const withState = (name, value) => p => {
  if (!name) return {};

  const s = useState(value);
  return {
    [name]: s[0],
    ['set' + name[0].toUpperCase() + name.slice(1)]: s[1]
  };
}

const getDeps = (deps, p) =>
  deps ? deps.map(x => p[x]) : Object.values(p);

export const withEffect = (effect, cleanup, deps, useLayout) => p =>
  effect && (useLayout ? useLayoutEffect : useEffect)(() => {
    const id = effect(p);
    return cleanup ? (() => cleanup(p, id)) : undefined;
  }, getDeps(deps, p));

export const withLayoutEffect = (effect, cleanup, deps) =>
  withEffect(effect, cleanup, deps, true);

export const withEventHandler = (event, handler) => p =>
  useEffect(() => {
    const h = e => handler({ ...p, targetValue: e.target.value });
    window.addEventListener(event, h);
    return () => window.removeEventListener(event, h);
  }, []);

export const withContext = (context, name) => p =>
  ({ [name || 'context']: useContext(context) });

export const withReducer = (reducer, initialValue, stateName, dispatchName) => p => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  return {
    [stateName || 'state']: state,
    [dispatchName || 'dispatch']: dispatch
  };
};

export const withCallback = (callbacks, deps) => p =>
  Object.fromEntries(
    Object.entries(callbacks).map(([key, value]) =>
      [key, useCallback(value(p), getDeps(deps, p))]
    )
  );

export const withMemo = (func, deps) => p =>
  useMemo(() => func(p), getDeps(deps, p));

export const withRef = (name, initialValue) => () =>
  ({ [name]: useRef(initialValue || null) });
