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

  socket.on('fileTransferRequest', ({ to, files }) => {
    const targetDevice = connectedDevices.find(d => d.id === to);
    if (targetDevice) {
      io.to(targetDevice.socketId).emit('fileTransferRequest', {
        from: socket.id,
        files
      });
    }
  });

  socket.on('fileTransferStart', ({ to, fileName, fileType, fileData }) => {
    console.log(`Starting file transfer to ${to}: ${fileName}`);
    const targetDevice = connectedDevices.find(d => d.id === to);
    if (targetDevice) {
      io.to(targetDevice.socketId).emit('fileTransferReceive', {
        from: socket.id,
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
        from: socket.id,
        accepted
      });
    }
  });

  socket.on('rtc-offer', ({ to, offer }) => {
    socket.to(to).emit('rtc-offer', { from: socket.id, offer });
  });

  socket.on('rtc-answer', ({ to, answer }) => {
    socket.to(to).emit('rtc-answer', { from: socket.id, answer });
  });

  socket.on('rtc-ice-candidate', ({ to, candidate }) => {
    socket.to(to).emit('rtc-ice-candidate', { from: socket.id, candidate });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});