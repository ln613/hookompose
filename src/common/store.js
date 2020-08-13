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

export const withStore = (selector, reqs) => [
  p => {
    const {state, dispatch} = useContext(RootContext);
    const set = (path, value) => dispatch({ type: 'set', path, value });
    return {
      ...selector(state),
      set,
      ...map(f => p => http(f(p)), reqs)
    };
  },
  ...Object.values(reqs)
    .filter(x => x.deps)
    .map(withFetch)
]