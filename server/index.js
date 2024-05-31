const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:5173'}})

const generateID = () => {
    return Math.random().toString(36).substring(2, 8); 
};

const rooms = new Map();

const PORT = 3001

io.on('connection', socket =>{

    // Armazen nome do usuario
    socket.on('set_username', username => {
        socket.data.username = username 
    })

    // Criando uma sala
    socket.on('create_room', () => {
        let roomID;
        do {
            roomID = generateID()
        } while(rooms.has(roomID))
        rooms.set(roomID, new Set());
        socket.join(roomID)
        socket.data.room = roomID
        rooms.get(roomID).add({ id: socket.id, username: socket.data.username })
        socket.emit('room_created', roomID)
        io.to(roomID).emit('update_users', Array.from(rooms.get(roomID))) //Add users in a Array
        console.log(`Room criada: ${roomID} por ${socket.data.username}`)
    })

    // Entrando em uma sala
    socket.on('join_room', roomID => {
        if(rooms.has(roomID)) {
            socket.join(roomID)
            socket.emit('room_joined', roomID)
            rooms.get(roomID).add({ id: socket.id, username: socket.data.username })
            socket.data.room = roomID
            io.to(roomID).emit('user_joined', `${socket.data.username} entrou na sala!`)
            io.to(roomID).emit('update_users', Array.from(rooms.get(roomID)))
            console.log(`Usuário ${socket.data.username} entrou na sala ${roomID}`)
        } else {
            socket.emit('error', 'Sala não encontrada')
        }        

    });

    //Saindo da sala
    socket.on('leave_room', roomID => {
        if(socket.data.room === roomID) {
            io.to(roomID).emit('user_left', `${socket.data.username} saiu da sala!`)
            socket.leave(roomID)
            socket.data.room = null
            rooms.get(roomID).delete({ id: socket.id, username: socket.data.username })
            io.to(roomID).emit('update_users', Array.from(rooms.get(roomID)))
            console.log(`Usuário ${socket.data.username} saiu da sala ${roomID}`)
        }
        if(rooms.get(roomID).size === 0) {
            rooms.delete(roomID)
            console.log(`Sala ${roomID} foi removida por estar vazia.`)
        }

    })

    // Enviando mensagem
    socket.on('message', (roomID, text) => {
        if(rooms.has(roomID)) {
            io.to(roomID).emit('receive_message', {
                text,
                authorId: socket.id,
                author: socket.data.username
            }) 
        }
    })

    // Desconectando
    socket.on('disconnect', reason => {
        const roomID = socket.data.room

        if(roomID) {
            io.to(socket.data.room).emit('user_left', `${socket.data.username} saiu da sala`)
            socket.leave(roomID)
            rooms.get(roomID).delete({ id: socket.id, username: socket.data.username })
            io.to(roomID).emit('update_users', Array.from(rooms.get(roomID)))
            console.log(`Usuário ${socket.data.username} desconectado da sala: ${roomID}`)
            
            if(rooms.get(roomID).size === 0) {
                rooms.delete(roomID);
                console.log(`Sala ${roomID} foi removida por estar vazia.`)
            }
        }
        
    })

})

server.listen(PORT, () => console.log('server is running'))