const io = require('socket.io')(3000, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('NEW USER CONNECTED');
  socket.on('place', (cell, currentClass, isOnTurn) => {
    io.emit('swap');
    socket.broadcast.emit('showMessage', isOnTurn);
    socket.broadcast.emit('placeMark', cell, currentClass);
  });
});
