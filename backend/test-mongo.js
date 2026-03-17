const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('Đang thử kết nối tới MongoDB với URI:', uri.replace(/:([^:@]+)@/, ':***@'));

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(conn => {
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
    process.exit(1);
  });
