# hookompose

Hooks and recompose are two ways that we can use to give functional components the ability to handle local states and lifecycle events, in order to eliminate the need of class components.

Recompose is using the "enhancer" pattern, providing enhancer functions (which are higher order components) to enhance the pure presentational functional components with those stateful features. As a result, your components can be written in a highly functional style. However, because all recompose "enhancers" are HOCs, recompose suffers the HOC wrapper hell.

Hooks solve the wrapper hell problem, but introduce states and effects into the functional component, thus making your components less functional.

Hookompose allows you to call hook functions in a recompose style, giving you the best of both worlds.

For each hook function, there is a hookompose function (starts with 'with' instead of 'use') that will call the corresponding hook function and enhance the props of your component instead of enhancing the component itself. Since these hookompose enhancer functions are higher order functions rather than higher order components, they don't suffer the HOC wrapper hell.

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

The compose function from hookompose is a HOC, while all other enhancer functions (withState, withEffect, withMemo...) are HOFs. They take the current props as input, call the corresponding hook function and return the result as additional props. The compose function takes the props of the presentational component, run it through all the enhancer functions and return a new component with the enhanced props.

The order of the enhancer functions are important, the new props just added are available to the next enhancer function.

## Docs


### `withState`

_withState_ takes two arguments, state name (required) and initial value. It calls _useState_ and returns the name/setName pair as object. To simplify the argument list, the name of the setter is automatically generated.

```js
  withState('surname', 'Poppins') // returns { surname: ..., setSurname: ... }
```


### `withEffect`

_withEffect_ takes four arguments, the _effect_ function (required), the _cleanup_ function, the _dependency_ list and a boolean value _useLayout_ indicating calling _useLayoutEffect_ or _useEffect_.

Both the _effect_ function and the _cleanup_ function takes the current props as input.

The _dependency_ list is a list of prop names that the effect depends on, the _effect_ function and the _cleanup_ function will be executed when any of the values in the _dependency_ list changes. If not provided, all props of the _effect_ function will be in the _dependency_ list. If an empty array is provided, the effect will only happen after mounting, and cleanup will only happen after unmounting.

```js
  withEffect(p => document.title = p.name + ' ' + p.surname) // document.title will be set on every render
  withEffect(p => document.title = p.name + ' ' + p.surname, null, ['surname']) // document.title will be set only if surname changes
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

When you use the effect hook to attach event handlers to elements, you always have to clean up and remove the event handler. _withEventHandler_ is a helper function that will help you remove the event handler. You can specify a CSS selector to identify the elements to which the event handler will attach.

```js
  withEventHandler('.btn2', 'click', p => p.setName(p.name + '1'))
```

Based on the design of hooks, this will remove and re-attach the handler on every render. If you want to improve performance and remove the handler only on unmounting, specify an empty dependency list. This will attach the handler on mounting and remove it on unmounting. However, if your handler is using any state from the props, be aware of the stale state/prop issue. If you do the following:

```js
  withEventHandler('.btn2', 'click', p => p.setName(p.name + '1'), [])
```

The _p.name_ will always be 1. This is because of the way how javascript closure works. For more information, please refer to [hooks documentation](https://reactjs.org/docs/hooks-faq.html#performance-optimizations)

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

In this example, using the empty dependency list is safe because we are using the [functional update form of setCount](https://reactjs.org/docs/hooks-faq.html#performance-optimizations).

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

It serves the same purpose as _withPropsOnChange_ from recompose. You can also use it to achieve the same result as the _useCallback_ hook:

```js
  withMemo(p => ({
    inc: () => p.dispatch({ type: 'increment' }),
    dec: () => p.dispatch({ type: 'decrement' })
  }), []),
```

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