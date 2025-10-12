const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import middleware
const { errorHandler, logger } = require('./src/middleware');

// Import routes
const { userRoutes, assetRoutes, incomeRoutes, liabilityRoutes } = require('./src/routes');

// Connect to MongoDB
const connectDB = require('./src/config/db');
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/liabilities', liabilityRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Wealth Management API' });
});

// Error handler
app.use(errorHandler);

// Set port and start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
