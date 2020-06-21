import React, { useContext, useReducer,createContext } from 'react';
import { map } from 'ramda';
import { update } from '@ln613/ipath';
import { http, withFetch } from './http';

const RootContext = createContext();

const rootReducer = (s, a) => {
  switch (a.type) {
    case 'set':
      return update(s, a.path, a.value);
    case 'api':
      http(s, a);
      return s;
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
  const d = (type, payload) => dispatch({ ...payload, type, dispatch })
  return (
    <RootContext.Provider value={{ state, dispatch: d }}>
      {children}
    </RootContext.Provider>
  );
}

export const withStore = (selector, reqs) => [
  p => {
    const {state, dispatch} = useContext(RootContext);
    return {
      ...selector(state),
      set: (path, value) => dispatch('set', { path, value }),
      api: req => dispatch('api', { req }),
      //...map(r => http(p, r), reqs)
    };
  },
  // ...Object.values(reqs)
  //   .filter(x => x.deps)
  //   .map(withFetch)
]