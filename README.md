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

Based on the design of hookompose enhancers, we don't even need a special enhancer to achieve the functionality of _withProps_ from recompose, which attach additional props to the existing props. We can simply write a function like that:

```js
  compose(
    withState('name', 'Mary'),
    withState('surname', 'Poppins'),
    p => ({ fullName: p.name + ' ' + p.surname })
  )(App)
```

If you want to specify a dependency list (which serves the same purpose as _withPropsOnChange_ from recompose), you can use _withMemo_ (which will call the _useMemo_ hook):

```js
  withMemo(
    p => ({ fullName: p.name + ' ' + p.surname }),
    ['name', 'surname']
  )
```

### `withCallback`

_withCallback_ will call useCallback to memorize the callback function and only re-create the callback function if anything in the dependency list changes.

Since the callback function is not defined inline inside the functional component, it's not garbage collected and re-created for every render. So in most cases there is no need to use withCallback to "remember" that function. This article explains [when to use or not to use the useCallback hook](https://kentcdodds.com/blog/usememo-and-usecallback).

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
  withCallback({
    focusInputEl: p => e => p.inputEl.current.focus()
  }),
)(App);
```
