# Socket.IO Admin Dashboard

A Socket.IO server with an admin dashboard to broadcast events to connected clients.

## Features

- Admin dashboard to trigger events
- Broadcast messages to all connected clients
- Support for custom event names and data
- CORS enabled for cross-origin requests
- Real-time Socket.IO communication

## Installation

```bash
npm install
```

## Running Locally

```bash
npm start
```

Server will run on `http://localhost:1024`

## Running on VPS

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment (optional)
```bash
cp .env.example .env
# Edit .env if you want to change PORT or HOST
```

### 3. Start the server
```bash
npm start
```

Or use PM2 for production:
```bash
npm install -g pm2
pm2 start server.js --name socket-server
pm2 save
pm2 startup
```

### 4. Open firewall port
Make sure port 1024 (or your custom PORT) is open on your VPS:
```bash
# For Ubuntu/Debian with ufw
sudo ufw allow 1024

# For CentOS/RHEL with firewalld
sudo firewall-cmd --permanent --add-port=1024/tcp
sudo firewall-cmd --reload
```

## Admin Dashboard

Access the admin dashboard at: `http://your-vps-ip:1024/`

## Frontend Integration

Add this to your frontend website:

```html
<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
<script>
  const socket = io('http://your-vps-ip:1024');

  // Listen for OPEN_KIND_NOTICE event
  socket.on('OPEN_KIND_NOTICE', (data) => {
    console.log('OPEN_KIND_NOTICE:', data);
    // Handle the event in your frontend
  });

  // Listen for other events
  socket.on('notification', (data) => {
    console.log('Notification:', data);
  });

  socket.on('alert', (data) => {
    console.log('Alert:', data);
  });

  socket.on('emergency', (data) => {
    console.log('Emergency:', data);
  });
</script>
```

## API Endpoints

### POST /broadcast
Broadcast an event to all connected clients.

**Request body:**
```json
{
  "event": "OPEN_KIND_NOTICE",
  "data": {
    "message": "Your message here",
    "timestamp": "2025-10-15T10:00:00Z"
  }
}
```

### GET /status
Check server status and connected clients count.

**Response:**
```json
{
  "status": "online",
  "connectedClients": 5,
  "uptime": 3600
}
```

## Port Configuration

Default port: 1024

To change the port, set the `PORT` environment variable:
```bash
PORT=3000 npm start
```

Or create a `.env` file with:
```
PORT=3000
HOST=0.0.0.0
```
