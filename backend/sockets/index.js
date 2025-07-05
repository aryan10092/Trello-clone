const Task = require('../models/Task');
const ActionLog = require('../models/ActionLog');

module.exports = (io) => {
  io.on('connection', (socket) => {
    
    socket.join('main-board');

   
    socket.on('taskChanged', () => {
      io.to('main-board').emit('refreshTasks');
    });

    
    socket.on('actionLogChanged', () => {
      io.to('main-board').emit('refreshActions');
    });
  });
}; 