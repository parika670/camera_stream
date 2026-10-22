const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  socket.on('user-offer', (data) => {
    socket.broadcast.emit('user-offer', { id: socket.id, sdp: data.sdp });
  });

  socket.on('user-ice', (data) => {
    socket.broadcast.emit('user-ice', { id: socket.id, candidate: data.candidate });
  });

  socket.on('admin-answer', (data) => {
    io.to(data.to).emit('admin-answer', { sdp: data.sdp });
  });

  socket.on('admin-ice', (data) => {
    io.to(data.to).emit('admin-ice', { candidate: data.candidate });
  });

  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
  });
});

server.listen(3000, () => console.log('Server is running on port 3000'));
