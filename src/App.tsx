import State from './component/State'
import Map from './component/Map'
import { useEffect, useState } from 'react'
import './App.css'

function App() { 
  const [states, setStates] = useState<string[]>([])

  function removeState(index: number) {
    setStates((states: string[]) => states.filter((state: string, i: number) => i != index && state))
  }
  function addState(state: string): void {
    console.log('state is', state)
    setStates([...states, state])
  } 

  //useEffect(() => {
  //  setStates(() => states)
  //}, [states])
  
  return (
    <>
    <div className='main'>
      <h3>Select a state to get started</h3>
          <Map states={states} addState={addState} removeState={removeState} />
          <div className='grid'>
          {states.map((state: string) => <State state={state} key={state + '-stats'}/>)}
          </div>
    </div>
    <footer>
    </footer>
    </>
  )
}

export default App
