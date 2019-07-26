import React from 'react';
import { compose, withState, withEffect, withEventHandler, withWindowEventHandler, withInterval, withCallback, withMemo, withReducer, withRef } from 'hookompose';
import ContextConsumer from './contextConsumer';
import { MyContext } from './context';
import { myReducer } from './reducer';

const App = ({ name, setName, surname, setSurname, backColor, changeColor, width, state, inc, dec, inputEl, focusInput }) =>
  
  <MyContext.Provider value={{ n1: 8, n2: 9 }}>
    
    <div>Name: <input value={name} onChange={e => setName(e.target.value)} /></div>
    <div>Surname: <input value={surname} onChange={e => setSurname(e.target.value)} /></div>
    
    <hr />
    
    <div onMouseEnter={() => changeColor('red')} onMouseOut={() => changeColor('green')} style={{ width: '100px', height: '100px', backgroundColor: backColor }}></div>
    
    <hr />
    
    <button class="btn2">Event Listener 1</button>
    <button class="btn2">Event Listener 2</button>
    
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

  </MyContext.Provider>;

export default compose(
  withState('name', 'Mary'),
  withState('surname', 'Poppins'),
  withMemo(
    p => ({ fullName: p.name + ' ' + p.surname }),
    ['name', 'surname']
  ),
  withEffect(p => document.title = p.fullName, null, ['surname']),
  withState('width', window.innerWidth),
  withWindowEventHandler('resize', p => p.setWidth(window.innerWidth), []),
  withEventHandler('.btn2', 'click', p => p.setName(p.name + '1')),
  withReducer(myReducer, { count: 0 }),
  withRef('inputEl'),
  withState('backColor', 'green'),
  withMemo(p => ({
    inc: () => p.dispatch({ type: 'increment' }),
    dec: () => p.dispatch({ type: 'decrement' }),
    changeColor: c => p.setBackColor(c),
    focusInput: () => p.inputEl.current.focus()
  })),
  withInterval(p => p.inc(), 1000, []),
)(App);
