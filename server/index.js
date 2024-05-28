const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:5173'}})

const {v4: uuidv4 } = require('uuid');
const rooms = new Set();

const PORT = 3001

io.on('connection', socket =>{
    console.log('Usuario Conectado', socket.id);

    socket.on('set_username', username => {
        socket.data.username = username 
    })

    socket.on('create_room', () => {
        const roomID = uuidv4()
        rooms.add(roomID)
        socket.join(roomID)
        socket.data.room = roomID
        socket.emit('room_created', roomID)
        console.log(`Room criada: ${roomID}' por ${socket.data.username}`)
    })

    socket.on('join_room', roomID => {
        if(rooms.has(roomID)) {
            socket.join(roomID);
            socket.emit('room_joined', roomID);
            socket.data.room = roomID
            io.to(roomID).emit('user_joined', `${socket.data.username} entrou na sala!`);
            console.log(`Usuário ${socket.data.username} entrou na sala ${roomID}`);
        } else {
            socket.emit('error', 'Sala não encontrada')
        }        

    });

    socket.on('leave_room', roomID => {
        if(socket.data.room === roomID) {
            io.to(roomID).emit('user_left', `${socket.data.username} saiu da sala!`);
            socket.leave(roomID);
            socket.data.room = null;
            console.log(`Usuário ${socket.data.username} saiu da sala ${roomID}`);
        }

    })

    socket.on('message', (roomID, text) => {
        if(rooms.has(roomID)) {
            io.to(roomID).emit('receive_message', {
                text,
                authorId: socket.id,
                author: socket.data.username
            }) 
        }
    })

    socket.on('disconnect', reason => {
        const roomID = socket.data.room

        if(roomID) {
            io.to(socket.data.room).emit('user_left', `${socket.data.username} saiu da sala`)
            socket.leave(roomID)
            console.log(`Usuário ${socket.data.username} desconectado da sala: ${roomID}`);
        }
        
    })

})

server.listen(PORT, () => console.log('server is running'))