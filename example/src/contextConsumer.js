import React from 'react';
import { compose, withContext } from 'hookompose';
import { MyContext } from './myContext';

const ContextConsumer = ({ ctx }) =>
  <div>Context Value: {ctx.n2}</div>;

export default compose(
  withContext(MyContext, 'ctx')
)(ContextConsumer);