# VPS Deployment Guide

Quick guide to deploy this Socket.IO server to your VPS.

## Step 1: Upload to VPS

Upload your project to VPS using git or scp:

```bash
# Using git
git clone your-repo-url
cd mock-socket

# Or using scp from local machine
scp -r /path/to/mock-socket user@your-vps-ip:/path/to/destination
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Open Firewall Port

Open port 1024 on your VPS firewall:

**For Ubuntu/Debian (using ufw):**
```bash
sudo ufw allow 1024
sudo ufw status  # Check if port is open
```

**For CentOS/RHEL (using firewalld):**
```bash
sudo firewall-cmd --permanent --add-port=1024/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports  # Check if port is open
```

## Step 4: Start the Server

**Option A: Simple Start (for testing)**
```bash
npm start
```

**Option B: Production Start with PM2 (recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start server.js --name socket-server

# Make PM2 restart on server reboot
pm2 save
pm2 startup

# Useful PM2 commands
pm2 status          # Check status
pm2 logs            # View logs
pm2 restart socket-server   # Restart
pm2 stop socket-server      # Stop
pm2 delete socket-server    # Remove
```

## Step 5: Verify Server is Running

Check if server is accessible:

```bash
# From VPS
curl http://localhost:1024/status

# From your local machine
curl http://your-vps-ip:1024/status
```

You should see:
```json
{
  "status": "online",
  "connectedClients": 0,
  "uptime": 123.45
}
```

## Step 6: Access Admin Dashboard

Open in your browser:
```
http://your-vps-ip:1024/
```

You should see the admin dashboard with buttons to send events.

## Step 7: Connect Your Frontend

Add this code to your frontend website:

```html
<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
<script>
  // Replace 'your-vps-ip' with your actual VPS IP address
  const socket = io('http://your-vps-ip:1024');

  // Listen for connection
  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });

  // Listen for OPEN_KIND_NOTICE event
  socket.on('OPEN_KIND_NOTICE', (data) => {
    console.log('OPEN_KIND_NOTICE received:', data);
    // Your code to handle the event
    // For example: show a modal, display notification, etc.
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

  socket.on('message', (data) => {
    console.log('Message:', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
</script>
```

## Step 8: Test the Connection

1. Open your frontend website in a browser
2. Open browser console (F12)
3. You should see: "Connected to Socket.IO server"
4. Go to admin dashboard: `http://your-vps-ip:1024/`
5. Click "Open Kind Notice" button
6. Check your frontend console - you should see the event received!

## Troubleshooting

### Port not accessible from outside

```bash
# Check if server is running
pm2 status

# Check if port is listening
netstat -tulpn | grep 1024
# or
ss -tulpn | grep 1024

# Check firewall
sudo ufw status
# or
sudo firewall-cmd --list-ports
```

### Server crashes or doesn't start

```bash
# View logs with PM2
pm2 logs socket-server

# Or run directly to see errors
node server.js
```

### CORS errors in browser

The server already has CORS enabled for all origins. If you still get CORS errors, check:
- Make sure you're using `http://` not `https://` (unless you set up SSL)
- Check browser console for the exact error message

### Change the port

If port 1024 is already in use, edit `server.js` line 79:

```javascript
const PORT = process.env.PORT || 3000;  // Change 1024 to your desired port
```

Then restart:
```bash
pm2 restart socket-server
```

## Security Notes

**Important for Production:**

1. **Restrict CORS origins** - Edit `server.js` to only allow your frontend domain:
```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.com',  // Change from '*'
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

2. **Add authentication** - Protect the `/broadcast` endpoint with authentication

3. **Use HTTPS** - Set up SSL certificate with nginx or certbot

4. **Use environment variables** - Don't hardcode sensitive data

## Quick Reference

### Server URLs
- Admin Dashboard: `http://your-vps-ip:1024/`
- Status Check: `http://your-vps-ip:1024/status`
- Broadcast API: `http://your-vps-ip:1024/broadcast`

### PM2 Commands
```bash
pm2 start server.js --name socket-server
pm2 stop socket-server
pm2 restart socket-server
pm2 logs socket-server
pm2 delete socket-server
```

### Send Event via API (curl)
```bash
curl -X POST http://your-vps-ip:1024/broadcast \
  -H "Content-Type: application/json" \
  -d '{"event":"OPEN_KIND_NOTICE","data":{"message":"test"}}'
```

## Done!

Your Socket.IO server is now running on your VPS. Click buttons on the admin dashboard to send events to all connected clients!
