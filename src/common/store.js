import React, { useContext, useReducer,createContext } from 'react';
import { map } from 'ramda';
import { set as _set } from 'lodash/fp';
import { http, withFetch } from './http';

const RootContext = createContext();

const rootReducer = (s, a) => {
  switch (a.type) {
    case 'set':
      return _set(a.path, a.value, s);
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
  return (
    <RootContext.Provider value={{ state, dispatch }}>
      {children}
    </RootContext.Provider>
  );
}

export const withStore = (selector, reqs) => [
  p => {
    const {state, dispatch} = useContext(RootContext);
    return {
      ...selector(state),
      set: (path, value) => dispatch({ type: 'set', path, value }),
      ...map(http, reqs)
    };
  },
  ...Object.values(reqs)
    .filter(x => x.deps)
    .map(withFetch)
]