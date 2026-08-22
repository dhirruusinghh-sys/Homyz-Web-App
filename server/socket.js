import { Server } from 'socket.io';

let io;
const users = new Map(); // Map to store userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // When a user logs in, they join with their user ID
    socket.on('setup', (userData) => {
      if (userData && userData._id) {
        socket.join(userData._id);
        users.set(userData._id, socket.id);
        socket.emit('connected');
        console.log(`User ${userData._id} connected to socket`);
      }
    });

    // Handle incoming messages
    socket.on('newMessage', (newMessageReceived) => {
      let chat = newMessageReceived.chat; // Contains sender and receiver info if we expand it

      if (!newMessageReceived.receiver) return console.log('Message has no receiver defined');

      // Send the message to the receiver's room
      socket.in(newMessageReceived.receiver).emit('messageReceived', newMessageReceived);
    });

    // Typing indicators
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stopTyping', (room) => socket.in(room).emit('stopTyping'));

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove from users map
      for (let [key, value] of users.entries()) {
        if (value === socket.id) {
          users.delete(key);
          break;
        }
      }
    });
  });
};

// Expose io object if needed elsewhere
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
