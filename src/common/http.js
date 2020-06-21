import { useEffect } from 'react';
import { f } from './utils';

const formatUrl = (url, params) => Object.entries(params).reduce((p, [k, v]) => p.replace(new RegExp(`{${k}}`, 'g'), v), url)

export const http = (p, req) => args => {
  const { path, method = 'get', url, params = {}, body, headers = {}, transform, done, cond } = f(req, args);
  if (!cond || cond(p)) {
    p.set('isLoading', true);
    
    url = formatUrl(url, f(params, p));
    fetch(url, {
      method,
      headers: f(headers, p),
      body: JSON.stringify(f(body, p))
    })
    .then(r => r.json())
    .then(r => transform ? transform(r, p) : r)
    .then(r => {
      done && done(r, p);
      path && p.set(path, r);
      p.set('isLoading', false);
    })
    .catch(e => {
      console.log(e);
      p.set('error', e);
      p.set('isLoading', false);
    })
  }
}

export const withFetch = req => p =>
  useEffect(() => http(p, req)(), f(req.deps, p))

export const withGet = withFetch

export const withPost = req => withFetch({ ...req, method: 'post' })