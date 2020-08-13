import { useEffect } from 'react';
import { f } from './utils';
import { dispatchSet } from './store';

const formatUrl = (url, params) => Object.entries(params).reduce((p, [k, v]) => p.replace(new RegExp(`{${k}}`, 'g'), v), url)

export const http = ({ path, method = 'get', url, params = {}, body, headers = {}, isValid = true, transform, done }, set) => {
  if (isValid) {
    set('isLoading', true);
    
    url = formatUrl(url, params);
    fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    })
    .then(r => r.json())
    .then(r => transform ? transform(r) : r)
    .then(r => {
      done && done(r);
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

export const withFetch = req => p =>
  useEffect(() => http(req, dispatchSet(p.dispatch)), f(req.deps, p))

export const withGet = withFetch

export const withPost = req => withFetch({ ...req, method: 'post' })