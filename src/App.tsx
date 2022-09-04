import { useState } from 'react'
import Ohio from './data/Ohio'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Ohio />
    </div>
  )
}

export default App
