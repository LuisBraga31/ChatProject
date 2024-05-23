import './App.css'

import Join from './componenets/Join/Join'
import Chat from './componenets/Chat/Chat'
import { useState } from 'react'

function App() {

  const [chatVisibility, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState(null);

  return (
    <div className="App">
      {
        chatVisibility ? <Chat socket={socket}/> : <Join setSocket={setSocket} setChatVisibility={setChatVisibility}/>
      }
    </div>
  )
}

export default App
