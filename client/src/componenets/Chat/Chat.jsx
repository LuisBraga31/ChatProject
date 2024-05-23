/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react"
import { IoMdSend } from "react-icons/io";

import './chat.css';

export default function Chat({socket}) {

  const messageRef = useRef();
  const bottomRef = useRef();
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

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(()=> {
    socket.on('receive_message', data => {
      setMessageList((current) => [... current, data])      
    })

    return () => socket.off('receive_message')
  }, [socket])

  useEffect(()=>{
    scrollDown()
  }, [messageList])
  
  return (
    <div className="chat">
        <div className="chat-container">

          <div className="chat-body">
            { 
              messageList.map((message, index) => (
                <div className={`message-container ${message.authorId === socket.id && `message-mine`}`} key={index}>
                  <div className="message-author"><strong>{message.author}</strong></div>
                  <div className="message-text">{message.text}</div>
               </div>
              ))
            }
            <div ref={bottomRef} />
          </div>

          <div className="chat-footer">
            <input type="text" ref={messageRef} onKeyDown={(e)=>getEnterKey(e)} placeholder="Mensagem"/>
            <button onClick={() => handleSubmit()}> <IoMdSend color="#34B7F1" size={16}/> </button>
          </div>

        </div>
        


    </div>
  )
}
