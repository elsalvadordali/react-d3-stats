import State from './component/State'
import Map from './component/Map'
import { useEffect, useState } from 'react'
import './App.css'

function App() { 
  const [states, setStates] = useState<string[]>([])
  const [sortBy, setSort] = useState<string>('gender')
  const [dropdown, setDropdown] = useState<string>('sort')

  function removeState(index: number) {
    setStates((states: string[]) => states.filter((state: string, i: number) => i != index && state))
  }
  function addState(state: string): void {
    setStates([...states, state])
  } 

  //useEffect(() => {
  //  setStates(() => states)
  //}, [states])
  const Legend = (
    <div className='inline'>
    <div onClick={() => setDropdown(dropdown === 'sort' ? 'close' : 'sort')} className={dropdown}>
                <h6>{dropdown}</h6>
                <div>
                    <button onClick={() => setSort(sortBy == 'occupation' ? 'occupation-reverse' : 'occupation')}>by Occupation</button>
                    <button onClick={() => setSort(sortBy == 'wage' ? 'wage-reverse' : 'wage')}>by Wage</button>
                    <button onClick={() => setSort(sortBy == 'gender' ? 'gender-reverse' : 'gender')}>by Gender</button>
                </div>
            </div>
    <div className='legend'>
      <h4>Legend</h4>
      <div><div className='color blue'></div> <p>Male</p></div>
      <div><div className='color pink'></div> <p>Female</p></div>
    </div>
    </div>
  )

  return (
    <>
    <div className='main'>
      <header>
      <h1>Gender pay gap by state</h1>
      <p>Select a state to see the worst offenders. Hint: They're all bad because it's a systemic issue</p>
      <p>Data from <a href='https://datausa.io'>https://datausa.io</a></p>
      <p>A site by <a href='https://tijana.me/'>Tijana J.</a></p>
      </header>
          <Map states={states} addState={addState} removeState={removeState} />          
            {states.length > 0 && Legend}
          <div className='grid'>
          {states.map((state: string) => <State state={state} key={state + '-stats'} sortBy={sortBy} />)}
          </div>
          
    </div>
    </>
  )
}

export default App
