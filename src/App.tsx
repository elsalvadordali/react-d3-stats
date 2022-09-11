import State from './component/State'
import Map from './component/Map'
import { useEffect, useState } from 'react'
import './App.css'

function App() { 
  const [states, setStates] = useState<string[]>([])
  const [sortBy, setSort] = useState<string>('gender')
  const [dropdown, setDropdown] = useState<string>('open')

  function removeState(index: number) {
    setStates((states: string[]) => states.filter((state: string, i: number) => i != index && state))
  }
  function addState(state: string): void {
    setStates([...states, state])
  } 

  //useEffect(() => {
  //  setStates(() => states)
  //}, [states])

  return (
    <>
    <div className='main'>
      <h3>Select a state to get started</h3>
          <Map states={states} addState={addState} removeState={removeState}  />
          <div onClick={() => setDropdown(dropdown === 'sort' ? 'open' : 'sort')} className={dropdown}>
                <h6>{dropdown}</h6>
                <div>
                    <button onClick={() => setSort('occupation')}>by Name</button>
                    <button onClick={() => setSort('wage')}>by Wage</button>
                    <button onClick={() => setSort('gender')}>by Gender</button>
                </div>
            </div>
          <div className='grid'>
          {states.map((state: string) => <State state={state} key={state + '-stats'} sortBy={sortBy} />)}
          </div>
          
    </div>
    <footer>
    </footer>
    </>
  )
}

export default App
