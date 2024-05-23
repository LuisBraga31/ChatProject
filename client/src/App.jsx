import './App.css'

import Join from './componenets/Join/Join'
import Chat from './componenets/Chat/Chat'
import { useState } from 'react'

function App() {

  const [chatVisibility, setChatVisibility] = useState(false);

  return (
    <div className="App">
      {
        chatVisibility ? <Chat/> : <Join setChatVisibility={setChatVisibility}/>
      }
    </div>
  )
}

export default App
