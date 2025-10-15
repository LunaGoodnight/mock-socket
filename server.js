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

// Parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

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

// API endpoint to broadcast messages to all connected clients
app.post('/broadcast', (req, res) => {
    const { message, event, data } = req.body;

    if (event) {
        // Send custom event with data
        io.emit(event, data);
        console.log(`Broadcasting event "${event}" to all clients:`, data);
        res.json({ status: 'success', message: `Event "${event}" broadcasted to all clients` });
    } else if (message) {
        // Send default message event
        io.emit('message', message);
        console.log('Broadcasting message to all clients:', message);
        res.json({ status: 'success', message: 'Message broadcasted to all clients' });
    } else {
        res.status(400).json({ status: 'error', message: 'No message or event provided' });
    }
});

// Status endpoint to check if server is running
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        connectedClients: io.engine.clientsCount,
        uptime: process.uptime()
    });
});

const PORT = process.env.PORT || 1024;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`Socket.IO server running at http://${HOST}:${PORT}`);
});