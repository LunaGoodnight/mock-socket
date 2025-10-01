const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

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