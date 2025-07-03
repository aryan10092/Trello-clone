const Task = require('../models/Task');
const ActionLog = require('../models/ActionLog');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Join board room (for future multi-board support)
    socket.join('main-board');

    // Listen for task changes and broadcast
    socket.on('taskChanged', () => {
      io.to('main-board').emit('refreshTasks');
    });

    // Listen for action log changes and broadcast
    socket.on('actionLogChanged', () => {
      io.to('main-board').emit('refreshActions');
    });
  });
}; 