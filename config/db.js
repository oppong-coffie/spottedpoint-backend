const mongoose = require('mongoose');
const dns = require('dns');

// Set fallback public DNS servers to bypass local DNS querySrv ECONNREFUSED issues on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Failed to set DNS servers, using system default:', e.message);
}

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    // Self-heal when MONGO_URI and JWT_SECRET are on the same line in .env
    if (mongoUri && mongoUri.includes('JWT_SECRET=')) {
      const parts = mongoUri.split('JWT_SECRET=');
      mongoUri = parts[0];
      process.env.JWT_SECRET = parts[1];
      console.log('Successfully extracted JWT_SECRET and cleaned MONGO_URI from combined env line.');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;