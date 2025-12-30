# Getransfr Server

The Getransfr Server is a high-performance Node.js signaling hub that facilitates device discovery and connection handshakes for the Getransfr platform. It acts as a lightweight coordination layer between peer-to-peer clients.

## Core Responsibilities

- **Discovery**: Manages and broadcasts active device lists to all nodes on the same local network, enabling instant peer detection.
- **WebRTC Signaling**: Relays crucial connection metadata, including SDP offers, answers, and ICE candidates, to establish direct peer-to-peer data channels.
- **Lifecycle Management**: Real-time tracking of device connectivity with automatic list updates and a grace period for transient disconnections.
- **Identification and Naming**: Assigns unique persistent identifiers and generates human-readable random names for all connected devices.

## Technical Architecture

### WebSocket Event Protocol

The server utilizes Socket.io to manage a suite of events that maintain system state:

#### Client to Server
- **deviceAnnounce**: Registers a new device in the discovery pool.
- **deviceReconnect**: Re-links an existing device session using its persistent ID.
- **requestDevices**: Requests a fresh list of all currently connected peers.
- **rtc-offer / rtc-answer / rtc-ice-candidate**: Encapsulated signaling data for WebRTC handshakes.
- **clipboard-share**: Relays text data for cross-device clipboard synchronization.

#### Server to Client
- **deviceInfo**: Sends assigned identification and profile data back to the client.
- **connectedDevices**: Provides an array of all active peers on the local network.
- **rtc-offer / rtc-answer / rtc-ice-candidate**: Relayed signaling data from a remote peer.
- **clipboard-receive**: Distributes shared text to the intended recipient.

## Security Architecture

This server is strictly a signaling agent and does not process, store, or have access to the contents of the files being transferred. All file data is streamed directly between peers via WebRTC, ensuring maximum privacy and data integrity. The signaling server is purely responsible for the initial "handshake" and coordinating device discovery.