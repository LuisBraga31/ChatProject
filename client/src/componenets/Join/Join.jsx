/* eslint-disable react/prop-types */
import { useRef } from "react"
import io from 'socket.io-client'

import './join.css';
import { useNavigate } from "react-router";


export default function Join({setSocket, setRoomID}) {

  const usernameRefCreate = useRef();
  const usernameRefEnter = useRef();
  const roomRef = useRef();

  const navigate = useNavigate();

  const handleCreateRoom = async () =>{
    const username = usernameRefCreate.current.value;

    if(!username.trim()) return
    const socket = await io.connect('http://localhost:3001')
    socket.emit('create_room', username)
    socket.on('room_created', (roomID) => {
      setSocket(socket)
      setRoomID(roomID)
      navigate(`/${roomID}`)
    })

  }

  const handleJoinRoom = async () =>{
    const username = usernameRefEnter.current.value;
    const roomID = roomRef.current.value;
    if(!username.trim() || !roomID.trim()) return
    const socket = await io.connect('http://localhost:3001')
    socket.emit('join_room', roomID, username)
    socket.on('room_joined', () => {
      setSocket(socket)
      setRoomID(roomID)
      navigate(`/chat/${roomID}`)
    })
    socket.on('error', (message) => {
      alert(message)
    })
  
  }

  return (
    <div className="join">
        <div className="join-item">
          <h2> Criar Sala </h2>
          <div className="join-content">
            <input type="text" ref={usernameRefCreate} placeholder="Nome"/>
            
          </div>
          <button onClick={()=> handleCreateRoom()}> Criar Sala </button>
        </div>
        
        <div className="join-item">
          <h2> Entrar em Sala </h2>
          <div className="join-content">
            <input type="text" ref={usernameRefEnter} placeholder="Nome"/>
            <input type="text" ref={roomRef} placeholder="Sala" />
          </div>
          <button onClick={()=> handleJoinRoom()}> Entrar </button>
        </div>
    </div>

  )
}
