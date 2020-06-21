import { useEffect } from 'react';
import { isNil } from 'ramda';
import { f } from './utils';

const formatUrl = (url, params) => Object.entries(params).reduce((p, [k, v]) => p.replace(new RegExp(`{${k}}`, 'g'), v), url)

export const http = (s, a) => {
  const { path, method = 'get', url, params = {}, body, headers = {}, transform, done, isValid } = a.req(s);
  const set = (path, value) => a.dispatch('set', { path, value });

  if (isNil(isValid) || isValid) {
    set('isLoading', true);
    
    fetch(formatUrl(url, params), {
      method,
      headers,
      body: JSON.stringify(body)
    })
    .then(r => r.json())
    .then(r => transform ? transform(r, s) : r)
    .then(r => {
      done && done(r, s);
      path && set(path, r);
      set('isLoading', false);
    })
    .catch(e => {
      console.log(e);
      set('error', e);
      set('isLoading', false);
    })
  }
}

// export const withFetch = req => p =>
//   useEffect(() => http(p, req)(), f(req.deps, p))

// export const withGet = withFetch

// export const withPost = req => withFetch({ ...req, method: 'post' })