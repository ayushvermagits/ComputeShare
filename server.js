require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

const taskRoutes = require('./src/routes/taskRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Basic route - test karne ke liye
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ComputeShare Backend Running! 🚀' });
});

// Socket.io - worker connections
// Online workers track karne ke liye
let activeWorkers = {};

io.on('connection', (socket) => {
  console.log(`🟢 Worker connected: ${socket.id}`);

  // Worker join hota hai
  socket.on('worker:join', (data) => {
    activeWorkers[socket.id] = {
      workerId: data.workerId,
      cpu: data.cpu,
      joinedAt: new Date()
    };
    console.log(`👷 Worker joined: ${data.workerId}`);
    
    // Sab clients ko update bhejo
    io.emit('dashboard:update', {
      activeWorkers: Object.keys(activeWorkers).length,
      workers: activeWorkers
    });
  });

  // Worker disconnect hota hai
  socket.on('disconnect', () => {
    console.log(`🔴 Worker disconnected: ${socket.id}`);
    delete activeWorkers[socket.id];
    
    // Sab clients ko update bhejo
    io.emit('dashboard:update', {
      activeWorkers: Object.keys(activeWorkers).length,
      workers: activeWorkers
    });
  });
});

// Server start
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});