/* eslint-disable react/prop-types */
import { useRef } from "react"
import io from 'socket.io-client'

import './join.css';

export default function Join({setSocket, setChatVisibility, setRoomID}) {

  const usernameRefCreate = useRef();
  const usernameRefEnter = useRef();
  const roomRef = useRef();

  const handleCreateRoom = async () =>{
    const username = usernameRefCreate.current.value;

    if(!username.trim()) return
    const socket = await io.connect('http://localhost:3001')
    socket.emit('set_username', username)
    socket.emit('create_room')
    socket.on('room_created', (roomID) => {
      setSocket(socket)
      setRoomID(roomID)
      setChatVisibility(true)
    })

  }

  const handleJoinRoom = async () =>{
    const username = usernameRefEnter.current.value;
    const roomID = roomRef.current.value;
    if(!username.trim() || !roomID.trim()) return
    const socket = await io.connect('http://localhost:3001')
    socket.emit('set_username', username)
    socket.emit('join_room', roomID)
    socket.on('room_joined', () => {
      setSocket(socket)
      setRoomID(roomID)
      setChatVisibility(true)
    })
    socket.on('error', (message) => {
      alert(message)
    })
  
  }

  return (
    <div className="join">
        <div className="join-item">
          <h2> Criar Sala </h2>
          <input type="text" ref={usernameRefCreate} placeholder="Nome"/>
          <button onClick={()=> handleCreateRoom()}> Criar Sala </button>
        </div>
        
        <div className="join-item">
          <h2> Entrar em Sala </h2>
          <input type="text" ref={usernameRefEnter} placeholder="Nome"/>
          <input type="text" ref={roomRef} placeholder="Sala" />
          <button onClick={()=> handleJoinRoom()}> Entrar </button>
        </div>
    </div>

  )
}
