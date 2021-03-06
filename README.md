# hookompose

React _hooks_ allow you to use local states and effects in a functional component, but your functional component is no longer pure.

_Recompose_ serves the same purpose as hooks by providing enhancer functions (which are higher order components) to enhance your pure functional components with local states and effects. Your functional component is kept pure, but recompose suffers the HOC wrapper hell.

_Hookompose_ allows you to call hook functions in a recompose style, giving you the best of both worlds.

This is how you use the hook function useState and useEffect:

```js
const App = () => {
  const [name, setName] = useState('Mary');
  const [surname, setSurname] = useState('Poppins');
  useEffect(() => { document.title = name + ' ' + surname; });

  return (
    <>
      Name: <input value={name} onChange={e => setName(e.target.value)} />
      Surname: <input value={surname} onChange={e => setSurname(e.target.value)} />
    </>
  );
}

export default App;
```

This is how you use the hookompose function withState and withEffect:

```js
import { compose, withState, withEffect } from 'hookompose';

const App = ({ name, setName, surname, setSurname }) =>
  <>
    Name: <input value={name} onChange={e => setName(e.target.value)} />
    Surname: <input value={surname} onChange={e => setSurname(e.target.value)} />
  </>;

export default compose(
  withState('name', 'Mary'),
  withState('surname', 'Poppins'),
  withEffect(p => document.title = p.name + ' ' + p.surname)
)(App);
```

The App component is now a stateless, pure presentational component, local states become props. This is exactly the same style as recompose, but using hooks, thus no wrapper hell.

The _withState_, _withEffect_ are just wrapper functions of the corresponding hook functions (_useState_, _useEffect_). They call the corresponding hook functions and return the result as an object containing new props. The _compose_ function is a HOC, it takes the props of the presentational component, run it through all the enhancer functions and return a new component with the enhanced props.

Hookompose provides a list of wrapper functions, one for each hook function, but you can use any function (which takes the current props as input and return an object containing new props) as an enhancer.

The order of the enhancer functions are important, the new props just added are available to the next enhancer function.

[This post](https://medium.com/@ln613/use-react-hooks-in-recompose-style-50446043eb23) gives a detailed explanation on the implementation of the _compose_ and _enhancer functions_.

## Docs


### `withState`

_withState_ takes two arguments, state name (required) and initial value. It calls _useState_ and returns the name/setName pair as object. To simplify the argument list, the name of the setter is automatically generated.

```js
  withState('surname', 'Poppins') // returns { surname: ..., setSurname: ... }
```


### `withEffect`

_withEffect_ takes four arguments, the _effect_ function (required), the _cleanup_ function, the _dependency_ list and a boolean value _useLayout_ indicating whether to use _useLayoutEffect_ or _useEffect_.

Both the _effect_ function and the _cleanup_ function takes the current props as input.

The _dependency_ list is a list of prop names that the effect depends on, the _effect_ function and the _cleanup_ function will be executed when any of the values in the _dependency_ list changes. If not provided, all props of the _effect_ function will be in the _dependency_ list. If an empty array is provided, the effect will only happen after mounting, and cleanup will only happen after unmounting.

```js
  withEffect(p => document.title = p.name + ' ' + p.surname) // document.title will be set on every render
  withEffect(p => document.title = p.name + ' ' + p.surname, null, ['surname']) // document.title will be set only if surname changes
  withEffect(p => document.title = p.name + ' ' + p.surname, null, p => [p.name, p.surname]) // The dependency list can also be specified as a callback function
```

### `withLayoutEffect`

```js
  withLayoutEffect(effect, cleanup, deps)
```

is the same as

```js
  withEffect(effect, cleanup, deps, true)
```

Which will call _useLayoutEffect_ instead of _useEffect_.


### `withEventHandler`

When you use the effect hook to attach event handlers to elements, you always have to clean up and remove the event handler. _withEventHandler_ is a helper function that will help you remove the event handler.

_withEventHandler_ takes four arguments, the CSS _selector_ (required) which is used to identify the elements, the _event_ name (required), the _handler_ (required) which takes the props (the event args object will be added to the props as 'event') as input and the _dependency_ list.

```js
  withEventHandler('#btn2', 'click', p => p.setCount(p.count + 1))
```

Based on the design of hooks, this will remove and re-attach the handler on every render. If you want to improve performance and remove the handler only on unmounting, specify an empty dependency list. This will attach the handler on mounting and remove it on unmounting. However, if your handler is using any state from the props, be aware of the stale state/prop issue. If you do the following:

```js
  withEventHandler('#btn2', 'click', p => p.setCount(p.count + 1), [])
```

The _p.count_ will not be changed after the first render. This is because of the way how javascript closure works. For more information, please refer to [hooks documentation](https://reactjs.org/docs/hooks-faq.html#performance-optimizations).

There are 3 ways to solve the problem:

1. add _p.count_ to the dependency list:

```js
  withEventHandler('#btn2', 'click', p => p.setCount(p.count + 1), ['count'])
```

2. for local state, use the callback form of the setter:

```js
  withEventHandler('#btn2', 'click', p => p.setCount(count => count + 1), [])
```

3. use the _useReducer_ hook. See _withReducer_.


### `withWindowEventHandler`

_withWindowEventHandler_ allows you to attach event handlers on the window object.

```js
  withWindowEventHandler('resize', p => p.setWidth(window.innerWidth), [])
```

In this example, using the empty dependency list is safe because the event handler is not using any state from the props (it uses setWidth from the props, but it's a static function, it never changes).

### `withInterval`

_withInterval_ will call the useEffect hook to _setInterval_ and _clearInterval_.

```js
  withInterval(p => p.setCount(c => c + 1), 1000, [])
```

### `withMemo`

_withMemo_ will call the _useMemo_ hook to remember the result of the enhancer, only re-calculate the result if dependency list changes.

```js
  compose(
    withState('name', 'Mary'),
    withState('surname', 'Poppins'),
    withMemo(p => ({
      fullName: p.name + ' ' + p.surname
    }), ['name', 'surname'])
  )(App)
```

It serves the same purpose as _withPropsOnChange_ from recompose. You can also use it to achieve the same result as the _useCallback_ hook (see examples under 'withRef' and 'withReducer').

### `withRef`

_withRef_ will call useRef to create a ref to a mutable object (usually an UI element), and attach the ref to the props.

```js
const App = ({ inputEl, focusInputEl }) =>
  <>
    <input ref={inputEl} type="text" />
    <button onClick={focusInputEl}>Focus the input</button>
  <>;

export default compose(
  withRef('inputEl'),
  withMemo(p => ({
    focusInputEl: () => p.inputEl.current.focus()
  }), []),
)(App);
```

### `withContext`

_withContext_ will call the _useContext_ hook to enhance the props with the context value. The 2nd argument is the name of the context variable on the props, default value is "context".

```js
// in myContext.js
export const MyContext = createContext();

// in contextProvider.js
<MyContext.Provider value={{ n1: 8, n2: 9 }}>
  <ContextConsumer />
</MyContext.Provider>

// in contextConsumer.js
const ContextConsumer = ({ ctx }) =>
  <div>Context Value: {ctx.n2}</div>;

export default compose(
  withContext(MyContext, 'ctx')
)(ContextConsumer);
```

### `withReducer`

_withReducer_ will call the _useReducer_ hook to handle complex local states. For use cases of _useReducer_, please refer to the [hooks documentation](https://reactjs.org/docs/hooks-reference.html#usereducer). The 2nd argument of _withReducer_ is the initial state, the 3rd is the name of the state (default value is 'state'), and the 4th is the name of the dispatch function (default value is 'dispatch').

```js
// in myReducer.js
export default (state, action) => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

// in App.js
const App = ({ state, inc, dec }) =>
  <>
    <div>Count: {state.count}</div>
    <button onClick={inc}>+</button>
    <button onClick={dec}>-</button>
  </>;

export default compose(
  withReducer(myReducer, { count: 0 }),
  withMemo(p => ({
    inc: () => p.dispatch({ type: 'increment' }),
    dec: () => p.dispatch({ type: 'decrement' })
  }), [])
)(App);
```

## Custom hooks

Similar to the purpose of custom hooks, you can combine enhancers to re-use them as a unit.

```js
const withWidth = [
  withState('width', window.innerWidth),
  withWindowEventHandler('resize', p => p.setWidth(window.innerWidth), [])
];

export default compose(
  withState('name', 'Mary'),
  ...withWidth
)(App);
```

Since an enhancer is just a function which takes the current props and returns additional props, if you already have a custom hook or any other function with effect, you just need to create a wrapper function that returns the result as additional props.

```js
const useFullName = () => {
  const [name, setName] = useState('Mary');
  const [surname, setSurname] = useState('Poppins');
  return useMemo(() => name + ' ' + surname, [name, surname]);
};

export default compose(
  p => ({ fullName: useFullName() })
)(App);
```
