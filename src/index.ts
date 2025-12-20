import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { generateName } from './utils/nameGenerator';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
  },
  maxHttpBufferSize: 1e8, // Reduce to 100MB since we're using P2P for files
  transports: ['websocket', 'polling']
});

interface Device {
  id: string;
  name: string;
  socketId: string;
}

const connectedDevices = new Map<string, Device>();

// Broadcast updated device list to all clients
function broadcastDeviceList() {
  const deviceList = Array.from(connectedDevices.values());
  io.emit('connectedDevices', deviceList);
}

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  const clientId = socket.handshake.query.clientId as string;
  let device: Device;

  if (clientId && connectedDevices.has(clientId)) {
    device = connectedDevices.get(clientId)!;
    device.socketId = socket.id;
    console.log('Reconnected device:', device.name, device.id);
  } else {
    device = {
      id: uuidv4(),
      name: generateName(),
      socketId: socket.id
    };
    console.log('New device created:', device.name, device.id);
  }

  // Always update the device in the map
  connectedDevices.set(device.id, device);

  // Send device info to the client
  socket.emit('deviceInfo', device);

  // Broadcast device list to all clients
  broadcastDeviceList();

  // Handle device reconnection
  socket.on('deviceReconnect', (deviceId) => {
    if (deviceId && connectedDevices.has(deviceId)) {
      const existingDevice = connectedDevices.get(deviceId)!;

      // If we're switching from a temporary device to an existing one,
      // remove the temporary device
      if (device.id !== existingDevice.id) {
        connectedDevices.delete(device.id);
        io.emit('deviceDisconnected', device.id);
      }
      existingDevice.socketId = socket.id;
      device = existingDevice;
      connectedDevices.set(deviceId, existingDevice);
      socket.emit('deviceInfo', existingDevice);
      broadcastDeviceList();
    }
  });

  // Handle device announcement
  socket.on('deviceAnnounce', () => {
    connectedDevices.set(device.id, device);
    socket.emit('deviceInfo', device);
    broadcastDeviceList();
  });

  // Handle device list request
  socket.on('requestDevices', () => {
    socket.emit('deviceInfo', device);
    // Send the full list of connected devices
    const deviceList = Array.from(connectedDevices.values());
    socket.emit('connectedDevices', deviceList);
  });

  // Handle device disconnection
  socket.on('disconnect', () => {
    console.log('Device disconnected:', device?.name, device?.id);
    // Don't immediately remove the device, give it a chance to reconnect
    setTimeout(() => {
      const currentDevice = connectedDevices.get(device.id);
      if (currentDevice && currentDevice.socketId === socket.id) {
        connectedDevices.delete(device.id);
        broadcastDeviceList();
        io.emit('deviceDisconnected', device.id);
      }
    }, 5000); // 5 second grace period for reconnection
  });

  // Handle explicit device disconnection     
  socket.on('deviceDisconnecting', (deviceId) => {
    if (deviceId && connectedDevices.has(deviceId)) {
      connectedDevices.delete(deviceId);
      broadcastDeviceList();
      io.emit('deviceDisconnected', deviceId);
    }
  });

  // Signaling events
  socket.on('rtc-offer', ({ to, offer }) => {
    console.log(`Relaying rtc-offer from ${socket.id} to ${to}`);
    socket.to(to).emit('rtc-offer', { from: socket.id, offer });
  });

  socket.on('rtc-answer', ({ to, answer }) => {
    console.log(`Relaying rtc-answer from ${socket.id} to ${to}`);
    socket.to(to).emit('rtc-answer', { from: socket.id, answer });
  });

  socket.on('rtc-ice-candidate', ({ to, candidate }) => {
    // console.log(`Relaying rtc-ice-candidate from ${socket.id} to ${to}`);
    socket.to(to).emit('rtc-ice-candidate', { from: socket.id, candidate });
  });

  // Clipboard sharing event
  socket.on('clipboard-share', ({ to, text }) => {
    console.log(`Relaying clipboard-share from ${socket.id} to ${to}`);
    socket.to(to).emit('clipboard-receive', { from: socket.id, text });
  });
});

const PORT = process.env.PORT || 5001;
httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});