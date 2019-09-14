import { useSelector, useDispatch } from 'react-redux';

export const withSelector = (selector, name) => p =>
  ({ [name || 'state']: useSelector(selector) });

export const withDispatch = () => p =>
  ({ dispatch: useDispatch() });
  
export const withRedux = (selector, name) => p => ({
  [name || 'state']: useSelector(selector),
  dispatch: useDispatch()
});
