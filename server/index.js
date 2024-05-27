const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:5173'}})

const PORT = 3001

io.on('connection', socket =>{
    console.log('Usuario Conectado', socket.id);

    socket.on('set_username', username => {
        socket.data.username = username 
    })

    socket.on('join_room', room => {
        socket.join(room);
        socket.emit('room_joined', room);
        socket.data.room = room
        io.to(room).emit('user_joined', `${socket.data.username} entrou na sala!`);
        console.log(`Usuário ${socket.data.username} entrou na sala ${room}`);
    });

    socket.on('leave_room', room => {
        io.to(room).emit('user_left', `${socket.data.username} saiu da sala!`);
        socket.leave(room);
        socket.data.room = null;
        console.log(`Usuário ${socket.data.username} saiu da sala ${room}`);
    })

    socket.on('message', (room, text) => {
        io.to(room).emit('receive_message', {
            text,
            authorId: socket.id,
            author: socket.data.username
        })
    })

    socket.on('disconnect', reason => {
        
        console.log(`Usuário ${socket.data.username} desconectado da sala: ${socket.data.room}`);
        io.to(socket.data.room).emit('user_left', `${socket.data.username} saiu da sala`);
    })

})

server.listen(PORT, () => console.log('server is running'))