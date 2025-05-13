# DropMate Server

Backend server for DropMate file sharing application, handling real-time connections and file transfers.

## Features

- 🔄 Real-time device synchronization
- 📡 WebSocket communication
- 📦 File transfer handling
- 🔒 Local network security
- 🚀 Fast data streaming
- 🎯 WebRTC signaling support
- 🔍 Automatic device discovery
- 🏷️ Random device name generation
- 🔌 Automatic connection management

## Tech Stack

- Node.js
- Express
- Socket.IO
- TypeScript
- UUID
- CORS

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
# Start development server with hot reload
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
- `rtc-offer`: WebRTC offer signal
- `rtc-answer`: WebRTC answer signal
- `rtc-ice-candidate`: WebRTC ICE candidate exchange
- `disconnect`: Handle device disconnection

### Device Interface

```typescript
interface Device {
  id: string;        // Unique device identifier
  name: string;      // Generated device name
  socketId: string;  // Socket connection ID
}
```

## Project Structure

```
src/
├── index.ts        # Server entry point
├── socket/         # Socket.IO event handlers
├── types/         # TypeScript definitions
└── utils/         # Helper functions
    └── nameGenerator.ts  # Random name generation utility
```

## Configuration

### Server Settings
- Max HTTP Buffer Size: 100MB
- Supported Transports: WebSocket, Polling
- CORS: Enabled for all origins
- Port: 3000 (default)

### Name Generation
- Implements random device name generation
- Combines adjectives and nouns for unique names
- Over 3000 possible unique combinations

## Development Notes

- Uses `ts-node-dev` for development with hot reload
- Implements WebRTC signaling for P2P connections
- Handles automatic cleanup of disconnected devices
- Supports both WebSocket and HTTP polling
- TypeScript configuration with strict mode enabled

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request