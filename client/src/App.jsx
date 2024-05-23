import { useState } from 'react'

import Join from './componenets/Join/Join'
import Chat from './componenets/Chat/Chat'

import './App.css'

function App() {

  const [chatVisibility, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState(null);

  return (
    <div className="app">
      <h1 className="title"> Chat em Tempo Real </h1>
      {
        chatVisibility ? <Chat socket={socket}/> : <Join setSocket={setSocket} setChatVisibility={setChatVisibility}/>
      }
    </div>
  )
}

export default App
