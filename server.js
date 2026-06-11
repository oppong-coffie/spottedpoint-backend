const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Handle Private Network Access preflight requests (public to local requests)
app.use((req, res, next) => {
  if (req.headers['access-control-request-private-network']) {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
  next();
});

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://spottedpoint-frontend-production.up.railway.app'
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/team', require('./routes/team'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/media', require('./routes/media'));

app.get('/', (req, res) => res.json({ message: 'Spotted Point Media API running' }));

const fs = require('fs');
const path = require('path');

// Global error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  
  try {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}\nError: ${err.message}\nStack: ${err.stack}\n\n`;
    fs.appendFileSync(path.join(__dirname, 'error.log'), logMessage);
  } catch (logErr) {
    console.error('Failed to write to error.log:', logErr);
  }

  res.status(err.status || err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: err.stack || err
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));