/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react"

export default function Chat({socket}) {

  const messageRef = useRef();
  const [messageList, setMessageList] = useState([]);

  const handleSubmit = () => {
    const message = messageRef.current.value
    if(!message.trim()) return

    socket.emit('message', message)
    clearInput()
    focusInput()
  }

  const clearInput = () => {
    messageRef.current.value = ''
  }

  const focusInput = () => {
    messageRef.current.focus()
  }

  const getEnterKey = (e) => {
    if(e.key === 'Enter') 
      handleSubmit()
  }


  useEffect(()=> {
    socket.on('receive_message', data => {
      setMessageList((current) => [... current, data])      
    })

    return () => socket.off('receive_message')
  }, [socket])

  return (
    <div>
        <h1> Chat </h1>
        { 
          messageList.map((message, index) => (
            <p key={index}> {message.author}: {message.text}</p>
          ))
        }
        
        <input type="text" ref={messageRef} onKeyDown={(e)=>getEnterKey(e)} placeholder="Mensagem"/>
        <button onClick={() => handleSubmit()}> Enviar </button>

    </div>
  )
}
