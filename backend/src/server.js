// Boots the HTTP server and attaches the Socket.io server.
// Entry point referenced by package.json's "dev"/"start" scripts.

const http = require('http');
const app = require('./app');
const { env } = require('./config/env');
const { attachSocketServer } = require('./sockets/index');

const server = http.createServer(app);

// Attach Socket.io for real-time messaging
attachSocketServer(server);

// TODO: once jobs/scheduler.js is implemented —
// const { startScheduler } = require('./jobs/scheduler');
// startScheduler();

server.listen(env.port, () => {
  console.log(`hulurent-backend listening on port ${env.port}`);
});
