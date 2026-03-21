import 'dotenv/config'; // Load env variables early before any other imports
import http from 'http';
import app from './src/app';
import { startAutoRejectBookingCron } from './src/crons/autoRejectBooking';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Start Cron Jobs
startAutoRejectBookingCron();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});