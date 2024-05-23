/* eslint-disable react/prop-types */
import { useRef } from "react"
import io from 'socket.io-client'

import './join.css';

export default function Join({setSocket, setChatVisibility}) {

  const usernameRef = useRef();
  
  const handleSubmit = async () =>{
    const username = usernameRef.current.value;
    if(!username.trim()) return
    const socket = await io.connect('http://localhost:3001')
    socket.emit('set_username', username)
    setSocket(socket)
    setChatVisibility(true)
  
  }

  return (
    <div className="join">
        <h2> Chat 01 </h2>
        <input type="text" ref={usernameRef} placeholder="Nome"/>
        <button onClick={()=> handleSubmit()}> Entrar </button>
    </div>
  )
}
