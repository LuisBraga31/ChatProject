const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:5173'}})

const generateID = () => {
    return Math.random().toString(36).substring(2, 8); 
};

const rooms = new Map();
let userCount = 0;
const MAX_USERS_PER_ROOM = 4;

const PORT = 3001

io.on('connection', socket =>{
    
    function newUser(roomID, username, userFunction){
        socket.data.username = username 
        socket.data.room = roomID
        socket.data.userFunction = userFunction
    }

    function updatePlayerCount(roomID) {
        const playerCount = rooms.get(roomID)?.size || 0;
        io.to(roomID).emit('update_player_count', playerCount);
        console.log('qtd de jogadores:', playerCount)
    }

    // Criando uma sala
    socket.on('create_room', (username) => {
        let roomID;
        do {
            roomID = generateID()
        } while(rooms.has(roomID))
        
        rooms.set(roomID, new Set());
        socket.join(roomID)

        newUser(roomID, username, 'admin')

        rooms.get(roomID).add(socket.id);
        socket.emit('room_created', roomID);

        updatePlayerCount(roomID);

        console.log(`Room ${roomID} criada por ${socket.data.username}`)

    })

    // Entrando em uma sala
    socket.on('join_room', (roomID, username) => {
        if(rooms.has(roomID)) {
            const room = rooms.get(roomID);
            if (room.size < MAX_USERS_PER_ROOM) {
            
            socket.join(roomID);
            socket.emit('room_joined', roomID);
            
            rooms.get(roomID).add(socket.id);
            newUser(roomID, username, 'user')
            updatePlayerCount(roomID);

            io.to(roomID).emit('user_joined', `${socket.data.username} entrou na sala!`);
            console.log(`Usuário ${socket.data.username} entrou na sala ${roomID}`);
            } else {
                socket.emit('error', 'Sala está cheia')
            }

        } else {
            socket.emit('error', 'Sala não encontrada')
        }        

    });

    // Enviando mensagem
    socket.on('message', (roomID, text) => {
        io.to(roomID).emit('receive_message', {
            text,
            authorId: socket.id,
            author: socket.data.username,
            func: socket.data.userFunction
        })
        console.log(socket.data)
    });

    // Desconectando
    socket.on('disconnect', () => {
        const roomID = socket.data.room

        if(roomID) {
            io.to(socket.data.room).emit('user_left', `${socket.data.username} saiu da sala`)
            socket.leave(roomID)
            rooms.get(roomID).delete(socket.id); 
            updatePlayerCount(roomID);
            console.log(`Usuário ${socket.data.username} desconectado da sala: ${roomID}`);
            
            if(rooms.get(roomID).size === 0) {
                rooms.delete(roomID);
                console.log(`Sala ${roomID} foi removida por estar vazia.`);
            }
        }
        
    })

})

server.listen(PORT, () => console.log('server is running'))