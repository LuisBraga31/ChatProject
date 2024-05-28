/* eslint-disable react/prop-types */
import { useRef } from "react"
import io from 'socket.io-client'

import './join.css';

export default function Join({setSocket, setChatVisibility, setRoomID}) {

  const usernameRef = useRef();
  const roomRef = useRef();

  const handleCreateRoom = async () =>{
    const username = usernameRef.current.value;

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
    const username = usernameRef.current.value;
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
        <h2> Chat 01 </h2>
        <input type="text" ref={usernameRef} placeholder="Nome"/>
        <button onClick={()=> handleCreateRoom()}> Criar Sala </button>
        <input type="text" ref={roomRef} placeholder="Sala" />
        <button onClick={()=> handleJoinRoom()}> Entrar </button>
    </div>
  )
}
