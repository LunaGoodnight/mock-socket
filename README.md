# Mock Socket.IO Server

A simple Socket.IO server application dockerized for easy deployment.

## Prerequisites

- Docker
- Docker Compose

## Project Structure

```
mock-socket/
├── server.js           # Main Socket.IO server
├── package.json        # Node.js dependencies
├── Dockerfile          # Docker image configuration
├── docker-compose.yml  # Docker Compose configuration
└── .dockerignore       # Files to exclude from Docker build
```

## Quick Start

### Using Docker Compose (Recommended)

Build and run the application:

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up -d --build
```

To stop the application:

```bash
docker-compose down
```

### Using Docker Commands

Build the Docker image:

```bash
docker build -t mock-socket .
```

Run the container:

```bash
docker run -p 1024:1024 mock-socket
```

To run in detached mode:

```bash
docker run -d -p 1024:1024 mock-socket
```

## Access the Server

Once running, the Socket.IO server will be accessible at:

```
http://localhost:1024
```

## Docker Configuration Details

### Dockerfile

- Uses Node.js 18 Alpine image for minimal size
- Installs production dependencies only
- Exposes port 1024
- Runs the server using `node server.js`

### docker-compose.yml

- Maps port 1024 from container to host
- Sets NODE_ENV to production
- Configures automatic restart policy

### .dockerignore

Excludes unnecessary files from the Docker build context:
- node_modules
- Git files
- Docker configuration files
- Logs and system files

## Development

To run locally without Docker:

```bash
npm install
npm start
```

## Server Features

- Accepts Socket.IO connections
- Sends welcome message on connection
- Echoes received messages back to client
- Logs connection/disconnection events