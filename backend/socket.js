const socketIo = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
          'http://localhost:5176',
          'http://localhost:5177',
          'http://localhost:5178',
          'http://localhost:5179',
          'http://localhost:5180',
          'https://admin.rizeworld.in',
          'https://employee.rizeworld.in',
          'https://rizeworld.in',
          'https://www.rizeworld.in',
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
