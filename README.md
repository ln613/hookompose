# hookompose

Hooks and recompose are two ways that we can use to give functional components the ability to handle local states and lifecycle events, in order to eliminate the need of class components.

Recompose is using the "enhancer" pattern, providing enhancer functions (which are higher order components) to enhance the pure presentational functional components with those stateful features. As a result, your components can be written in a highly functional style. However, because all recompose "enhancers" are HOCs, recompose suffers the HOC wrapper hell.

Hooks solve the wrapper hell problem, but introduce states and effects into the functional component, thus making your components less functional.

Hookompose allows you to call hook functions in a recompose style, giving you the best of both worlds.

For each hook function, there is a hookompose function (starts with 'with' instead of 'use') that will call the corresponding hook function and enhance the props of your component instead of enhance the component itself. Since these hookompose enhancer functions are higher order functions rather than higher order components, they don't suffer the HOC wrapper hell.

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
