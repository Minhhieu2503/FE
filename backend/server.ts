import 'dotenv/config'; // Load env variables early before any other imports
import http from 'http';
import app from './src/app';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});