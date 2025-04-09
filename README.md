
# DropMate Server

Backend server for DropMate file sharing application, handling real-time connections and file transfers.

## Features

- 🔄 Real-time device synchronization
- 📡 WebSocket communication
- 📦 File transfer handling
- 🔒 Local network security
- 🚀 Fast data streaming

## Tech Stack

- Node.js
- Express
- Socket.IO
- TypeScript

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3000
HOST=localhost
```

## API Endpoints

### WebSocket Events

- `connection`: New device connected
- `deviceInfo`: Device information exchange
- `connectedDevices`: List of available devices
- `fileTransferStart`: Initiate file transfer
- `fileTransferRequest`: File transfer request
- `fileTransferResponse`: Transfer acceptance/rejection
- `fileTransferReceive`: File data transmission

## Project Structure

```
src/
├── index.ts        # Server entry point
├── socket/         # Socket.IO event handlers
├── types/         # TypeScript definitions
└── utils/         # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request