# Getransfr Server

The Getransfr Server is a Node.js signaling hub that facilitates device discovery and connection handshakes for the Getransfr platform. It acts as a lightweight coordination layer between peer-to-peer clients.

## core responsibilities

- Discovery: Manages and broadcasts active device lists to all nodes on the same local network.
- WebRTC Signaling: Relays connection metadata (offers, answers, and ICE candidates) to enable direct peer-to-peer data transport.
- Lifecycle Management: Tracks device connectivity and ensures network lists are updated immediately upon joins or disconnects.
- Friendly Naming: Assigns unique identifiers and generates human-readable random names for connected devices.

## technical documentation

### websocket event API

The server handles several key event types to maintain system state:

#### client to server
- deviceInfo: Reports client metadata (avatar, device type, name) to the discovery pool.
- fileTransferRequest: Initiates a transfer handshake with a target peer.
- fileTransferResponse: Relays the acceptance or rejection of a file transfer request.
- rtc-offer / rtc-answer / rtc-ice-candidate: Standard WebRTC signaling vectors.

#### server to client
- connectedDevices: Provides a comprehensive list of all active peers on the network.
- fileTransferStart: Signals the recipient that a file stream is beginning.

## deployment

### local development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Launch development server:
   ```bash
   npm run dev
   ```

### production

To build and serve the application for production:
```bash
npm run build
npm start
```

The server defaults to port 3001 unless otherwise specified in the environment variables.

## security architecture

This server is strictly a signaling agent. It does not process, store, or have access to the contents of the files being transferred. All file data is encrypted and transferred directly between peers via WebRTC, ensuring a private and secure user experience.