import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`[LMS API Server] Running in ${env.NODE_ENV} mode on port ${PORT}`);
  console.log(`[LMS API Server] Health check available at http://localhost:${PORT}/api/health`);
});

process.on('SIGTERM', () => {
  console.log('[LMS API Server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[LMS API Server] Closed remaining connections.');
    process.exit(0);
  });
});

export default server;
