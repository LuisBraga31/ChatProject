import { BrowserRouter, Route, Routes } from "react-router-dom";

import Join from '../componenets/Join/Join'
import Chat from '../componenets/Chat/Chat'
import { useState } from "react";

export default function RouteList() {

    const [socket, setSocket] = useState(null);
    const [roomID, setRoomID] = useState('');

    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Join setSocket={setSocket} setRoomID={setRoomID}/>}/>
                <Route path="/:id" element={<Chat socket={socket} roomID={roomID}/>}/>
            </Routes>

        </BrowserRouter>
    )
}