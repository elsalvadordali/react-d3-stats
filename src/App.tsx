import State from './data/State'
import Map from './Map'
import { StateContext, states } from './assets/StateContext'
import './App.css'


function App() { 

  
  return (
    <div>
      <h3>Select a state to get started</h3>
        <StateContext.Provider value={states}>
          <Map />
        </StateContext.Provider>
        <State />
    </div>
  )
}

export default App
