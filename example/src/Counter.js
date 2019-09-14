import React from 'react';
import { compose, withRedux } from 'hookompose';

const Counter = ({ count, dispatch }) =>
  <div>
    Redux counter: {count}
    <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
  </div>;

export default compose(
  withRedux(s => s.count, 'count')
)(Counter);