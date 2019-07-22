import React from 'react';
import { compose, withContext } from 'hookompose';
import { MyContext } from './context';

const ContextConsumer = ({ ctx }) =>
  <div>Context Value: {ctx.n2}</div>;

export default compose(
  withContext(MyContext, 'ctx')
)(ContextConsumer);