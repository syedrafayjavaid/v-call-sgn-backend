const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://18.182.4.201:3000']
    }
});
const dotenv = require('dotenv');

// loading the env variables
dotenv.config()



// A server connection
io.on('connection', socket => {
    socket.emit("myId", socket.id);

    // listening to disconnect event
    socket.on('disconnect', () => {
        socket.broadcast.emit('endCall')
    })


    // listening to call user event 
    socket.on('callUser', (userData) => {
        io.to(userData.userToCall).emit("callUser", { signal: userData.signalData, from: userData.from, name: userData.name })
    })


    socket.on('callAnswer', (userData) => {
        io.to(userData.to).emit('callAccepted', userData.signal)
    })
})


// Listening to the server
server.listen(process.env.PORT, () => { console.log(`The server is listening on port ${process.env.PORT}`); })

