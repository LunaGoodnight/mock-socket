const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    // Send a welcome message to the client
    socket.emit('message', 'Welcome to Socket.IO server!');

    // Listen for messages from the client
    socket.on('message', (msg) => {
        console.log('Client says:', msg);
        // Echo the message back
        socket.emit('message', `Server received: ${msg}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(1024, () => {
    console.log('mock Socket.IO server running at http://localhost:1024');
});