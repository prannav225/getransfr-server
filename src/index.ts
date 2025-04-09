import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { generateName } from './utils/nameGenerator';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 10 * 1024 * 1024 * 1024 // 10GB
});

interface Device {
  id: string;
  name: string;
  socketId: string;
}

const connectedDevices: Device[] = [];

// Remove the old generateDeviceName function as we're importing it

io.on('connection', (socket) => {
  const device: Device = {
    id: uuidv4(),
    name: generateName(),
    socketId: socket.id
  };

  connectedDevices.push(device);
  
  // Send the current device info to the newly connected client
  socket.emit('deviceInfo', device);
  
  // Broadcast the updated list of connected devices to all clients
  io.emit('connectedDevices', connectedDevices);

  socket.on('disconnect', () => {
    const index = connectedDevices.findIndex(d => d.socketId === socket.id);
    if (index !== -1) {
      connectedDevices.splice(index, 1);
      io.emit('connectedDevices', connectedDevices);
    }
  });

  socket.on('fileTransferRequest', ({ to, files, fileData }) => {
    const targetDevice = connectedDevices.find(d => d.id === to);
    if (targetDevice) {
      io.to(targetDevice.socketId).emit('fileTransferRequest', {
        from: device.id,
        files,
        fileData
      });
    }
  });

  socket.on('fileTransferStart', ({ to, fileName, fileType, fileData }) => {
    const targetDevice = connectedDevices.find(d => d.id === to);
    if (targetDevice) {
      io.to(targetDevice.socketId).emit('fileTransferReceive', {
        from: device.id,
        fileName,
        fileType,
        fileData
      });
    }
  });

  socket.on('fileTransferResponse', ({ to, accepted }) => {
    const targetDevice = connectedDevices.find(d => d.id === to);
    if (targetDevice) {
      io.to(targetDevice.socketId).emit('fileTransferResponse', {
        from: device.id,
        accepted
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});