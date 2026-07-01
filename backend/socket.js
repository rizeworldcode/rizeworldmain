const socketIo = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: [
          'https://admin.rizeworld.in',
          'https://employee.rizeworld.in',
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
        ],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
