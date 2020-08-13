import React, { useContext, useReducer,createContext } from 'react';
import { map } from 'ramda';
import { update } from '@ln613/ipath';
import { http, withFetch } from './http';

const RootContext = createContext();

const rootReducer = (s, a) => {
  switch (a.type) {
    case 'set':
      return update(s, a.path, a.value);
    default:
      return s;
  }
}

const commonState = {
  isLoading: false,
  error: null
}

export const Provider = ({ initialValue, children }) => {
  const [state, dispatch] = useReducer(rootReducer, {...commonState, ...initialValue});
  const d = (type, payload) => dispatch({ ...payload, type, dispatch: d })
  return (
    <RootContext.Provider value={{ state, dispatch: d }}>
      {children}
    </RootContext.Provider>
  );
}

export const dispatchSet = dispatch => (path, value) => dispatch({ type: 'set', path, value });

export const withStore = (selector, reqs) => [
  p => {
    const {state, dispatch} = useContext(RootContext);
    const set = dispatchSet(dispatch);
    return {
      ...selector(state),
      dispatch,
      set,
      ...map(f => p => http(f(p), set), reqs)
    };
  },
  ...Object.entries(reqs)
    .filter(([k]) => k.slice(0, 1) === '_')
    .map(([k, v]) => withFetch(v))
]