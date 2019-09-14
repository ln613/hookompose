import React, { useState, useEffect } from 'react';
import { compose, withState, withEffect, withEventHandler, withWindowEventHandler, withInterval, withMemo, withReducer, withRef } from 'hookompose';
import ContextConsumer from './contextConsumer';
import { MyContext } from './myContext';
import myReducer from './myReducer';
import Counter from './Counter';

const App = ({ name, setName, surname, setSurname, backColor, toGreen, toRed, width, state, inc, dec, inputEl, focusInput, x, y }) =>
  
  <MyContext.Provider value={{ n1: 8, n2: 9 }}>
    <div>Name: <input value={name} onChange={e => setName(e.target.value)} /></div>
    <div>Surname: <input value={surname} onChange={e => setSurname(e.target.value)} /></div>
    
    <hr />
    
    <div onMouseEnter={toRed} onMouseOut={toGreen} style={{ width: '100px', height: '100px', backgroundColor: backColor }}></div>
    
    <hr />
    
    <button id="btn1">Button 1</button>
    <button id="btn2">Button 2</button>
    <button id="btn3">Button 3</button>
    
    <hr />

    <div>Width: {width}</div>
    
    <hr />
    
    <ContextConsumer />
    
    <hr />
    
    <div>Count: {state.count}</div>
    <button onClick={inc}>+</button>
    <button onClick={dec}>-</button>
    
    <hr />
    
    <input ref={inputEl} type="text" />
    <button onClick={focusInput}>Focus the input</button>

    <hr />

    Mouse Position: {x}, {y}

    <hr />

    <Counter />

  </MyContext.Provider>;

const withWidth = [
  withState('width', window.innerWidth),
  withWindowEventHandler('resize', p => p.setWidth(window.innerWidth), [])
];

// custom hook
const useMouseMove = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = e => setPosition({ x: e.x, y: e.y });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return position;
};

export default compose(
  
  withState('name', 'Mary'),
  withState('surname', 'Poppins'),

  withMemo(p => ({
    fullName: p.name + ' ' + p.surname
  }), ['name', 'surname']),
  
  withEffect(p => document.title = p.fullName, null, p => [p.fullName]),
  
  ...withWidth,
  
  withReducer(myReducer, { count: 0 }),
  withRef('inputEl'),
  withState('backColor', 'green'),
  withMemo(p => ({
    inc: () => p.dispatch({ type: 'increment' }),
    dec: () => p.dispatch({ type: 'decrement' }),
    toGreen: () => p.setBackColor('green'),
    toRed: () => p.setBackColor('red'),
    focusInput: () => p.inputEl.current.focus()
  })),

  // use the state 'name', so need to depend on 'name'
  withEventHandler('#btn1', 'click', p => p.setName(p.name + '1'), ['name']),
  // use the callback form of the setter, so do not depend on 'name'
  withEventHandler('#btn2', 'click', p => p.setName(name => name + '2'), []),
  // use reducer, so do not depend on 'state.count'
  withEventHandler('#btn3', 'click', p => p.inc(), []),

  withInterval(p => p.inc(), 1000, []),

  useMouseMove

)(App);
