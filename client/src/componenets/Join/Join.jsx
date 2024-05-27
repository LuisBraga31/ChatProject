/* eslint-disable react/prop-types */
import { useRef } from "react"
import io from 'socket.io-client'

import './join.css';

export default function Join({setSocket, setChatVisibility}) {

  const usernameRef = useRef();
  const roomRef = useRef();

  const handleSubmit = async () =>{
    const username = usernameRef.current.value;
    const room = roomRef.current.value;
    if(!username.trim() || !room.trim()) return
    const socket = await io.connect('http://localhost:3001')
    socket.emit('set_username', username)
    socket.emit('join_room', room)
    setSocket(socket)
    setChatVisibility(true)
  
  }

  return (
    <div className="join">
        <h2> Chat 01 </h2>
        <input type="text" ref={usernameRef} placeholder="Nome"/>
        <input type="text" ref={roomRef} placeholder="Sala" />
        <button onClick={()=> handleSubmit()}> Entrar </button>
    </div>
  )
}
