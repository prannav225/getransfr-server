# Getransfr Server

The backend for the Getransfr file sharing app, providing real‑time device synchronization and secure file transfers over WebSocket and WebRTC.

## Features

- 🔄 Real‑time device sync
- 📡 WebSocket communication
- 📦 Efficient file transfer handling
- 🔒 Local network security
- 🚀 High‑speed data streaming
- 🎯 WebRTC signaling for P2P connections
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


### WebSocket Events

- `connection` – new device connected
- `deviceInfo` – exchange device info
- `connectedDevices` – list of devices
- `fileTransferStart` – start a transfer
- `fileTransferRequest` – request a transfer
- `fileTransferResponse` – accept/reject
- `fileTransferReceive` – receive file data
- `rtc-offer` / `rtc-answer` – WebRTC signaling
- `rtc-ice-candidate` – ICE candidate exchange
- `disconnect` – device disconnected